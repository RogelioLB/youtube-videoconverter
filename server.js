const express=require('express');
const morgan=require('morgan');
const path=require('path');

const app=express();
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json())
app.set("port",process.env.PORT||3000);

app.use(express.static(path.resolve(__dirname,'public')));

app.use("/url",require('./routes/ytdl'))

app.listen(app.get("port"),()=>{
    console.log("Listen in localhost:"+app.get("port"));
})