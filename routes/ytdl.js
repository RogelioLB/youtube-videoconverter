const fs = require('fs');
const path=require('path');
const cp = require('child_process');
const readline = require('readline');
// External modules
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg-static');
const {Router}=require('express');


const routes=Router();

routes.post("/",async (req,res)=>{
  const {uri,op}=req.body;
  var io=req.app.get("socket");
  let r=await ytdl.validateURL(uri);
  // Global constants
  if(r){
  const ref = uri;
  let info = await ytdl.getInfo(ref);
let audioFormats = ytdl.filterFormats(info.formats, 'videoonly');
let format = ytdl.chooseFormat(audioFormats, { quality:'highestvideo' });
console.log('Format found!', format);
audioFormats=ytdl.filterFormats(info.formats, 'audioonly');
 format = ytdl.chooseFormat(audioFormats, { quality:'highestaudio' });
console.log('Format found!', format);

if(op=='Video'){
  const tracker = {
    start: Date.now(),
    audio: { downloaded: 0, total: Infinity },
    video: { downloaded: 0, total: Infinity },
    merged: { frame: 0, speed: '0x', fps: 0 },
  };
  
  // Get audio and video stream going
  const audio = ytdl(ref, { filter: 'audioonly', quality: 'highestaudio' })
    .on('progress', (_, downloaded, total) => {
      tracker.audio = { downloaded, total };
    });
  const video = ytdl(ref, { filter: 'videoonly', quality: 'highestvideo' })
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
    // Choose some fancy codes
    '-c:v', 'libx265', '-x265-params', 'log-level=0',
    '-c:a', 'flac',
    // Define output container
    '-f', 'matroska', 'pipe:6',
  ], {
    windowsHide: true,
    stdio: [
      /* Standard: stdin, stdout, stderr */
      'inherit', 'inherit', 'inherit',
      /* Custom: pipe:3, pipe:4, pipe:5, pipe:6 */
      'pipe', 'pipe', 'pipe', 'pipe',
    ],
  });
  ffmpegProcess.on('close', () => {
    process.stdout.write('\n\n\n\n');
    clearInterval(progressbar);
    console.log('done');
    io.emit("Finish");
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
  ffmpegProcess.stdio[6].pipe(fs.createWriteStream(path.resolve(__dirname,'../public/video.mkv')));
}if(op=='Audio'){
  ytdl(ref,{filter:'audioonly',format:'highestaudio'}).pipe(fs.createWriteStream(path.resolve(__dirname,'../public/audio.mp3')));
}
res.send({op:true});
}
});
module.exports=routes;

