import React from 'react';
import {useState,useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {ChatState} from "../../context/chatContextProvider";
import {Input,Box,Tooltip,Button,Text,Menu,MenuButton,MenuList,Flex,Avatar,MenuItem,useDisclosure} from "@chakra-ui/react";
import {ChevronDownIcon,BellIcon} from "@chakra-ui/icons";
import {ProfileModelPopup} from "./ProfileModelPopup";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import Notify from "./Notify.jsx"
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Spinner,
  useToast
} from '@chakra-ui/react'
import axios from "axios";

function SideBar() {
  const {user,setUser,selectedChat,setSelectedChat,chats,setChats,notification,setNotification} =ChatState();
  const navigate=useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()
    const [search,setSearch] = useState("");
    const [searchResult,setSearchResult]= useState([]);
    const [loading,setLoading] = useState(false);
    const [loadingChat,setLoadingChat] = useState();
    function logOut(){
      localStorage.removeItem("userInfo");
      navigate("/")
    }
 

    async function handleSearch(){
      if (!search) {
        toast({
          title: "Please Enter something in search",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
        return;
      }
  
      try {
        setLoading(true);
  //console.log("checking",user.token)
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`, // sending token to headers since I've implemented middleware in  backend
          },
        };
  
        const { data } = await axios.get(`http://localhost:5666/users?search=${search}`, config);
  
        setLoading(false);
        setSearchResult(data);
        //console.log("searchResult",searchResult)
        return;
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        return;
      }
    }

    async function accessChat(userId){
      //console.log(userId);

      try {
        setLoadingChat(true);
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(`http://localhost:5666/chat`, { userId }, config);//create environment to chat with selected user
        console.log("data",data)
       if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
        setSelectedChat(data);
        
        setLoadingChat(false);
        onClose();
      } catch (error) {
        toast({
          title: "Error fetching the chat",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
      return;
    }
  return (
    <>
        <Box
        d="flex"
        justifyContent="space-between"
        alignItem="center"
        bg="white"
        w="100%"
        p="5px 5px 5px 5px"
        borderWidth="5px"
        borderColor="aquamarine">
          <Flex justifyContent="space-between" alignItem="center">
            <Tooltip 
             hasArrow label='Search users to chit chat'
             bg='pink.300' color='white'>
                <Button variant="ghost" onClick={onOpen}>
                <i class="fas fa-search"></i>&nbsp;&nbsp;
                <Text display={{base:"none",md:"flex"}}>Search User</Text>
                </Button> 
                {/* d={{base:"none",md:"flex"}} when screen is small base is none else its visible */}
            </Tooltip>
            <Text fontSize="2xl"
            fontFamily="sans-serif"
            color='darkviolet' fontWeight={'bold'}>CHIT-CHAT</Text>
            <div>
            <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length ? "No New Messages" :<MenuItem  className="notificationStyles"><Notify/></MenuItem>}
             
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.user.name}
                src={user.user.picture}//if picture is not there it will take first letter of the name
              />
            </MenuButton>
            <MenuList>
              <ProfileModelPopup  user={user.user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModelPopup >
              {/* <MenuDivider /> */}
              <MenuItem onClick={logOut}>Logout</MenuItem>
            </MenuList> 
          </Menu>

            </div>
            </Flex>
        </Box>

        
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box pb={2}>
              <Flex>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button 
              onClick={handleSearch}
              >Go</Button>
              </Flex>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
             
              searchResult?.map((u) => ( //looping through all searched results
             
                <UserListItem
                  key={u._id}
                  user={u}
                  handleFunction={() => accessChat(u._id)}
                />
              ))
             
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />} 
          </DrawerBody> 
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideBar

