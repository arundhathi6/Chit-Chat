import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {useEffect,useRef} from "react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../Logic/ChatLogics";
import { ChatState } from "../../context/chatContextProvider.jsx";
////height:"480px",
const ScrollableChat = ({ messages }) => {
  const messageRef=useRef(null);
  const { user } = ChatState();
//console.log("messages",messages)
//For scrolling till bottom
useEffect(()=>{
  messageRef.current?.scrollIntoView()
})
  return (
    <div style={{ overflowY:"auto"}}> 
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
             
             {(isSameSender(messages, m, i, user.user._id) ||
              isLastMessage(messages, i, user.user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.picture}
                />
              </Tooltip>
            )}
            
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user.user._id ? "#B9F5D0" : "white"  
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user.user._id),
                marginTop: isSameUser(messages, m, i, user.user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>

        ))}
         <div ref={messageRef}/> 
         {/* For scrolling to bottom */}
   </div>
  );
};

export default ScrollableChat;
//#B9F5D0
//"#BEE3F8"
//#f7b0bb
//#66f2ed