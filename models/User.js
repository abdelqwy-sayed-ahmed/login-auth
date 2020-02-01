const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const UserSchema=new Schema({
  userID:{
    type:String,
    required:true
  },
  email:{
    type:String,required:true,unique:true
  },
  firstName:{
    type:String
  },
  picture:{
    type:String
  },
  provider:{
    type:String
  },
  date:{
    type:Date,
    default:Date.now
  }

})
mongoose.model('users',UserSchema);