import { Flex, Image } from "@chakra-ui/react";
import React from "react";
import RightContent from "./RightContent/RightContent";
import SearchInput from "./SearchInput";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import IndexDirectory from "./Directory/Index";

const Navbar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);

  return (
    <Flex
      bg="white"
      height="46px"
      padding="6px 12px"

      align="center"
      justify={{ md: "space-between" }}
    >
      <Image
        src="/images/logo.png"
        alt="logo"
        height="25px"
        mr={{ base: 2, md: 4 }}
      />
      {user && <IndexDirectory />}

      <SearchInput user={user} />

      <RightContent user={user} />
    </Flex>
  );
};
export default Navbar;
