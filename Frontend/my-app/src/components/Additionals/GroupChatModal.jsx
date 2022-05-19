import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    FormControl,
    Input,
    useToast,
    Box,
  } from "@chakra-ui/react";
  import axios from "axios";
  import { useState } from "react";
  import { ChatState } from "../../context/chatContextProvider";
  import UserBadgeItem from "../UserAvatar/UserBadgeItem";
  import UserListItem from "../UserAvatar/UserListItem";
  
  const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
  
    const { user, chats, setChats } = ChatState();
  
    const handleGroup = (userToAdd) => {
      console.log("TRIGGER")

      if (selectedUsers.find((u) => u._id === userToAdd._id)) {
        toast({
          title: "User Already in group!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }

//console.log("selectedUser",selectedUsers)
//console.log("userToAdd",userToAdd)
      if (selectedUsers.includes(userToAdd)) {
        //console.log("Already There")
        toast({
          title: "User already exist",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
  
      setSelectedUsers([...selectedUsers, userToAdd]);
     // console.log("unique",selectedUsers)
    };
  
    const handleSearch = async (query) => {
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
        const { data } = await axios.get(`http://localhost:5666/users?search=${search}`, config);
        console.log("groupmodal",data);
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
    };
  
    const handleDelete = (delUser) => {
      setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };
  
    const handleSubmit = async () => {
      if (!groupChatName || !selectedUsers) {
        toast({
          title: "Please fill all the feilds",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
  
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(`http://localhost:5666/group`,
         
          {
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map((u) => u._id)),
          },
          config
        );
        setChats([data, ...chats]);
        onClose();
        toast({
          title: "New Group Chat Created!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      } catch (error) {
        toast({
          title: "Failed to Create the Chat!",
          description: error.response.data,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
    };
  
    return (
      <>
        <span onClick={onOpen}>{children}</span>
  
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              fontSize="35px"
              fontFamily="Work sans"
              d="flex"
              justifyContent="center"
            >
              Create Group Chat
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody d="flex" flexDir="column" alignItems="center">
              <FormControl>
                <Input
                  placeholder="Chat Name"
                  mb={3}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <Input
                  placeholder="Add Users eg: Arundhathi, Sunil, Arjun"
                  mb={1}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </FormControl>
              <Box w="100%" d="flex" flexWrap="wrap">
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                    admin={user.user}
                  />
                ))}
              </Box>
              {loading ? (
              // <ChatLoading />
                <div>Loading...</div>
              ) : (
                searchResult
                  ?.slice(0, 6)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleSubmit} colorScheme="pink">
                Create Chat
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };
  
  export default GroupChatModal;
  