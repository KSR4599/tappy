"use strict";
var express = require('express');
var app = express()
var expressValidator = require('express-validator');
var router = express.Router();
module.exports = router;
const multer = require('multer');
//var upload = multer({dest: '../resdem/views/images'})
var mongoose=require('mongoose');
var bodyParser= require('body-parser')
var Ask= mongoose.model('User')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var flash = require('express-flash-notification')
var User=mongoose.model('User')
var ctrlUsers = require('../controllers/users.controllers.js');
var hbs  = require('express-handlebars');
var path= require('path')
var asy = require("async");
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
  var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
const nodemailer = require('nodemailer')



router.get('/',function(req, res,next){

    
          console.log("Register page called!");

          res.render('index');
        
    })

 router.get('/login',function(req, res,next){

    
        console.log("Complete Registration page called!");

        res.render('login');
      
  })



  router.get('/wrong_login',function(req, res,next){

    
    console.log("wrong login!");

    res.render('wrong_login');
  
})

  router.get('/login1',function(req, res,next){

    
    console.log("Login page called!");

    res.render('login1');
  
})


  router.get('/register',function(req, res,next){

    
    console.log("register succesful!");

    res.render('login');
  
})

router.get('/admin-login',function(req, res,next){

    
    console.log("admin login called");

    res.render('admin_login');
  
})


router.get('/profile',function(req, res,next){

    
    console.log("profile page called");

    res.render('profile');
  
})




  router.post('/register', function(req, res,next) {

    var firstname= req.body.fname;
  var email = req.body.email;
  var lastname=req.body.lname;
  var preferredname=req.body.pname;
  var result = '';

  result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 7; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  

    if(false){
    //PASSWORD MATCHING VERIFICATION
    //VALID EMAIL MATCHING
    } else {

        //Creating the user in DB
        User.findOne({ 'email': req.body.email}, function(err, user) {
            if(user){
                console.log("Duplicate email found!");
              //res.render('index',{x:3});
            } else {
                User.findOne({ 'pref_username': req.body.pname}, function(err, user1) {
                    if(user1){
                        console.log("Duplicate pname found!");
                      //res.render('index',{x:33});
            } else {
                console.log("Unique user detected!");

                var newUser = new User({
                    firstname:firstname,
                    lastname: lastname,
                    email:email,
                    pref_username:preferredname,
                    verified : false,
                    unique_code : result
                  })
                  User.createUser(newUser,function(err, user){
                    if(err) { 
                        throw err;  } else {

                            //MAIL TRIGGERING //
  
 
     console.log("Now triggering mail to "+ email + "with a unique code of "+ result);
 
     //nodemailer
     let transporter = nodemailer.createTransport({
         host: 'smtp.gmail.com',
         port: 587,
         secure: false, // true for 465, false for other ports
         auth: {
             user: 'killershell9@gmail.com', // generated ethereal user
             pass:  'KILLKILL459945'// generated ethereal password
         },
         tls:{
           rejectUnauthorized:false
         }
     });
 
     var code_string = '<p> Thank you for registering with us! Your unique code is ' + result + '. </p>';
 
     let mailOptions = {
     from: '"KSR Corp." <killershell9@gmail.com>', // sender address
     to: email, // list of receivers
     subject: '✅ Tappy Registration Succesful',
     html: code_string
     };
 
     // send mail with defined transport object
     transporter.sendMail(mailOptions, (error, info) => {
         if (error) {
             return console.log(error);
         }
         console.log('Message sent: %s', info.messageId);
         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
 
     });
 
 
     //END OF MAIL TRIGGERING //
                    console.log(user);
                   
    res.render('login',{x:1});
                        }
                  })
            }
        })
    } 
    })
   
    } 


})




router.post('/login', function(req, res,next) {

    var username= req.body.username;
    var code = req.body.unique_code;
    var password1 =req.body.password;
    var password2 =req.body.password_repeat;

//Check for same password

User.findOne({ 'pref_username': req.body.username}, function(err, user) {
    if(user){

        if(!user.verified){
        var stored_code = user.unique_code;


        if(code === stored_code){
            console.log("Unique Code Matched for "+ user);
            user.password = password1;
            user.verified = true;

            user.save(function(err, userUpdated) {
                if (err) {
                  console.log(err)
                } else {
                    User.cryptUser(userUpdated,function(err, user){
                        if(err) throw err;
                        console.log(user);
                  
                      })
                  console.log("User is updated : "+ userUpdated);
                  res.render('login1');
                }
              });

        } else {
            console.log("User found but Unique Code MisMatched!");
        }
      
    } else {
        console.log("User already verified");
    }
    } 
    else{
        console.log("User not Found!");
    }
})
})




// router.post('/login1', function(req, res,next) {

//     var username= req.body.username;
//     var password =req.body.password;


// //Check for same password

// User.findOne({ 'pref_username': req.body.username}, function(err, user) {
//     if(user){

//     if(user.password === password){
//         console.log("User Found and  Valid Login!");
//     } else {
//         console.log("User found but Invalid Login");
//     }
//     } 
//     else{
//         console.log("User not Found!");
//     }
// })
// })



//LOGIN
router.post('/login1',
passport.authenticate('local',{failureRedirect:'/api/wrong_login'}),
function(req, res, next){
 res.redirect('/api/profile');

});


passport.serializeUser(function(user, done) {
       return done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      return done(err, user);
});
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username,function(err,user){

      if(err) {return done(err);}

      if(!user){
        console.log("No user found");
         return done(null,false,{message:'Unknown User!'});
        }

      User.comparePassword(password,user.password,function(err,isMatch){
        if(err) {return done(err); }

        if(isMatch){
       console.log("User Found!")
              return done(null,user);
        }
          else {
              return done(null, false, {
                  message: "Invalid password"})

           //return done(null,false)
         }
         })
})

}));