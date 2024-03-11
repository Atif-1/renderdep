const User=require('../model/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

function generatetoken(id){
	return jwt.sign({userId:id},"secretKey");
}

exports.postUser=async (req,res,next)=>{
	try{
		const name=req.body.name;
		const email=req.body.email;
		const password=req.body.password;
		if(await User.findAll({where:{email:email}})==false){
			bcrypt.hash(password,10,async (err,hash)=>{
				await User.create({name:name,email:email,password:hash,ispremium:false});
				res.status(200).json({message:'Successfully created new user'});
			});
		}
		else{
			return res.json({success:false,message:'User already exist'});
		}
	}catch(err){
		console.log(err);
	}
}

exports.userLogin=async (req,res,next)=>{
	const email=req.body.email;
	const password=req.body.password;
	if(await  User.findAll({where:{email:email}})==false){
		res.status(404).json({success:false,message:"User not found"});
	}else{
		User.findAll({where:{email:email}}).then(async (result) => {
			if(await bcrypt.compare(password,result[0].password)){
				res.status(200).json({success:true,message:"User login Successfully",token:generatetoken(result[0].id)});
			}
			else{
				res.status(401).json({success:false,message:"User not authorised"});
			}
		}).catch((err) => {
			res.json({success:false,message:err});
		});
	}
}
