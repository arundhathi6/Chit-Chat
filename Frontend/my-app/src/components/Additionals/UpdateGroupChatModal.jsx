import { IconButton} from '@chakra-ui/react'
import {ViewIcon} from "@chakra-ui/icons"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,useDisclosure,Box,FormControl,Input,Flex,useToast,Spinner
  } from '@chakra-ui/react'
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
import {useState,useEffect} from "react";
import {ChatState} from "../../context/chatContextProvider"
import axios from "axios"
export const UpdateGroupChatModal = ({fetchAgain,setFetchAgain,fetchMessages})=>{
    const toast = useToast();
    const {user,selectedChat,setSelectedChat}=ChatState()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName,setGroupChatName] =useState();
    const [search,setSearch] = useState("")
    const [searchResult,setSearchResult] =useState([]);
    const [loading,setLoading]=useState(false);
    const [renameLoading,setRenameLoading]=useState(false);
    //console.log("selectedChatUpdated",selectedChat.users)
    //console.log("key",user.user._id)
    const handleRemove = async(user1)=>{
        if (selectedChat.groupAdmin._id !== user.user._id && user1._id !== user.user._id) {
            toast({
              title: "Only admins can remove someone!",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            return;
          }
      
          try {
            setLoading(true);
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            };
            const { data } = await axios.put(
              `https://chitchat-backend.onrender.com/groupremove`,
              {
                chatId: selectedChat._id,
                userId: user1._id,
              },
              config
            );
      
            user1._id === user.user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
          } catch (error) {
            toast({
              title: "Error Occured!",
              description: error.response.data.message,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setLoading(false);
          }
          setGroupChatName("");

    }
// Add User
    const handleAddUser = async(user1)=>{
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
              title: "User Already in group!",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            return;
          }
      
          if (selectedChat.groupAdmin._id !== user.user._id) {
            toast({
              title: "Only admins can add someone!",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            return;
          }
      
          try {
            setLoading(true);
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            };
            const { data } = await axios.put(`https://chitchat-backend.onrender.com/groupadd`,
              {
                chatId: selectedChat._id,
                userId: user1._id,
              },
              config
            );
      
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
          } catch (error) {
            toast({
              title: "Error Occured!",
              description: error.response.data.message,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setLoading(false);
          }
          setGroupChatName("");
    }

    const handleRename = async()=>{
        if (!groupChatName) return;

        try {
          setRenameLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.put(`https://chitchat-backend.onrender.com/rename`,
            {
              chatId: selectedChat._id,
              chatName: groupChatName,
            },
            config
          );
    
          //console.log(data._id);
          // setSelectedChat("");
          setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          setRenameLoading(false);
        
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setRenameLoading(false);
        }
        setGroupChatName("");

    }

    const handleSearch = async(query)=>{
        setSearch(query);
        if (!query) {
          return;
        }
    
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.get(`https://chitchat-backend.onrender.com/users?search=${search}`, config);
         // console.log("groupmodal",data);
          setLoading(false);
          setSearchResult(data);
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
    return (
      <>
     <IconButton d={{base:"flex"}} icon={<ViewIcon />} onClick={onOpen}/>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
            fontSize="35px"
            fontFamily="sans-serif"
            d="flex"
            justifyContent="center"
            >{selectedChat.chatName}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
          <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u)=>{
                  return <UserBadgeItem
                  key={user.user._id}
                  admin={selectedChat.groupAdmin}
                  user={u}
                  handleFunction={()=>handleRemove(u)}/>
            
              })}
          </Box>

          <FormControl>
              <Flex>
              <Input 
              placeholder="Chat Name"
              mb={3}
              value={groupChatName}
              onChange={(e)=>setGroupChatName(e.target.value)}/>
              <Button
              variant="solid"
              colorScheme="pink"
              ml={1}
              isLoading={renameLoading}
              onClick={handleRename}>Update</Button>
              </Flex>
              </FormControl>
              <FormControl>
                  <Input
                  placeholder="Add User to Group"
                  mb={1}
                  onChange={(e)=>handleSearch(e.target.value)}/>
              </FormControl>
              {loading ?(
                  <Spinner size="lg"/>
              ):(
                searchResult
                ?.slice(0, 4).map((user)=>(
                     
                      <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={()=>handleAddUser(user)}/>
                  ))
              
              )}
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='red' mr={3} onClick={()=>handleRemove(user.user)}>
                Leave group
              </Button>
           
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )

}
