import React from 'react'
import {useState,useEffect} from "react";
import {Box,Button,Stack,useToast,Text,Flex,Avatar} from "@chakra-ui/react";
import {AddIcon} from "@chakra-ui/icons"
import {ChatState} from "../../context/chatContextProvider";
import GroupChatModal from "./GroupChatModal"
import ChatLoading from "./ChatLoading";
import axios from "axios";





function MyChats({fetchAgain}) {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

 

 function getSender(loggedUser,users){

return users[0]._id===loggedUser.user._id?users[1].name :users[0].name;

}

function getSenderPicture(loggedUser,users){
  return users[0]._id ===loggedUser.user._id?users[1].picture:users[0].picture;
}
  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("https://chitchat-backend.onrender.com/chat", config);//show on UI My chat box
      //console.log("chat established",data)
      setChats(data);
      //console.log("Chats",chats)
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "30%" }}
      h={"600px"}
      marginLeft="10px"
      verticalAlign="top"
      borderRadius="lg"
      borderWidth="1px"
      position={"top"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "20px", md: "26px" }}
        fontFamily="sans-serif"
        d="flex"
        w="100%"
        
        alignItems="center"
      
      >
        <Flex justifyContent="space-between">
        <span>My Chats</span>
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
        </Flex>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        bg="#F8F8F8"
        w="100%"
         h="87%"
        borderRadius="lg"
        overflowY="scroll"
      >
        
          {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                display="flex"
              >
           <Avatar
          mr={2}
          size="sm"
          cursor="pointer"
          name={getSender(user,chat.users)}
          src={getSenderPicture(user,chat.users)}
        />
        <div>
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 25
                      ? chat.latestMessage.content.substring(0, 26) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
                </div>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )} 
      </Box>
    </Box>
  );
}

export default MyChats;
