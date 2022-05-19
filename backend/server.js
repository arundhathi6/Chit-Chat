const app = require("./index");
const connect = require("./src/config/db");
//require("dotenv").config();
//process.env.PORT || 
const server = app.listen(5666,async(req,res)=>{
try{
    await connect();
    console.log("Listening to port 5666..")

}
catch(err){
console.log("Err",err)
}
})
//*****CONNECTING TO SOCKET.IO FROM SERVER_SIDE********************** */
const io=require("socket.io")(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000",
    }
})

io.on("connection",(socket)=>{
    console.log("connected to socket.io")
//setting up a room for each chat connection
    socket.on("setup",(userData)=>{
        socket.join(userData._id);
        //console.log(userData._id)
        socket.emit("connected");
    })

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
      });

      socket.on("new message", (newMessageRecieved) => {
          console.log("newMessageRecieved",newMessageRecieved)
        var chat = newMessageRecieved.chat;
    
        if (!chat.users) return console.log("chat.users not defined");
    
        chat.users.forEach((user) => {
          if (user._id == newMessageRecieved.sender._id) return;
    
          socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
      });

      socket.on("typing", (room) => socket.in(room).emit("typing"));
      socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

      socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });
});