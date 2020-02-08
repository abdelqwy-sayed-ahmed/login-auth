const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const User=mongoose.model('users');
const keys= require('../config/keys');


passport.use(new FacebookStrategy({
  clientID:keys.facebookID,
  clientSecret: keys.facebookSecret,
  callbackURL: "/auth/facebook/callback",
  proxy:true,
  profileFields:["email","name","photos"]
},
function(accessToken, refreshToken, profile, done) {
  // console.log(profile);
  const newUser={
    userID:profile.id,
    email:profile.emails[0].value,
    firstName:profile.name.givenName,
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
// }
// }
// ));

module.exports = passport;
