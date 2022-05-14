import React from 'react'
import { useToast } from '@chakra-ui/react'//hook
import {useState,useEffect} from "react";
import {useNavigate} from "react-router-dom";//hook
import { VStack, FormControl,FormLabel,Input,InputGroup, InputRightElement,Button} from '@chakra-ui/react'
import axios from "axios";
function Logintab() {
 const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
   const [loading,setLoading]=useState(false);
    const [show,setShow]=useState(false);
    const toast = useToast();
    const handleClick=()=>setShow(!show);
    const submitHandler=async()=>{
      setLoading(true);
      if( !email || !password ){
          toast({
              title: 'Invalid Credentials',
              status: 'warning',
              duration: 5000,
              isClosable: true,
              position:"top",
              
            });
            setLoading(false)
            return;
      }

      try{
          const config = {
              headers :{
                  "Content-type":"application/json",
              }
          };

          const {data} = await axios.post(
              "http://localhost:5666/login", 
              {
              email:email,
              password:password,
              },
              config
          )
          toast({
              title: 'Login successful',
              status: 'success',
              duration: 5000,
              isClosable: true,
              position:"top",
              
            });
            localStorage.setItem("userInfo",JSON.stringify(data));
            setLoading(false)
            navigate("/chats")  
            return;
          

      } catch(error){
        //console.log("before toast",error.message)
          toast({
              title: error.message,
              status: "warning",
              duration: 5000,
              isClosable: true,
              position:"top",
              
            });
setLoading(false)
return;
      }



  }
  return (
   <VStack>
       

          <FormControl id="Email" isRequired>
           <FormLabel>Email</FormLabel>
               <Input 
               placeholder='Enter your Email'
               value={email}
               onChange={(e)=>setEmail(e.target.value)}/>
          </FormControl>

          <FormControl id="Password" isRequired>
           <FormLabel>Password</FormLabel>
           <InputGroup>
               <Input 
                type={show?"text":"password"}
               placeholder='Password'
               value={password}
               onChange={(e)=>setPassword(e.target.value)}/>
<InputRightElement width="4.5rem">
<Button h="1.75rem" size="sm" onClick={handleClick}>{show?"Hide":"Show"}</Button>
</InputRightElement>
</InputGroup>
          </FormControl>



          <Button
          colorScheme="cyan"
          width="100%"
          style={{marginTop:15}}
          onClick={submitHandler}
          isLoading={loading}>Login</Button>

<Button id="zzz"
          colorScheme="pink"
          width="100%"
          style={{marginTop:15}}
          onClick={()=>{
            setEmail("guestuser@chitchat.com")
            setPassword("Guest123")
          }}>Get Guest User Credentials</Button>
          
   </VStack>
  )
}

export default Logintab