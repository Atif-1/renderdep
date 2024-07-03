const express=require('express');
const  authentication  = require('../middlewares/auth');
const downloadController=require('../controller/downloads');

const router=express.Router();


router.get('/getDownloadLinks',authentication.authenticate,downloadController.getDownloads);

module.exports=router;