import { Flex } from "@chakra-ui/react";
import React from "react";
import AuthModal from "../../Modal/Auth/AuthModal";
import AuthButtons from "./AuthButtons";
import { User } from "firebase/auth";
import { auth } from "../../../firebase/clientApp";
import Icons from "./Icons";
import UserMenu from "./UserMenu";

import { FaRedditSquare } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import { IoSparkles } from "react-icons/io5";

type RightContentProps = {
  user?: User | null;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => (
  <>
    <AuthModal />
    <Flex justify="center" align="center">
      {user ? <Icons /> : <AuthButtons />}
      <UserMenu user={user} />
    </Flex>
  </>
);
export default RightContent;
