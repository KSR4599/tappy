"use strict";
var express = require('express');
var app = express()
var mongoose = require('mongoose')
var User = mongoose.model('User')
var fs= require("fs")
const multer = require('multer');
var upload = multer({dest: '../resdem/views/images/profilepics'})
const nodemailer = require('nodemailer');
var session = require('express-session')
var cookieParser = require('cookie-parser')
var flash = require('express-flash-notification')
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());


