const Sequelize=require('sequelize');
require("dotenv").config();
const sequelize=new Sequelize(process.env.TABLE_NAME,process.env.DATABASE_USER,process.env.DATABASE_PASSWORD,{
	dialect:'mysql',host:process.env.HOST
});

module.exports=sequelize;