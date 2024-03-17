const Expense=require('../model/expense');
const User=require('../model/user');

exports.addExpense=async(req,res,next)=>{
	try{	
		const amount=req.body.amount;
		const description=req.body.description;
		const category=req.body.category;
		const user=await User.findByPk(req.user.id);
		const currentTotal=parseInt(await user.totalexpenses);
		console.log(currentTotal);
		const recentAmt=parseInt(amount);
		console.log(amount);
		await Expense.create({amount:amount,description:description,category:category,userId:req.user.id});
		await User.update({totalexpenses:currentTotal+recentAmt},{where:{id:req.user.id}});
		res.status(200).json({success:true,message:"Expense added successfully"});
	}catch(err){res.json({success:false,message:err});}
}

exports.getExpenses=async (req,res,next)=>{
	try{
	const expenses=await Expense.findAll({where:{userId:req.user.id}});
	const user=await User.findOne({where:{id:req.user.id}});
	const ispremium=user.ispremium;
	res.status(200).json({expenses,ispremium});
	}catch(err){
		console.log(err);
		res.json(err);}
}

exports.deleteExpense=async (req,res,next)=>{
	try{
	const id=req.params.id;
	await Expense.destroy({where:{id:id,userId:req.user.id}});
	res.json({success:true,message:"deleted successfully"});
	}
	catch(err){
		console.log(err);
	}
}