var mongoose = require('mongoose');
var bcrypt=require('bcryptjs')

var user_data= new mongoose.Schema({
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
      index:true
    },
    email: {
      type: String,
    },
    pref_username: {
      type: String,

    },

    verified : Boolean,

    unique_code: {
        type: String,
  
      },

    google :{
      id: String,
      token: String,
      email: String,
      name: String
    }


  })


var adminSchema= new mongoose.Schema({
   

    google :{
      id: String,
      token: String,
      email: String,
      name: String
    },

    requests : [user_data]


  })



var Admin = module.exports=mongoose.model('Admin',adminSchema);


module.exports.comparePassword = function(candidatePassword,hash,callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {

  callback(null,isMatch);
});
}


module.exports.cryptAdmin = function(newAdmin,callback){
 bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newAdmin.password, salt, function(err, hash) {
      newAdmin.password=hash;
      newAdmin.save(callback);
    });
});

}

