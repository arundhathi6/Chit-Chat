const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/UserModel.js");


const authorizeBefore = async(req,res,next)=>{
    let token;
    //console.log("1")
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            //console.log("2")
            token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token,process.env.SECRET_KEY);
            //console.log(decoded)
            //req.user = await User.findById(decoded._id).select("-password")
            req.user=decoded.user;
            next();
          
        }
        catch(error){
            return res.status(400).send({message:error.message});
        }
    }

    if(!token){
        console.log("3")
        return res.status(401).send("Not authorized, no token")
    }
}

module.exports = {authorizeBefore};