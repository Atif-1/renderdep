const express=require('express');
const passController=require('../controller/password');
const router=express.Router();

router.post('/forgetpassword',passController.sendMail);
router.get('/resetpassword/:uuid',passController.resetPassword);
router.post('/updatepassword',passController.updatePassword);

module.exports=router;

