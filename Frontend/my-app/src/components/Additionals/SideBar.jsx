import React from 'react';
import {useState,useEffect} from "react";
import {ChatState} from "../../context/chatContextProvider";
import {Box,Tooltip,Button,Text,Menu,MenuButton,MenuList,Flex} from "@chakra-ui/react";
import {ChevronDownIcon,BellIcon} from "@chakra-ui/icons";


function SideBar() {
  const {user} =ChatState();
    const [search,setSearch] = useState("");
    const [searchResult,setSearchResult]= useState([]);
    const [loading,setLoading] = useState(false);
    const [loadingChat,setLoadingChat] = useState();
  return (
    <>
        <Box
        d="flex"
        justifyContent="space-between"
        alignItem="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
        borderColor="aquamarine">
          <Flex justifyContent="space-between" alignItem="center">
            <Tooltip 
             hasArrow label='Search users to chit chat'
             bg='pink.300' color='white'>
                <Button variant="ghost">
                <i class="fas fa-search"></i>
                <Text>&nbsp;&nbsp;Search User</Text>
                </Button> 
                {/* d={{base:"none",md:"flex"}} when screen is small base is none else its visible */}
            </Tooltip>
            <Text fontSize="2xl"
            fontFamily="sans-serif"
            color='magenta' fontWeight={'bold'}>CHIT-CHAT</Text>
            <div>
              <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  <BellIcon fontSize="2xl" m={1}/>
                </MenuButton>
    <MenuList></MenuList>
              </Menu>
            </div>
            </Flex>
        </Box>
    </>
  )
}

export default SideBar