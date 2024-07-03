const jwt=require('jsonwebtoken');
const User=require('../model/user');

exports.authenticate=(req,res,next)=>{
	const token=req.header("Authorization");
	const userId=jwt.verify(token,"secretKey");
	User.findByPk(userId.userId).then((user) => {
		req.user=user; 
		next();
	}).catch((err) => {
		console.log(err);
	});	
}

exports.getUser=(req,res,next)=>{
	const token=req.header("Authorization");
	const userId=jwt.verify(token,"secretKey");
	User.findByPk(userId.userId).then((user) => {
		req.user=user;
		next();
	}).catch((err) => {
		console.log(err);
	});	
}

