import { VStack, FormControl,FormLabel,Input,InputGroup, InputRightElement,Button} from '@chakra-ui/react'
import React from 'react';
import { useToast } from '@chakra-ui/react'//hook
import {useState,useEffect} from "react";
import {useNavigate} from "react-router-dom";//hook
import axios from "axios";

function Signuptab() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repassword,setRepassword]=useState("");
    const [show,setShow]=useState(false);
    const [picz,setPicz]=useState(); //pic url we created using cloudinary
    const [loading,setLoading]=useState(false);
    const toast = useToast(); //pop-up from chakraUI like an alert
    const navigate = useNavigate();
    const handleClick=()=>setShow(!show);
    const submitHandler=async()=>{
        setLoading(true);
        if(!name || !email || !password || !repassword){
            toast({
                title: 'Please Fill all the Fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"top",
                
              });
              setLoading(false)
              return;
        }

        if( password != repassword){
            toast({
                title: 'Password not matching',
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
                "https://chitchat-backend.onrender.com/register", 
                {name:name,
                email:email,
                password:password,
                picture:picz},
                config
            )
            toast({
                title: 'Registration successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position:"top",
                
              });
              localStorage.setItem("userInfo",JSON.stringify(data));
              setLoading(false)
              
              navigate("/chats")  
              window. location. reload() 
              return;
            

        } catch(error){
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
    const postPicture=(pic)=>{
        setLoading(true);
        if(pic===undefined){
            //toast is to show alert pop-up
            toast({
                title: 'Please Select an Image.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"bottom",
              });
             setLoading(false)
              return;
            }

            if(pic.type==="image/jpeg" || pic.type ==="image/png"){
                //format to sends to cloudinary so that we'll get url of picture
                const data = new FormData();
                data.append("file",pic);
                data.append("upload_preset", "chatting-app");
                data.append("cloud_name","sunaru");
                //https://api.cloudinary.com/v1_1/cloud_name/image/upload
                fetch("https://api.cloudinary.com/v1_1/sunaru/image/upload",{
                    method:"post",
                    body:data,
                 }).then((res)=>res.json())
                 .then(data=>{
                     setPicz(data.url.toString());
                     console.log(data);
                     setLoading(false)
                 })
                 .catch((err)=>{
                     console.log("err",err)
                     setLoading(false)
                 })
            }
            else{
                toast({
                    title: 'Please Select an Image.',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                    position:"bottom",
                  });
                  setLoading(false)
                  return;

            }

            
        }
               
    
  return (
   <VStack>
       <FormControl id="Name" isRequired>
           <FormLabel>Name</FormLabel>
               <Input 
               placeholder='Enter your Name'
               onChange={(e)=>setName(e.target.value)}/>
          </FormControl>

          <FormControl id="Email" isRequired>
           <FormLabel>Email</FormLabel>
               <Input 
               placeholder='Enter your EmailID'
               onChange={(e)=>setEmail(e.target.value)}/>
          </FormControl>

          <FormControl id="Password" isRequired>
           <FormLabel>Password</FormLabel>
           <InputGroup>
               <Input 
                type={show?"text":"password"}
               placeholder='Password'
               onChange={(e)=>setPassword(e.target.value)}/>
<InputRightElement width="4.5rem">
<Button h="1.75rem" size="sm" onClick={handleClick}>{show?"Hide":"Show"}</Button>
</InputRightElement>
</InputGroup>
          </FormControl>

          <FormControl id="Re-password" isRequired>
           <FormLabel>Confirm Password</FormLabel>
           <InputGroup>
               <Input 
               type={show?"text":"password"}
               placeholder='Confirm password'
               onChange={(e)=>setRepassword(e.target.value)}/>
            <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>{show?"Hide":"Show"}</Button>
            </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl id="picture" isRequired>
           <FormLabel>Upload your picture</FormLabel>
             <Input 
               type="file"
               accept='images/*'
               onChange={(e)=>postPicture(e.target.files[0])}
               />
          </FormControl>

          <Button
          colorScheme="cyan"
          width="100%"
          style={{marginTop:15}}
          onClick={submitHandler}
          isLoading={loading}>Sign Up</Button>
          
   </VStack>
  )
}

export default Signuptab
