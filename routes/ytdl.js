const fs = require('fs');
const path=require('path');
const ytdl = require('ytdl-core');
const {Router}=require('express');


const routes=Router();

routes.post("/",(req,res)=>{
  const {uri}=req.body;
    let r=ytdl(uri)
    .pipe(fs.createWriteStream(path.resolve(__dirname,`public/video.mp3`)))
    if(r) res.send({op:true});
    else res.send({op:false});
  });

module.exports=routes;

