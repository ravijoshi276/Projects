import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faLinkedin,
  faMedium,
  faStackOverflow,
} from "@fortawesome/free-brands-svg-icons";
import { Box, HStack } from "@chakra-ui/react";

const socials = [
  {
    icon: faEnvelope,
    url: "mailto: hello@example.com",
  },
  {
    icon: faGithub,
    url: "https://github.com",
  },
  {
    icon: faLinkedin,
    url: "https://www.linkedin.com",
  },
  {
    icon: faMedium,
    url: "https://medium.com",
  },
  {
    icon: faStackOverflow,
    url: "https://stackoverflow.com",
  },
];

const Header = () => {
  const headerRef = useRef(null);
  useEffect(
    ()=>{
      let scrollY = window.scrollY;
      const handleScroll=()=>{
        const currentPosY = window.scrollY;
        const headElement = headerRef.current;
        if(!headElement){
          return;
        }
        else if(scrollY >currentPosY){
          headElement.style.transform = "translateY(0px)";
        }
        else {
          headElement.style.transform = "translateY(-200px)";
        }
        scrollY=currentPosY;
      }
      window.addEventListener('scroll',handleScroll);
      return ()=> window.removeEventListener('scroll',handleScroll);
    }
  ,[])
  const handleClick = (anchor) => () => {
    const id = `${anchor}-section`;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      translateY={0}
      transitionProperty="transform"
      transitionDuration=".3s"
      transitionTimingFunction="ease-in-out"
      backgroundColor="#18181b"
      ref={headerRef}
    >
      <Box color="white" maxWidth="1280px" margin="0 auto">
        <HStack
          px={16}
          py={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <nav>
          <HStack spacing={6}>
            {/* Add social media links based on the `socials` data */}
            {socials.map((ele)=><a href={ele.url} key={ele.url} target="_blank"><FontAwesomeIcon icon={ele.icon} size="2x"></FontAwesomeIcon></a>)}
            </HStack>
          </nav>
          <nav>
            <HStack spacing={8}>
              {/* Add links to Projects and Contact me section */}
              <a href="#contack-me" onClick={handleClick('contactme')}>Contact Me</a>
              <a href ="#projects" onClick={handleClick("projects")}>Projects</a>
            </HStack>
          </nav>
        </HStack>
      </Box>
    </Box>
  );
};
export default Header;
