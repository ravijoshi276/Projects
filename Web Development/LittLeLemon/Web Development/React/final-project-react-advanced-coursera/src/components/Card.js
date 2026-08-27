import { Heading, HStack, Image, Text, VStack,Box } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import React from "react";

const Card = ({ title, description, imageSrc }) => {
  // Implement the UI for the Card component according to the instructions.
  // You should be able to implement the component with the elements imported above.
  // Feel free to import other UI components from Chakra UI if you wish to.
  return<Box rounded="md" background="white" color="black">
  <VStack >
      <Image src={imageSrc} />
    <Box ml="2">
    <Heading size="md" mr="auto" mt="3" mb="3">{title}</Heading>
    <Text textStyle="lg" color="gray.600" mb="3" mr="auto">{description}</Text>
    <HStack mb="2"><a><Text textStyle="s">See more</Text></a><FontAwesomeIcon icon={faArrowRight} size="1x"></FontAwesomeIcon></HStack>  
    </Box>
    </VStack>
    </Box>
    
};

export default Card;
