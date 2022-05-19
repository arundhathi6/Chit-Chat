import React from 'react';
import {useState} from "react";
import {Box,Flex} from '@chakra-ui/react';
import {ChatState} from "../context/chatContextProvider";
import SideBar from "../components/Additionals/SideBar"
import MyChats from "../components/Additionals/MyChats"
import ChatBox from "../components/Additionals/ChatBox"

function Chatpage() {
  const {user} = ChatState();
  const [fetchAgain,setFetchAgain]=useState(false)
  return (
    <div style={{height:"100vh"}}>
      {user && <SideBar w="100%" display={{base:"100%" , md:"100%"}}/>}
      <Box  h="88vh">
      <Flex justifyContent="space-between">
     
         {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>} 
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>} 
     
</Flex>
</Box>
    </div>
  )
}

export default Chatpage