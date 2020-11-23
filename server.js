const express=require('express');
const morgan=require('morgan');
const path=require('path');

const app=express();
var http = require('http').createServer(app);
const io=require('socket.io')(http);


io.on('connection', function(socket){

    console.log('user connected with socketId '+socket.id);
  
    socket.on('event', function(data){
        console.log('event fired');
    });
  
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
  
  });
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.set("port",process.env.PORT||3000);
app.set("socket",io);


app.use(express.static(path.resolve(__dirname,'public')));


app.use("/url",require('./routes/ytdl'));


http.listen(app.get("port"),()=>{
    console.log("Listen in localhost:"+app.get("port"));
})