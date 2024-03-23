const express=require('express');
const passController=require('../controller/password');
const router=express.Router();

router.post('/forgetpassword',passController.sendMail);

module.exports=router;
