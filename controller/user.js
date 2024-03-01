const User=require('../model/user');

exports.postUser=(req,res,next)=>{
	const name=req.body.name;
	const email=req.body.email;
	const password=req.body.password;
		User.create({name:name,email:email,password:password}).then((result) => {
			res.status(200);
			console.log(result);
		}).catch((err) => {
			res.status(403).send('Error:Request failed with status code 403');
			console.log(err);
		});
}