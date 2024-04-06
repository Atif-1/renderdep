const DownloadLink=require('../model/downloadLink');

exports.getDownloads=async(req,res,next)=>{
	try{
	const id=req.user.id;
	console.log(id);
	const downloadLinks=await DownloadLink.findAll({where:{userId:id}});
	console.log(downloadLinks);
	res.status(200).json({downloadLinks});
	}
	catch(err){
		console.log(err);
		res.status(500).json({status:failed,message:err});
	}
}