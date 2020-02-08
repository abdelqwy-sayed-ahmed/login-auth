const express=require('express');
const mongoose=require('mongoose');
//load Schema
require('../models/User');
const User=mongoose.model('users');
require('../models/Story')
const Story=mongoose.model('stories');
const router=express.Router();
const {ensureAuthenticated}=require('../helpers/auth');
//Dashboard
router.get('/dashboard',ensureAuthenticated,(req,res)=>{
  Story.find({user:req.user.id})
  .then(stories =>{
  res.render('users/dashboard',{
    stories:stories
  })
  })
  
})


module.exports=router;