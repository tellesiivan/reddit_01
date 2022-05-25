import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Icon,
  Flex,
  Text,
  MenuDivider,
  Box,
} from "@chakra-ui/react";
import { FaRedditSquare } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";
import { IoSparkles } from "react-icons/io5";
import { MdOutlineLogin } from "react-icons/md";
import { signOut, User } from "firebase/auth";
import { auth } from "../../../firebase/clientApp";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";
import { communityState } from "../../../atoms/communitiesAtom";

type UserMenuProps = {
  user?: User | null;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const resetCommunityState = useResetRecoilState(communityState);
  const setModalState = useSetRecoilState(authModalState);

  const logOut = async () => {
    await signOut(auth);
    // clear community state
    resetCommunityState();
  };

  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        padding="0px 6px"
        borderRadius={4}
        _hover={{
          outline: "1px solid",
          outlineColor: "gray.200",
        }}
      >
        <Flex align="center">
          <Flex align="center">
            {user ? (
              <>
                <Icon
                  fontSize={24}
                  mr={1}
                  color="gray.300"
                  as={FaRedditSquare}
                />
                <Box
                  display={{ base: "none", lg: "flex" }}
                  flexDirection="column"
                  fontSize="8pt"
                  alignItems="flex-start"
                  mr={8}
                >
                  <Text fontWeight={700}>
                    {user?.displayName || user?.email?.split("@")[0]}
                  </Text>
                  <Flex alignItems="center">
                    <Icon as={IoSparkles} color="brand.100" mr={1} />
                    <Text color="gray.400">1 karma</Text>
                  </Flex>
                </Box>
              </>
            ) : (
              <Icon as={VscAccount} fontSize={24} color="gray.400" mr={1} />
            )}
          </Flex>
          <ChevronDownIcon color="gray.400" />
        </Flex>
      </MenuButton>
      <MenuList fontSize="10pt" fontWeight="700">
        {user ? (
          <>
            <MenuItem _hover={{ bg: "blue.500", color: "white" }}>
              <Flex align="center">
                <Icon as={CgProfile} fontSize={20} mr={2.5} />
                <Text>Profile</Text>
              </Flex>
            </MenuItem>
            <MenuDivider />
            <MenuItem
              _hover={{ bg: "blue.500", color: "white" }}
              onClick={logOut}
            >
              <Flex align="center">
                <Icon as={MdOutlineLogin} fontSize={20} mr={2.5} />
                <Text>Logout</Text>
              </Flex>
            </MenuItem>
          </>
        ) : (
          <MenuItem
            _hover={{ bg: "blue.500", color: "white" }}
            onClick={() =>
              setModalState({
                open: true,
                view: "login",
              })
            }
          >
            <Flex align="center">
              <Icon as={MdOutlineLogin} fontSize={20} mr={2.5} />
              <Text fontWeight="700">Login / Signup</Text>
            </Flex>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};
export default UserMenu;
