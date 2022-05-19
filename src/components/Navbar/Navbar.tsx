import { Flex, Image } from "@chakra-ui/react";
import React from "react";
import RightContent from "./RightContent/RightContent";
import SearchInput from "./SearchInput";

const Navbar: React.FC = () => {
  return (
    <Flex
      bg="white"
      height="46px"
      padding="6px 12px"
      marginBottom="4px"
      align="center"
    >
      <Image src="/images/logo.png" alt="logo" height="25px" />
      <SearchInput />
      {/* <Directory/>

     */}
      <RightContent />
    </Flex>
  );
};
export default Navbar;
