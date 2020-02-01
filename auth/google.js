const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User=mongoose.model('users');

const keys= require('../config/keys');

module.exports=function(passport){
  passport.use(new GoogleStrategy({
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy:true //to be able work in remote https server
    },(accessToken, refreshToken,profile,done) => {
      
      const newUser={
        userID:profile.id,
        email:profile.emails[0].value,
        firstName:profile.displayName,
        picture:profile.photos[0].value,provider:profile.provider
      } 
       //check existing
       User.findOne({
         email:profile.emails[0].value
       }).then(user=>{
         if(user){
           done(null,user);
         }else{
           new User (newUser)
           .save()
           .then(user=>done (null,user));
         }
       })
         

    })
    );
    passport.serializeUser((user,done) =>{
      done(null,user.id);
      });
      
      passport.deserializeUser((id,done) =>{
      User.findById(id).then(user => done (null,user));
      });
  }
  