const express=require('express');
const cors=require('cors');

const sequelize=require('./util/database');

const userRoute=require('./routes/user');
const expenseRoute=require('./routes/expense');

const app=express();

app.use(cors());
app.use(express.json());

app.use('/user',userRoute);
app.use('/expense',expenseRoute);

sequelize.sync().then(()=>{
	app.listen(3000);
})