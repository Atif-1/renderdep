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

exports.userLogin=(req,res,next)=>{
	const email=req.body.email;
	const password=req.body.password;
	User.findAll({where:{email:email}}).then((result) => {
		if(result[0].password===password){
			res.status(200).json({"success":"true","message":"User login Successfully"});
		}
		else{
			res.status(401).json({"success":"false","message":"User not authorised"});
		}
	}).catch((err) => {
		res.status(404).json({"success":"false","message":"User not found"});
	});
}