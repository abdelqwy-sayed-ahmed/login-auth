const express=require('express');
const exphbs=require('express-handlebars');
const methodOverride = require('method-override')
const cookieParser=require('cookie-parser');
const bodyParser = require('body-parser')
const session=require('express-session');
const auth=require('./router/auth');
const users=require('./router/users');
const stories=require('./router/stories');
const passport=require('passport');
require('./auth/google')(passport);
require('./auth/facebook');

const app=express();




//Load Schema
require('./models/User'); 
require('./models/Story');
const{
  truncate,formatDate,stripTags,select,isequal
}=require('./helpers/hbs');

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
  helpers:{
  truncate:truncate,
  stripTags:stripTags,
  select:select,
  formatDate:formatDate,
  isequal:isequal

  
  },
  defaultLayout:'main'
})), 
app.set('view engine','handlebars');
//Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// override 
app.use(methodOverride('_method'));
//link with css file
app.use(express.static((__dirname, 'public')));

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
app.use('/stories',stories);




const port=process.env.PORT || 4000;
app.listen(port,()=>{
  console.log(`Server Started at ${port}`);
})