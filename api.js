const express=require("express");
const app=express();
const config=require("./config.json");
const db=require("./config/mongoose.js");

app.use(express.static(config.static_path));
app.use(express.urlencoded());

app.use('/uploads',express.static(__dirname+'/uploads'));
app.use('/',require('./routes/index.js'));

app.set('views','./views');

app.listen(config.port,function(err){
    if(err){
        console.log(`error occured: ${err}`);
        return;
    }
    console.log(`express server is up and running on port: ${config.port}`);
})