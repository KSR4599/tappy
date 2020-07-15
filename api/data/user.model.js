var mongoose = require('mongoose');
var bcrypt=require('bcryptjs')

var serviceSchema = new mongoose.Schema({
  description:[String],
  badpic:[String],
  location:[{type: Number}],
  status:[String]
})

var socialSchema1 = new mongoose.Schema({
    instagram : String,
    twitter : String,
    facebook : String,
    snapchat : String,
    youtube : String
  })


var userSchema= new mongoose.Schema({
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

    password : {
      type: String,

    },
    
    verified : Boolean,

    unique_code: {
        type: String,
  
      },

    socialSchema:[socialSchema1]


  })

var User=module.exports=mongoose.model('User',userSchema);

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
  var query = {pref_username : username};
  User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword,hash,callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {

  callback(null,isMatch);
});
}


module.exports.cryptUser = function(newUser,callback){
 bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password=hash;
      newUser.save(callback);
    });
});

}

module.exports.createUser = function(newUser,callback){
    
         newUser.save(callback);
       console.log("User inserted in DB");
   
   };
