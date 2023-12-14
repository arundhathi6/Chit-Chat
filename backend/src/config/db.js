const mongoose = require("mongoose");
require("dotenv").config();

const connect = ()=>{
    //process.env.MONGODB_URL
    return mongoose.connect("mongodb+srv://arundhathi:Arundhathi009@cluster0.mar6i.mongodb.net/chattingApp?retryWrites=true&w=majority");
}
module.exports=connect;
