const User = require("../models/UserModel");
require("dotenv").config();

const jwt = require("jsonwebtoken")

const generateToken = (user)=>{
return jwt.sign({user},process.env.SECRET_KEY)
}

const Register = async(req,res)=>{
try{
let user = await User.findOne({email:req.body.email}).lean().exec();
if(user){
  return res.status(400).status({message:"user already exists"});

 
}
user = await User.create(req.body);
const token = generateToken(user);
return res.status(201).send({user,token})
    }

catch(err){
return res.status(400).send({Err:err.message})
    }

}

const Login = async(req,res)=>{
try{
    let user = await User.findOne({email:req.body.email});
    if(!user){
       return res.status(400).send({message:"Incorrect credential"})
    }
    const match = user.checkPassword(req.body.password);

    if(!match){
        return res.status(400).send({message:"Incorrect credential"});
    }

    const token = generateToken(user);
    return res.status(200).send({user,token});

}
catch(err){
    return res.status(400).send({Err:err.message})

}
}

const GetAllusers = async(req,res)=>{
    const Keyword = req.query.search?
        {$or:[ {name:{$regex:req.query.search,$options:"i"}},//?{$or:[{field:{}},{field:{}}]}:{}
        {email:{$regex:req.query.search,$options:"i"}} ]}:{};
const users = await User.find(Keyword).find({_id:{$ne:req.user._id}})
//.find({_id:{$ne:req.user._id}})
return res.status(201).send(users)


}

module.exports = {Register,Login,GetAllusers}
//https://api.cloudinary.com/v1_1/chatting-app/image/upload