
import { IconButton,Flex, Spinner, useToast, FormControl, Input,Box, Text  } from "@chakra-ui/react";
import "../CSS/styles.css";
import { useEffect, useState} from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
 import {ProfileModelPopup} from "./ProfileModelPopup";
import ScrollableChat from "./ScrollableChat";
import {useNavigate} from "react-router-dom"

 import io from "socket.io-client";
 import {UpdateGroupChatModal} from "./UpdateGroupChatModal";
 import { ChatState } from "../../context/chatContextProvider";
 const ENDPOINT = "https://my-mern-chit-chat-app.herokuapp.com/"
 //https://my-mern-chit-chat-app.herokuapp.com/
 var socket, selectedChatCompare;

 const SingleChat = ({ fetchAgain, setFetchAgain}) => {
   const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const { selectedChat, setSelectedChat, user, notification, setNotification } =  ChatState();
  const [istyping, setIsTyping] = useState(false);
   const toast = useToast();
  
  useEffect(() => {
    fetchMessages();
  selectedChatCompare = selectedChat;
  //console.log("selectedChatCompare",selectedChatCompare)
    // eslint-disable-next-line
  }, [selectedChat]);

  
 useEffect(() => {
  socket = io(ENDPOINT); 
  socket.emit("setup", user.user);
  socket.on("connected", () => setSocketConnected(true));
   socket.on("typing", () => setIsTyping(true));
 socket.on("stop typing", () => setIsTyping(false));

//     // eslint-disable-next-line
 }, []);

 useEffect(() => {
  
  socket.on("message recieved", (newMessageRecieved) => {
   
    if (!selectedChatCompare || // if chat is not selected or doesn't match current chat
      selectedChatCompare._id != newMessageRecieved.chat._id) 
  
  {

      if (!notification.includes(newMessageRecieved)) {
       //console.log("Inside",newMessageRecieved)
        setNotification([newMessageRecieved, ...notification]);
       // console.log("notification",notification)
        setFetchAgain(!fetchAgain);
      }
    } else {
      setMessages([...messages, newMessageRecieved]);
    }
   });
});
   




function getSender(loggedUser,users){
    return users[0]._id ===loggedUser.user._id?users[1].name:users[0].name;

}
function getSenderFull(loggedUser,users){
    return users[0]._id ===loggedUser.user._id?users[1]:users[0];

}
function getSenderPicture(loggedUser,users){
  return users[0]._id ===loggedUser.user._id?users[1].picture:users[0].picture;

}
//*********************FETCH MESSAGE FUNCTION*******************
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(`https://my-mern-chit-chat-app.herokuapp.com/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
   //console.log("fetchedMessages after GET request",data)
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };



//*********************SEND MESSAGE FUNCTION*******************
   const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post("https://my-mern-chit-chat-app.herokuapp.com/message" ,
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
        //console.log("setMessages",messages)
        return;
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
    }
   };

 //*********************TYPING HANDLER FUNCTION*******************
  const typingHandler = (e) => {
     setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

   return (
   <div>
    {selectedChat ? (
        <>
          {/* <Flex justifyContent={{ base: "space-between" }}> */}
          <Text
          fontSize={{ base: "23px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
             <Flex justifyContent={{ base: "space-between", md:"space-between"}}> 
            <IconButton
              display={{ md: "none", base: "flex"}}
          
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            { (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModelPopup
                    user={getSenderFull(user, selectedChat.users)}/>
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                   
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                </>
              ))}
                  </Flex>
          </Text>
     
           <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
             w={{base:"100%", md:"800px"}}
            h="500px"  //555
            borderRadius="lg"
            overflowY="hidden"
          > 
            {loading ? (
              <Spinner
                size="xl"
                w={30}
                h={30}
                d="flex"
                justifyContent={"center"}
                alignItems={"center"}
                paddingLeft={30}
               
              />
            ) : (
              <div className="messages">
              
                <ScrollableChat messages={messages} />
               
              </div>
            )}

             <FormControl
             
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping ? (
                <div>
                 Typing...
              </div>
               
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl> 
          </Box> 
        </>
          
      ) : (
        
        <Box display="flex" alignItems="center" justifyContent="center" h="100%" >
          <Text fontSize="3xl" pb={3} fontFamily="sans-serif" textAlign="center" paddingTop="28%">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
 </div>
 );
 }

export default SingleChat;


