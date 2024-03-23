const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;
const apiKey=client.authentications['api-key'];
apiKey.apiKey='';
const tranEmailApi=new Sib.TransactionalEmailsApi();
const sender={
	email:'xyz@gmail.com',
}

exports.sendMail=(req,res,next)=>{
	const reciever=[{
		email:req.body.email
	}]
	tranEmailApi.sendTransacEmail({
		sender,
		to:reciever,
		subject:'Demo Reset Password',
		textContent:'its a dummy mail your password is resest:)'
	}).then((resp) => {
		res.json({status:'successfull'});
	}).catch((err) => {
		res.json({status:'failed'});
		console.log(err);
	});

}