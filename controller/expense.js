const Expense=require('../model/expense');
const User=require('../model/user');
const DownloadLink=require('../model/downloadLink');
const sequelize=require('../util/database');
const AWS=require('aws-sdk');
const S3Services=require('../services/S3services');
const UserServices=require('../services/userservice');
const logger=require('../util/logger');


exports.downloadExpenses=async(req,res,next)=>{
	try{
	const expenses=await UserServices.getExpenses(req);
	const stringifyFileData=JSON.stringify(expenses);
	const userId=req.user.id;
	const fileName=`Expenses${userId}/${new Date()}.txt`;
	const fileUrl=await S3Services.uploadToS3(stringifyFileData,fileName);
	DownloadLink.create({url:fileUrl,userId:req.user.id});
	res.status(200).json({fileUrl,success:true});
	}catch(err){
		console.log(err);
		res.status(500).json(err);
	}
 }



exports.addExpense=async(req,res,next)=>{
	const t=await sequelize.transaction();
	try{	
		const amount=req.body.amount;
		const description=req.body.description;
		const category=req.body.category;
		const user=await User.findByPk(req.user.id);
		const currentTotal=parseInt(await user.totalexpenses);
		const recentAmt=parseInt(amount);
		await Expense.create({amount:amount,description:description,category:category,userId:req.user.id},{transaction:t});
		await User.update({totalexpenses:currentTotal+recentAmt},{where:{id:req.user.id},transaction:t});
		await t.commit();
		res.status(200).json({success:true,message:"Expense added successfully"});
	}catch(err){
		await t.rollback();
		logger.error('controller-expense'+err);
		res.json({success:false});
	}
}

exports.getExpenses=async (req,res,next)=>{
	try{
	const page=parseInt(req.params.page);
	const rows=parseInt(req.header("rows"));
	const total_expenses=await Expense.findAll({where:{userId:req.user.id}});
	let totalexp=total_expenses.length;
	

	const expenses=await Expense.findAll({where:{
		userId:req.user.id
	},
		offset:(page-1)*rows,
		limit:rows
	});
	res.json({
		expenses:expenses, 
		currentPage:page,
		hasNextPage:(rows*page)<totalexp,
		nextPage:page+1,
		hasPreviousPage:page>1,
		previousPage:page-1,
		lastPage:Math.ceil(totalexp/rows)
	})

	}catch(err){
		logger.error('controller-expense'+err);
		res.status(500);
	}
}

exports.deleteExpense=async (req,res,next)=>{
	const t=await sequelize.transaction();
	try{ 
	const id=req.params.id;
	const user=await User.findByPk(req.user.id);
	const deletedExpense=await Expense.findOne({where:
	{id:id}});
	const newTotalExpenses=Number(user.totalexpenses)-Number(deletedExpense.amount);
	
	await Expense.destroy({where:{id:id,userId:req.user.id},transaction:t});
	await User.update({totalexpenses:newTotalExpenses},{where:{id:req.user.id},transaction:t});
	await t.commit();
	res.json({success:true,message:"deleted successfully"});
	}
	catch(err){
		await t.rollback();
		logger.error('controller-expense'+err);
	}
}

exports.getTotalExpenses=async(req,res,next)=>{
	try{
		const totalExpenses=await Expense.findAll({where:{userId:req.user.id}});
		res.json(totalExpenses);
	}catch(err){
		logger.error(`controller-expense ${err}`);
	}
}