const express=require('express');
const premiumController=require('../controller/premium');
const authentication=require('../middlewares/auth');

const router=express.Router();

router.get('/leaderboard',authentication.authenticate,premiumController.getLeaderboard);

module.exports=router;

