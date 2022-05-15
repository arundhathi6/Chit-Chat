import React from 'react';
import {Box,Flex} from '@chakra-ui/react';
import {ChatState} from "../context/chatContextProvider";
import SideBar from "../components/Additionals/SideBar"
import MyChats from "../components/Additionals/MyChats"
import ChatBox from "../components/Additionals/ChatBox"

function Chatpage() {
  const {user} = ChatState();
  return (
    <div style={{width:"100%"}}>
      {user && <SideBar/>}
      <Box w="100%" h="91.5vh">
      <Flex>
     
         {user && <MyChats/>} 
        {user && <ChatBox/>} 
     
</Flex>
</Box>
    </div>
  )
}

export default Chatpage