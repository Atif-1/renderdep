const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const DownloadLink=sequelize.define('downloads',{
	url:{
		type:Sequelize.STRING,
		primaryKey:true,
		allowNull:false,
		unique:true
	}
})


module.exports=DownloadLink;