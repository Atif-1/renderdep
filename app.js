const express=require('express');
const cors=require('cors');

const sequelize=require('./util/database');

const userRoute=require('./routes/user');
const expenseRoute=require('./routes/expense');
const purchaseRoute=require('./routes/purchase');
const premiumRoute=require('./routes/premium');
const passwordRoute=require('./routes/password');

const User=require('./model/user');
const Expense=require('./model/expense');
const Order=require('./model/orders');
const ForgetPasswordRequests=require('./model/ForgetPasswordRequest');

const app=express();

app.use(cors());
app.use(express.json());

app.use('/user',userRoute);
app.use('/expense',expenseRoute);
app.use('/purchase',purchaseRoute);
app.use('/premium',premiumRoute);
app.use('/password',passwordRoute);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgetPasswordRequests);
ForgetPasswordRequests.belongsTo(User);

sequelize.sync().then(()=>{
	app.listen(3000);
})