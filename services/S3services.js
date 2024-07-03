const AWS=require('aws-sdk');

const  uploadToS3=(data,fileName)=>{
	try{
		const BUCKET_NAME=process.env.IAM_BUCKET_NAME;
		const IAM_USER_KEY=process.env.IAM_AWSTEST_ACCESS_KEY;
		const IAM_USER_SECRET=process.env.IAM_AWSTEST_SECRET_KEY;
		let s3bucket=new AWS.S3({
			accessKeyId:IAM_USER_KEY,
			secretAccessKey:IAM_USER_SECRET,
		})
		var params={
			Bucket:BUCKET_NAME,
			Key:fileName,
			Body:data,
			ACL:'public-read'
		}
		return new Promise((resolve,reject)=>{
			s3bucket.upload(params,(err,s3response)=>{
				if(err){
					reject(err);
				}
				else{
					resolve(s3response.Location);
				}
			})
		})	 
	}catch(err){
		console.log(err);
	}
}
module.exports={
	uploadToS3
}