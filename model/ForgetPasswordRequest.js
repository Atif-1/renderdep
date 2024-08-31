const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const forgetPasswordRequest=sequelize.define('ForgetPasswordRequests',{
	id:{
		type:Sequelize.STRING,
		allowNull:false,
		primaryKey:true,
		unique:true
	},
	isactive:{
		type:Sequelize.BOOLEAN,
		allowNull:false
	}
})


module.exports=forgetPasswordRequest;