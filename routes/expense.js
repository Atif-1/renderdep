const express=require('express');
const authentication=require('../middlewares/auth');

const expenseController=require('../controller/expense');

const router=express.Router();

router.post('/addExpense',authentication.authenticate,expenseController.addExpense);
router.get('/getExpenses/:page',authentication.authenticate,expenseController.getExpenses);
router.delete('/deleteExpense/:id',authentication.authenticate,expenseController.deleteExpense);
router.get('/getTotalExpenses',authentication.authenticate,expenseController.getTotalExpenses);

module.exports=router;