const express=require('express');
var app=express();
require('./db.js');
const path=require('path');
const mongoose=require('mongoose');
const userData=mongoose.model('user');
const exphbs=require('express-handlebars');
const session=require('express-session');
const jwt=require('jsonwebtoken');
const port=process.env.PORT || 3000;
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({
  extended:true
}));
app.use(bodyParser.json());
app.use(session({secret: 'ssshhhhh',

saveUninitialized: false,
 resave: false,
  cookie: {secure: false}
}));
// app.engine('handlebars', exphbs({defaultLayout: 'main'}));
// app.use('/static', express.static(path.join(__dirname, 'public')))
app.set('views',path.join(__dirname,'/views'));
app.engine('hbs',exphbs({extname:'hbs'}));
app.set('view engine','hbs');
app.use(express.static(__dirname + '/views'));
//
// app.use(express.static(__dirname + 'public'));

app.listen(port,()=>{
  console.log("server is running on port 3000");
});
app.get('/register',(req,res)=>{
  res.render('register');
});
app.get('/login',(req,res)=>{
  if(req.session.userName)
  {
    res.redirect('/userPage');
  }
  else {
     res.render('login');
  }

});
app.get('/',(req,res)=>{
  res.redirect('login');
});

app.post('/register',(req,res)=>{

          userData.find({Email:req.body.email},(err,doc)=>{
          if(doc.length >=1){
             res.render('register',{
               notRegistered:true
             });
          }
          userData.find({userName:req.body.username},(err,doc)=>{
          if(doc.length >=1){
             res.render('register',{
               userExist:true
             });
          }

        else {

            var usersData=new userData();
            usersData.userName=req.body.username;
            usersData.Name=req.body.name;
            usersData.Email=req.body.email;
            usersData.Password=req.body.password;
            usersData.dob=req.body.birthday;
            usersData.save((err,doc)=>{
           if(!err){
            console.log("data inserted");
            req.session.email=req.body.email;
            req.session.name=req.body.name;
            res.redirect('/userPage');
           }
           else{
            console.log(err);
           }
           });

         }
       });


          });

        });
  app.get('/userPage',(req,res)=>{
    if(req.session.email)
    {
          userData.find({Email:req.session.email},(err,doc)=>{
            if(!err){
              if(doc.length){
                console.log(doc);
                var docss=doc;
                 res.render('userhome',{
                   docsss:docss,
                   name:req.session.name
                  });
             }
            }
          else{
              res.redirect('/register');
             }

 });

}
 if(req.session.userName)
 {
    const token =jwt.sign({
      userName:req.session.userName,
      userId:req.session.userId
    },
     process.env.JWT_KEY,
  {
    expiresIn:"1h"
  }
);
console.log(token);

res.render('userhome.hbs',{
  loggedIn:true,
  name:req.session.userName,
  token:token
});
}
});


app.post('/login',(req,res)=>{
  userData.find({userName:req.body.username},(err,doc)=>{
    if(!err)
    {
      var docs=doc;
      console.log(docs);
      if(docs[0].Password == req.body.password)
      {
             req.session.userName=req.body.username;
             req.session.userId=docs[0]._id;
             res.redirect('/userPage');

      }
      else{
        res.redirect('/');
      }
    }
    else{
      res.redirect('/');
    }
  });
});

app.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/');

});
