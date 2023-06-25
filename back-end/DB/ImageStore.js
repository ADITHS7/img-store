const mongoose = require('mongoose');
const ImageStoreSchema =new mongoose.Schema({
  url:String,
  name:String,
 
  time:String,
  uid:String
})

module.exports = mongoose.model("ImageStore",ImageStoreSchema);