const express=require('express');
const premiumController=require('../controller/premium');
const expenseController=require('../controller/expense');
const authentication=require('../middlewares/auth');

const router=express.Router();

router.get('/leaderboard',authentication.authenticate,premiumController.getLeaderboard);
router.get('/download',authentication.authenticate,expenseController.downloadExpenses);

module.exports=router;

