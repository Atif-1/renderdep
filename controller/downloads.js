const DownloadLink=require('../model/downloadLink');
const logger=require('../util/logger');

exports.getDownloads=async(req,res,next)=>{
	try{
	const id=req.user.id;
	const downloadLinks=await DownloadLink.findAll({where:{userId:id}});
	res.status(200).json({downloadLinks});
	}
	catch(err){
		logger.error('controller-download'+err);
		res.status(500).json({status:failed});
	}
}