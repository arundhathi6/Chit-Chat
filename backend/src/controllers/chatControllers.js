const User = require("../models/UserModel")
const Chat = require("../models/ChatModel")
const Message = require("../models/MessageModel")
//1.access chat
const accessChat=async(req,res)=>{
    const { userId } = req.body;

    if (!userId) {
      console.log("UserId not sent with request");
      return res.status(400).send("UserId not sent with request");
    }
  
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");
  
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name picture email",
    });
  
    if (isChat.length > 0) {
      return res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
  
      try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        return res.status(200).json(FullChat);
      } catch (error) {
        return res.status(400).send({message:error.message});
      }
    }

}

//2.Fetch chat for all users
const fetchChat=(req,res)=>{
    try {
        //Going through all chats in which user is part of
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
          .populate("users", "-password")
          .populate("groupAdmin", "-password")
          .populate("latestMessage")
          .sort({ updatedAt: -1 })
          .then(async (results) => {
            results = await User.populate(results, {
              path: "latestMessage.sender",
              select: "name picture email",
            });
            return res.status(200).send(results);
          });
      } catch (error) {
        return res.status(400).send({message:error.message});
       
        
      }
}
//3.creating group
const createGroup=async(req,res)=>{
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the feilds" });
      }
    
      var users = JSON.parse(req.body.users);
    
      if (users.length < 2) {
        return res
          .status(400)
          .send("More than 2 users are required to form a group chat");
      }
    
      users.push(req.user);
      let new_users=[];
      users.map((u)=>{
        if(!new_users.includes(u._id)){
          new_users.push(u)
        }
      })
    
      try {
        const groupChat = await Chat.create({
          chatName: req.body.name,
          users: new_users,
          isGroupChat: true,
          groupAdmin: req.user,
        });
    
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
          .populate("users", "-password")
          .populate("groupAdmin", "-password");
    
        return res.status(200).json(fullGroupChat);
      } catch (error) {
       return res.status(400).send({message:error.message});
      }
    
}
//4.renaming group
const renameGroup=async(req,res)=>{
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(chatId,{chatName: chatName},{new: true})
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!updatedChat) {
      return res.status(404).send("Chat Not Found");
    } else {
      return res.status(201).json(updatedChat);
    }
    
}

//5.add to group
const addGroup=async(req,res)=>{
    const { chatId, userId } = req.body;

  // check if the requester is admin, if yes throw error
  if(userId==req.user._id){
      return res.status(400).send("user already exist")
  }

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $addToSet: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404).send("Chat Not Found");
  } else {
    return res.json(added);
  }
    
}

//6.remove from group
const removeGroup=async(req,res)=>{
    const { chatId, userId } = req.body;

    // check if the requester is admin, if yes can't remove
    // if(userId==req.user._id){
    //     return res.status(400).send("Can't remove admin")
    // }
  
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!removed) {
      res.status(404).send({message:"Chat Not Found"});
    } else {
      return res.status(201).json(removed);
    }
    
}

const sendMessage=async(req,res)=>{
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.status(400).send("Invalid data passed into request");
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name picture");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name picture email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    return res.json(message);
  } catch (error) {
    //console.log(error.message)
    return res.status(400).send(error.message);
  }

}

const allMessages=async(req,res)=>{
  try {
    const messages = await Message.find({chat:req.params.chatId})
      .populate("sender", "name picture email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    //console.log(error.message)
    res.status(400).send(error.message);
  }
  
}

module.exports ={accessChat,fetchChat,createGroup,renameGroup,removeGroup,addGroup,sendMessage,allMessages}