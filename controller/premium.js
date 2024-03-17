const Expense=require('../model/expense');
const User=require('../model/user');
const sequelize = require('../util/database');

exports.getLeaderboard=async(req,res,next)=>{
	try{
	const leaderboardOfUser=await User.findAll({
		attributes:['id','name',[sequelize.fn('sum',sequelize.col('expenses.amount')),'total_cost']],
		include:[
			{
				model:Expense,
				attributes:[]
			}
		],
		group:['user.id'],
		order:[['total_cost','DESC']]
	})
	res.status(200).json(leaderboardOfUser);
	}catch(err){
		console.log(err);
		res.status(500).json(err);
	}

}