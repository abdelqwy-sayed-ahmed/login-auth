const express=require('express');
const exphbs=require('express-handlebars');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const auth=require('./router/auth');
const users=require('./router/users');

//passport config
const passport=require('passport');
require('./auth/google')(passport);
require('./auth/facebook');

const app=express();



//Load Schema
require('./models/User');
//connect to mongoose
const keys=require('./config/keys');
const mongoose=require('mongoose');
mongoose.connect(keys.mongoURI,{
  useUnifiedTopology: true ,
  useNewUrlParser:true,
  useCreateIndex:true
}).then(()=>{
  console.log(`MongoDB Connected`);
 
}).catch(err=>{
  console.log(err);
})

//handlebars Middleware
app.engine('handlebars',exphbs({
  defaultLayout:'main'
})), 
app.set('view engine','handlebars')

//Home page
app.get('/',(req,res)=>{
  res.render('home')
})







// passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Use cookie/session //above Use Route
app.use(cookieParser());
app.use (session({
secret:'secret',
resave:false,
saveUninitialized:false

}));

// passport Middleware
app.use(passport.initialize());
app.use(passport.session());
//global variable
app.use((req,res, next) => {
  res.locals.user=req.user||null ;
  next()
});



// Router;
app.use('/auth',auth);
app.use('/users',users);



const port=process.env.PORT || 4000;
app.listen(port,()=>{
  console.log(`Server Started at ${port}`);
})