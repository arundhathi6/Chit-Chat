import {createContext,useEffect,useContext,useState} from "react";
import {Navigate} from "react-router-dom";
 const ChatContext = createContext();

const ChatProvider=({children})=>{
//const navigate=useNavigate();
const [user,setUser] =useState();
const [selectedChat,setSelectedChat] =useState();
const [chats,setChats] =useState([]);

useEffect(()=>{
const userInfo = JSON.parse(localStorage.getItem("userInfo"));
setUser(userInfo);
if(!userInfo){
//navigate("/") //navigate("/")
<Navigate to ="/" />
}
},[])
return <ChatContext.Provider value={{user,setUser,selectedChat,setSelectedChat,chats,setChats}}>{children}</ChatContext.Provider>
}

//in order to make it available to other part of our app we need to make a hook.
 export const ChatState=()=>{
 return useContext(ChatContext);

 }

 
export default ChatProvider;