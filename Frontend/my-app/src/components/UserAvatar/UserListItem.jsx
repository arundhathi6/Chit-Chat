import React from 'react'
import {ChatState} from "../../context/chatContextProvider";
import {Box,Avatar,Text,Flex} from "@chakra-ui/react"

export default function UserListItem({handleFunction,user}) {
  return (
    <>
  
     <Box
        onClick={handleFunction}
        cursor="pointer"
        bg="#E8E8E8"
        _hover={{
          background: "#38B2AC",
          color: "white",
        }}
        w="100%"
        d="flex"
        alignItems="center"
        color="black"
        px={3}
        py={2}
        mb={2}
        borderRadius="lg"
      >
          <Flex>
        <Avatar
          mr={2}
          size="sm"
          cursor="pointer"
          name={user.name}
          src={user.picture}
        />
        <Box>
         
          <Text>{user.name}</Text>
          <Text fontSize="xs">
            <b>Email : </b>
            {user.email}
          </Text>
          
        </Box>
        </Flex>
      </Box>
     
    </>
  )

}
