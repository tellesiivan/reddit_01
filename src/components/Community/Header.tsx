import { Flex, Box, Icon,Image,Text,Button } from "@chakra-ui/react";
import { Community } from "../../atoms/communitiesAtom";
import {FaReddit} from 'react-icons/fa'

type HeaderProps = {
  community: Community;
};

const Header: React.FC<HeaderProps> = ({ community }) => {

  const isJoined = false; // read fro our communitySnippets

  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" bg="blue.500" />
      <Flex justify="center" bg="white" flexGrow={1}>
        <Flex width="95%" maxWidth="860px">
          {community?.imageURL ? <Image /> : (
            <Icon as={FaReddit} fontSize={64} position="relative" top={-3} border="4px solid white" color="blue.500" borderRadius="50%"/>

          )}
          <Flex padding="10px 16px">
              <Flex direction="column" mr={6} >
                <Text fontWeight="700" fontSize="16pt">{community.id}</Text>
                <Text fontWeight="700" fontSize="10pt" color="gray.400">r/{community.id}</Text>

              </Flex>
               <Button variant={isJoined ? 'outline' : 'solid'} height="30px" pr={6} pl={6} onClick={() => {}}>{isJoined ? "Joined" : "Join"}</Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default Header;
