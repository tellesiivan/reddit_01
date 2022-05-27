import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { Community } from "../../atoms/communitiesAtom";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

type AboutProps = {
  community: Community;
};

const About: React.FC<AboutProps> = ({ community }) => {
  return (
    <Box position="sticky" top="14px">
      <Flex
        justify="space-between"
        align="center"
        bg="blue.400"
        p={3}
        color="white"
        borderRadius="4px 4px 0px 0px"
      >
        <Text fontSize="10pt" fontWeight="600">
          About Community
        </Text>
        <Icon as={HiOutlineDotsHorizontal} />
      </Flex>
      <Flex></Flex>
    </Box>
  );
};
export default About;
