const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer  = require('multer');
const path = require('path');
const mongoose = require('mongoose')
require('./DB/config');
const ImageStore = require('./DB/ImageStore.js');
const SignUp =require('./DB/signUp')
const jsonparser = bodyParser.json;

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use('/uploads',express.static('uploads'));


const upload = multer({ 
  storage: multer.diskStorage({
    destination:function(req,file,cb){
    cb(null,'uploads')
    },
    filename:function(req,file,cb){
      cb(null,file.fieldname + '-' + Date.now() +path.extname(file.originalname))
    },
    fileFilter: (req,file,cb)=>{
    if(file){
      cb(null,true)
    }
    else{
      cb(new Error("No file available for upload"))
    }
    }
  })
 }).single("senddata")

 const formData = (req)=>{

  let url;
  if(req.body.change=='true')
  {
    url=req.file.filename
  }
  else{
    url = req.body.senddata
  }

  const name = req.body.name;
 
  const time =req.body.time;
  const uid = req.body.uid;

  const newImage = {
    url,
    name,
 
    time,
    uid
   }

   return newImage
 }
 app.post('/add',upload,async(req,res)=>{
  const newData = formData(req);
  const Data = new ImageStore(newData);
  Data.save().then(()=>{console.log("data added succesfully")})

});

app.get('/images/:id',async(req,res)=>{
  
  const image =  await ImageStore.find({uid:req.params.id})
    res.send(image)
})

app.get('/view/:id',async(req,res)=>{
  const image =  await ImageStore.findOne({_id:req.params.id})
    res.send(image)
})

app.delete("/delete/:id",async(req,res)=>{
  let result = await ImageStore.deleteOne({_id:req.params.id})
  res.send(result)
})


app.post('/signup',jsonparser(),(req, res) => { 
  const signup = new SignUp(req.body);
  signup.save()
  res.send(signup)
  })

  app.post('/signin',jsonparser() ,async(req,res)=>{
    if(req.body){
      let signin =await SignUp.findOne(req.body)
      if(signin){
        res.send(signin)
      }else{
        res.send({"result":"no user found"})
      }
    }
  })

app.listen(5000)