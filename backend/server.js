const app = require("./index");
const connect = require("./src/config/db");
//require("dotenv").config();
//process.env.PORT || 
app.listen(5666,async(req,res)=>{
try{
    await connect();
    console.log("Listening to port 5666..")

}
catch(err){
console.log("Err",err)
}
})