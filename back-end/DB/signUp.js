const mongoose = require('mongoose');
const SignUpSchema =new mongoose.Schema({
  name:String,
  emailId:String,
  password:String
})

module.exports = mongoose.model("signup",SignUpSchema);