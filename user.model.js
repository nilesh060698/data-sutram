const mongoose=require('mongoose').set('debug', true);
var usersSchema=new mongoose.Schema({
  userName:{
    type:String,

  },
  Name:{
    type:String
  },
  Email:{
    type:String

  },
  Password:{
    type:String
  },
  dob:{
    type:String
  },

});






mongoose.model('user',usersSchema);
