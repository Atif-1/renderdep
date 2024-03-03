const express=require('express');

const expenseController=require('../controller/expense');

const router=express.Router();

router.post('/addExpense',expenseController.addExpense);
router.get('/getExpenses',expenseController.getExpenses);
router.delete('/deleteExpense/:id',expenseController.deleteExpense);

module.exports=router;