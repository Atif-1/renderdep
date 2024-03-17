const Expense=require('../model/expense');
const User=require('../model/user');

exports.getLeaderboard=async(req,res,next)=>{
	try{
		const leaderboard=[];
		const users=await User.findAll();
		users.forEach((user) => {
			leaderboard.push({name:user.name ,total_cost:user.totalexpenses});
		});
		leaderboard.sort((a,b)=>b.total_cost-a.total_cost);
		console.log(leaderboard);
		res.status(200).json(leaderboard);
	}catch(err){
		console.log(err);
		res.status(500).json(err);
	}

}