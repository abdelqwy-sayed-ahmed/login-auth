const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const passport=require('passport');
//load Schema
require('../models/User');

//login pages
router.get('/login',(req,res)=>{
  res.render('auth/login')
});
//google Route & Callback
router.get('/google',passport.authenticate('google', { scope: ['profile','email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  (req, res)=> {
    // Successful authentication, redirect home.
    res.redirect('/users/dashboard');
  });

  //Facebook Route & Callback
router.get('/facebook',passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/auth/login' }),
  (req, res)=> {
    // Successful authentication, redirect home.
    
    res.redirect('/users/dashboard');
  });


  
   //Verify correct login
      
   router.get('/verify',(req,res) =>{
    if(req.user){
    console.log(req.user);
    }else{
    console.log('Not Auth');
    }
    });
    
    //Logout
  router.get('/logout',(req,res) =>{
    req.logout();
    res.redirect('/');
    });

module.exports=router;