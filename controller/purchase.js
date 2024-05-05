const Razorpay=require('razorpay');
const Order=require('../model/orders');
const logger=require('../util/logger');
require("dotenv").config();

exports.purchasepremium=async(req,res)=>{
	try{
		var rzp=new Razorpay({
			key_id:process.env.PAYMENT_KEY_ID,
			key_secret:process.env.PAYMENT_KEY_SECRET
		})
		const amount=2500;
		rzp.orders.create({amount,currency:"INR"},(err,order)=>{
			if(err){
				throw new Error(JSON.stringify(err));
			}
			req.user.createOrder({orderid:order.id,status:'PENDING'}).then((result) => {
				return res.status(201).json({order,key_id:rzp.key_id});
			}).catch((err) => {
				throw new Error(err)
			});
		})
	}catch(err){
		logger.error(`controller-purchase - ${err} - ${new Date()}`);
		res.status(403).json({message:'Something went wrong'})}
}

exports.updateTransactionStatus=(req,res)=>{
	try{
		const {payment_id,order_id,status}=req.body;
		Order.findOne({where:{orderid:order_id}}).then((order) => {
			const Promise1=order.update({paymentid:payment_id,status:status});
			const promise2=	req.user.update({ispremium:true});
			Promise.all([Promise1,promise2]).then(() => {
				return res.status(202).json({success:true,message:"Transaction Successfull"});
			}).catch((err) => {
				logger.error(`controller-purchase - ${err} - ${new Date()}`);
			});
		}).catch((err) => {
			throw new Error(err);
		});
	}catch(err){logger.error(`controller-purchase - ${err} - ${new Date()}`);}
}