import React from 'react';
import Logintab from "../components/Authentication/Logintab";
import Signuptab from "../components/Authentication/Signuptab";
import {Container,Box,Text,Tabs,Tab,TabList,TabPanels,TabPanel} from '@chakra-ui/react';
function Home() {
  return (
    <div>
     <Container>
     <Box 
    
     justifyContent="center"
     bg='white'
     w='100%'
     m="20px 0 15px 0"
     p={4} 
      borderRight="lg"
      borderWidth="1px">
  <Text fontSize="2xl" fontWeight="bold" color='darkviolet'>ANIRUDH</Text>
</Box >
<Box 
 bg='white'
 w="100%"
 p={4} 
 borderRadius="lg"
 borderWidth="1px"
>
<Tabs variant='soft-rounded' colorScheme='pink' >
  <TabList mb="1em">
    <Tab width="50%" >Login</Tab>
    <Tab width="50%">Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel><Logintab/></TabPanel>
    <TabPanel><Signuptab/></TabPanel>
  </TabPanels>
</Tabs>
</Box>
</Container>
    </div>
  )
}

export default Home