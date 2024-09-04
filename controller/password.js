const Sib = require('sib-api-v3-sdk');
const uuid=require('uuid');
const bcrypt=require('bcrypt');
require("dotenv").config();
const logger=require('../util/logger');
const path=require('path');

const ForgetPasswordRequest=require('../model/ForgetPasswordRequest');
const User=require('../model/user');
const { where, Transaction } = require('sequelize');
const sequelize = require('../util/database');



const client = Sib.ApiClient.instance;
const apiKey=client.authentications['api-key'];
apiKey.apiKey=process.env.BREVO_API_KEY;
const tranEmailApi=new Sib.TransactionalEmailsApi();
const sender={	
	email:process.env.MY_EMAIL,
	name:process.env.MY_NAME
}
exports.sendMail=async(req,res,next)=>{
	try{
		const uuidV4=uuid.v4();
		const user=await User.findOne({where:{email:req.body.email}});
		if(user){
			await ForgetPasswordRequest.create({id:uuidV4,isactive:true,userId:user.id});
			const reciever=[{
				email:req.body.email
			}]
			await tranEmailApi.sendTransacEmail({
				sender,
				to:reciever,
				subject:'Demo Reset Password',
				textContent:`https://renderdep.onrender.com/password/resetpassword/${uuidV4}`
			});
			res.json({message:'successfull'});
		}
		else{
			console.log("user does not exist");
			res.json({message:'failed'});
		}	
	}catch(err){logger.error('controller-password'+err);}
}

exports.resetPassword=async(req,res,next)=>{
	try{
		const userUuid=req.params.uuid; 
		const passwordRequest=await ForgetPasswordRequest.findByPk(userUuid);
		const userid=passwordRequest.userId;
		const user=await User.findOne({where:{id:userid}});
		req.session.email=user.email;
		req.session.uuid=userUuid;
		if(passwordRequest.isactive){
			res.sendFile(process.mainModule.path+'/public/updatePassword.html');//ip address	
		}
		else{
			res.send("<html><body><h1>Link Expired</h1></body></html>");
		}	
	}catch(err){logger.error('reset-controller-password'+err);}
}

exports.updatePassword=async(req,res,next)=>{
	try{
		if(req.session.email && req.session.uuid){
		const passwordRequest=await ForgetPasswordRequest.findByPk(req.session.uuid);
		const email=req.session.email;
		const newpassword=req.body.password;
		if(passwordRequest.isactive){
		bcrypt.hash(newpassword,10,async(err,hash)=>{  
			await User.update({password:hash},{where:{email:email}});
		});
		await ForgetPasswordRequest.update({isactive:false},{where:{id:req.session.uuid}});
		return res.status(200).json({success:true,message:"password changed"});
		}
		else{
			return res.status(400).json({success:true,message:"link is already used"});
		}
		}
		else{
			res.status(400).json({success:false,message:"Something went wrong please try again"});
		}
	}catch(err){
		logger.error('update-controller-password'+err);
		return res.status(500).json({message:"Server Error"});
	}
}