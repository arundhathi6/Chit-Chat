import { ViewIcon } from "@chakra-ui/icons";
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
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";

export const ProfileModelPopup = ({user,children})=>{
    const { isOpen, onOpen, onClose } = useDisclosure()
    //console.log("modal",user.name)
return (
    <>
     {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
   
    <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
            fontFamily="sans-serif"
            d="flex"
            justifyContent="center"
            textAlign="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
            
          >
           <div style={{width:"150px",marginLeft:"34%"}}>
            <Image
             borderRadius="full"
              boxSize="150px"
              src={user.picture}
              alt={user.name}/></div>
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="sans-serif"
              textAlign={"center"}
            >
              Email: {user.email}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
   
  </>

)
}
