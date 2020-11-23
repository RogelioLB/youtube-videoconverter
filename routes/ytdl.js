const fs = require('fs');
const path=require('path');
const ytdl = require('ytdl-core');
const {Router}=require('express');


const routes=Router();

routes.post("/",(req,res)=>{
  const {uri}=req.body;
  let r=ytdl.validateURL(uri)
  ytdl.chooseFormat({ filter: format => format.container === 'mp4' },{quality:'137'})
    if(r) {
      ytdl(uri)
    .pipe(fs.createWriteStream(path.resolve(__dirname,`../public/video.mp4`)))
      res.send({op:true});
}
    else res.send({op:false});
  });

module.exports=routes;

