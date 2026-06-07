const { where } = require("sequelize");
const Profiles=require("../model/Profiles");

exports.analyzeProfile=async(req,res,next)=>{
    try{
        const {username}=req.body;
        if(!username){
            return  res.status(400).json({success:false,"message":"Username required"});
        }
        const exist=await Profiles.findOne({where:{"username":username}});
        if(exist){
            return  res.status(400).json({success:false,"message":"Username already exist"});
        }
        const data=await fetch(`https://api.github.com/users/${username}`);
        const dataJson=await data.json();
        console.log(dataJson);
        const newData={
        	"username":dataJson.login,
            "name":dataJson.name,
            "type":dataJson.type,
            "email":dataJson.email,
            "company":dataJson.company,
            "bio":dataJson.bio,
            "location":dataJson.location,
            "avatar_url":dataJson.avatar_url,
            "html_url":dataJson.html_url,
            "public_repos":dataJson.public_repos,
            "public_gists":dataJson.public_gists,
            "followers":dataJson.followers,
            "following":dataJson.following,
            "accountCreatedAt":dataJson.created_at,
            "accountUpdateAt":dataJson.updated_at
        }
        const response=await Profiles.create(newData);
        console.log(res);
        return res.status(201).json({success:true,"message":"Analyzed and saved profile data"});
    }catch(err){
        console.log(err);
    }
}
exports.getProfileAnalysis=async(req,res,next)=>{
    try{
        const {username}=req.body;
       if(!username){
            return  res.status(400).json({success:false,"message":"Username required"});
        }
         const data=await Profiles.findOne({where:{"username":username}});
        if(!data){
            return  res.status(400).json({success:false,"message":"Username does not exist"});
        }
        res.status(200).json(data);
    }catch(err){
        console.log(err);
    }
}
exports.getAllAnalysis=async(req,res,next)=>{
        try{
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const { count, rows } = await Profiles.findAndCountAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']]
            });
           return res.status(200).json({ 
            success: true,
            data: rows,
            pagination: {
                totalRecords: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                pageSize: limit,
                hasNextPage: page < Math.ceil(count / limit),
                hasPreviousPage: page > 1
            }
           });
        }catch(err){
            console.log(err);
        }
}

exports.deleteProfileAnalysis=async(req,res,next)=>{
    try{
        const userId=req.params.id;
       if(!userId){
            return  res.status(400).json({success:false,"message":"Username required"});
        }
        const user=await Profiles.findOne({where:{"id":userId}});
        if(!user){
            return  res.status(400).json({success:false,"message":"Username does not exist"});
        }
        await Profiles.destroy({where:{"id":userId}});
        res.status(200).json({success:true,"message":"Succesfully deleted"});
    }catch(err){
        console.log(err);
    }
}

