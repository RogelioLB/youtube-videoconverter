const fs = require('fs');
const path=require('path');
const cp = require('child_process');
const readline = require('readline');
// External modules
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg-static');
const {Router}=require('express');


const routes=Router();

function removeEmojis (string) {
  var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
  return string.replace(regex, '');
}
routes.post("/", async(req,res)=>{
  const {uri,op,id}=req.body;
  var io=req.app.get("socket");
  let r=ytdl.validateURL(uri);
  // Global constants
  if(r){
  const ref = uri;
  const tracker = {
    start: Date.now(),
    audio: { downloaded: 0, total: Infinity },
    video: { downloaded: 0, total: Infinity },
    merged: { frame: 0, speed: '0x', fps: 0 },
  };
  var songinfo=await ytdl.getInfo(ref);
    let nombre = songinfo.videoDetails.title;
    nombre=removeEmojis(nombre);
    console.log(nombre);
if(op=='Video'){
/*
  // Get audio and video stream going
  const audio = ytdl(ref, { filter: 'audioonly', quality: 'highestaudio' })
    .on('progress', (_, downloaded, total) => {
      tracker.audio = { downloaded, total };
    });
  const video = ytdl(ref, { filter: 'videoonly', quality: '136' })
    .on('progress', (_, downloaded, total) => {
      tracker.video = { downloaded, total };
    });
  
  // Get the progress bar going
  const progressbar = setInterval(() => {
    readline.cursorTo(process.stdout, 0);
    const toMB = i => (i / 1024 / 1024).toFixed(2);
  
    process.stdout.write(`Audio  | ${(tracker.audio.downloaded / tracker.audio.total * 100).toFixed(2)}% processed `);
    process.stdout.write(`(${toMB(tracker.audio.downloaded)}MB of ${toMB(tracker.audio.total)}MB).${' '.repeat(10)}\n`);
  
    process.stdout.write(`Video  | ${(tracker.video.downloaded / tracker.video.total * 100).toFixed(2)}% processed `);
    process.stdout.write(`(${toMB(tracker.video.downloaded)}MB of ${toMB(tracker.video.total)}MB).${' '.repeat(10)}\n`);
  
    process.stdout.write(`Merged | processing frame ${tracker.merged.frame} `);
    process.stdout.write(`(at ${tracker.merged.fps} fps => ${tracker.merged.speed}).${' '.repeat(10)}\n`);
  
    process.stdout.write(`running for: ${((Date.now() - tracker.start) / 1000 / 60).toFixed(2)} Minutes.`);
    readline.moveCursor(process.stdout, 0, -3);
    io.to(id).emit("upload",{downloaded:(tracker.video.downloaded / tracker.video.total * 100).toFixed(2)})
  }, 1000);
  
  // Start the ffmpeg child process
  const ffmpegProcess = cp.spawn(ffmpeg, [
    // Remove ffmpeg's console spamming
    '-loglevel', '0', '-hide_banner',
    // Redirect/enable progress messages
    '-progress', 'pipe:3',
    // 3 second audio offset
    '-i', 'pipe:4',
    '-i', 'pipe:5',
    // Rescale the video
    '-vf','scale=-1:1080',
    // Choose some fancy codes
    '-c:v', 'libx265', '-x265-params', 'log-level=0',
    '-c:a', 'flac',
    // Define output container
    '-f', 'matroska', 'pipe:6',
  ], {
    windowsHide: true,
    stdio: [
      'inherit', 'inherit', 'inherit',
      'pipe', 'pipe', 'pipe', 'pipe',
    ],
  });
  ffmpegProcess.on('close', () => {
    process.stdout.write('\n\n\n\n');
    clearInterval(progressbar);
    console.log('done');
    io.to(id).emit("Finish");
  });
  
  // Link streams
  // FFmpeg creates the transformer streams and we just have to insert / read data
  ffmpegProcess.stdio[3].on('data', chunk => {
    // Parse the param=value list returned by ffmpeg
    const lines = chunk.toString().trim().split('\n');
    const args = {};
    for (const l of lines) {
      const [key, value] = l.trim().split('=');
      args[key] = value;
    }
    tracker.merged = args;
  });
  audio.pipe(ffmpegProcess.stdio[4]);
  video.pipe(ffmpegProcess.stdio[5]);
  ffmpegProcess.stdio[6].pipe(fs.createWriteStream(path.resolve(__dirname,`../public/${nombre}.mkv`)));
*/
  ytdl(ref, { quality: 'highest' }).on('progress', (_, downloaded, total) => {
    tracker.video = { downloaded, total };
    io.to(id).emit("upload", { downloaded: (tracker.video.downloaded / tracker.video.total * 100).toFixed(2) })
  }).on('end', () => {
    io.to(id).emit("Finish");
  }).pipe(fs.createWriteStream(path.resolve(__dirname, `../public/${nombre}.mp4`)));
    } if (op == 'Audio') {
  ytdl(ref, { filter: 'audioonly' ,quality:'highestaudio'})
    .on('progress', (_, downloaded, total) => {
      tracker.audio = { downloaded, total };
      io.to(id).emit("upload",{downloaded:(tracker.audio.downloaded/tracker.audio.total*100).toFixed(2)})
    }).on('end',()=>{
      io.to(id).emit("Finish");
    }).pipe(fs.createWriteStream(path.resolve(__dirname,`../public/${nombre}.mp3`)));
  

    var iD=ytdl.getVideoID(ref);
}
res.send({op:true,id:iD,names:nombre,title:nombre});
}
});
module.exports=routes;

