const Expense=require('../model/expense');

exports.addExpense=async(req,res,next)=>{
	try{	
		const amount=req.body.amount;
		const description=req.body.description;
		const category=req.body.category;
		await Expense.create({amount:amount,description:description,category:category});
		res.status(200).json({success:true,message:"Expense added successfully"});
	}catch(err){res.json({success:false,message:err});}
}

exports.getExpenses=async (req,res,next)=>{
	try{
	const expenses=await Expense.findAll();
	res.status(200).json(expenses);
	}catch(err){
		console.log(err);
		res.json(err);}
}

exports.deleteExpense=async (req,res,next)=>{
	try{
	const id=req.params.id;
	await Expense.destroy({where:{id:id}});
	res.json({success:true,message:"deleted successfully"});
	}
	catch(err){
		console.log(err);
	}
}