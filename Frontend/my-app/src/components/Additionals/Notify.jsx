import React from 'react'
import {useEffect} from "react";
import {ChatState} from "../../context/chatContextProvider";
import "../CSS/styles.css"

function Notify() {
    const {notification,setNotification,user,setUser,selectedChat,setSelectedChat,chats,setChats}=ChatState()
    
    // useEffect(()=>{
    //     setNotification(notification)
    // },[notification])

    function getSender(loggedUser,users){
        return users[0]._id ===loggedUser.user._id?users[1].name:users[0].name;
    
    }
  

    function reArrange(e){
        setSelectedChat(e.chat)
       
        notification=notification.filter((n) => n._id !==e._id)
        
        setNotification(notification);
    }
   // console.log("Notif",notification)
  return (
     
    <div>
        {notification.map((e)=>{
            return <li 
            key={e._id}
                onClick={()=>{
                    setSelectedChat(e.chat);
                    setNotification(notification.filter((n)=>n!==e))
                }}> {
                e.chat.isGroupChat?`New message from ${e.chat.chatName}`:`New Message from ${getSender(user,e.chat.users)}`
                } </li>
        })}
    </div>
   
  )
}

export default Notify