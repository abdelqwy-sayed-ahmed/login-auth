const express=require('express');
const router=express.Router();
const {ensureAuthenticated}=require('../helpers/auth');
//Dashboard
router.get('/dashboard',ensureAuthenticated,(req,res)=>{
  res.render('users/dashboard')
})











module.exports=router;