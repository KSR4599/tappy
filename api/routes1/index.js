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
var Admin = mongoose.model('Admin')
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


router.post('/del_request', function(req, res,next) {

    var username = req.body.username;
    var email = req.body.email;


      
      User.findOne({ 'pref_username': username}, function(err, user) {
        if(user){
            user.remove();
            user.save(function(err, userDeleted) {
                if (err) {
                console.log(err);
                } else {
            console.log("User Deleted Succesfully");

        }
    })
}
      })


   
   
    Admin.findOne({ 'name': 'admin'}, function(err, admin) {
        if(admin){

           for(var i=0; i<admin.requests.length;i++){
             if(admin.requests[i].pref_username == username ) {
                 console.log("request removed");
                admin.requests[i].remove();
             }
           }

                  admin.save(function(err, adminUpdated) {
                    if (err) {
                     console.log(err);
                    } else {
                     console.log("Admin Updated Succesfully : "+ adminUpdated);

                     //  //nodemailer
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

    var code_string = '<p> Your request is rejected by the admin. Please contact admin support for more details. </p>';

    let mailOptions = {
    from: '"KSR Corp." <killershell9@gmail.com>', // sender address
    to: email, // list of receivers
    subject: '❗️❗️ Tappy Registration Failure',
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

                     res.redirect('/api/login')
                    }
                  });

                        }
                  })
                        })




    router.post('/approve_request', function(req, res,next) {

            var username = req.body.username;
            var email = req.body.email;
            var code = req.body.code;
                        
                           

            User.findOne({ 'pref_username': username}, function(err, user) {
                if(user){
                    user.verified = true;
                    user.save(function(err, userUpdated) {
                        if (err) {
                        console.log(err);
                        } else {
                    console.log("User Updated to Verified "+userUpdated);
        
                }
            })
        }
              })


            Admin.findOne({ 'name': 'admin'}, function(err, admin) {
              if(admin){
                        
                 for(var i=0; i<admin.requests.length;i++){
                   if(admin.requests[i].pref_username == username ) {
                        console.log("request removed");
                            admin.requests[i].remove();
                              }
                            }
                        
                         admin.save(function(err, adminUpdated) {
                           if (err) {
                           console.log(err);
                           } else {
                       console.log("Admin Updated Succesfully : "+ adminUpdated);


                       //MAIL TRIGGERING //
  
 
    //  console.log("Now triggering mail to "+ email + "with a unique code of "+ result);
 
    //  //nodemailer
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
 
     var code_string = '<p> Thank you for registering with us! Your unique code is ' + code + '. </p>';
 
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
                     res.redirect('/api/login')
               }
           });
                        
          }
     })
      })

           