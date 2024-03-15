const Expense=require('../model/expense');
const User=require('../model/user');

exports.getLeaderboard=async(req,res,next)=>{
	try{
	const users=await  User.findAll();
	const expenses=await Expense.findAll();
	const totalExpenses={};
	expenses.forEach((expense) => {
		if(totalExpenses[expense.userId]){
			totalExpenses[expense.userId]+=expense.amount;
		}
		else{
			totalExpenses[expense.userId]=expense.amount;
		}
	});
	console.log(totalExpenses);
	const board=[];
	users.forEach((user)=>{
		if(totalExpenses[user.id]){
			board.push({name:user.name,TotalExpense:totalExpenses[user.id]});
		}
		else{
			board.push({name:user.name,TotalExpense:0});
		}
	});
	board.sort((a,b)=>b.TotalExpense-a.TotalExpense);
	console.log(board);
	res.status(200).json(board);
	}catch(err){
		console.log(err);
		res.status(500).json(err);
	}

}