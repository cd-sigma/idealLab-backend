const mongoose=require("mongoose");
const config=require("../config.json");

mongoose.set("strictQuery",true);
mongoose.connect(config.mongo);

const db=mongoose.connection;

db.on("error",console.error.bind(console,'error occurred while setting up the database'));
db.on("open",function(){
    console.log("successfully connected to database");
});

module.exports=db;