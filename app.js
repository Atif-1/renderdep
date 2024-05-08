const express=require('express');
const path=require('path');
const cors=require('cors');
const helmet=require('helmet');
require("dotenv").config();
const sequelize=require('./util/database');
const app=express();


const userRoute=require('./routes/user');
const expenseRoute=require('./routes/expense');
const purchaseRoute=require('./routes/purchase');
const premiumRoute=require('./routes/premium');
const passwordRoute=require('./routes/password');
const downloadRoutes=require('./routes/downloads');


const User=require('./model/user');
const Expense=require('./model/expense');
const Order=require('./model/orders');
const ForgetPasswordRequests=require('./model/ForgetPasswordRequest');
const DownloadLinks=require('./model/downloadLink');

app.use(cors());
app.use(express.json());	

app.use('/user',userRoute);
app.use('/expense',expenseRoute);
app.use('/purchase',purchaseRoute);
app.use('/premium',premiumRoute);
app.use('/password',passwordRoute);
app.use('/downloads',downloadRoutes);
app.use((req,res)=>{
	console.log(req.url);
	res.sendFile(path.join(__dirname,`/public/${req.url}`));
})

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgetPasswordRequests);
ForgetPasswordRequests.belongsTo(User);

User.hasMany(DownloadLinks);
DownloadLinks.belongsTo(User);

sequelize.sync().then(()=>{
	app.listen(process.env.PORT || 3000);
})