import { Button, Flex, Text } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";

const OAuthButtons: React.FC = () => {
  return (
    <Flex experimental_spaceY={2} flexDirection="column" mb={4} width="100%">
      <Button experimental_spaceX={2} variant="oauth" py={5}>
        <FcGoogle size="1.3em" />
        <Text ml={2}>Continue with Google</Text>
      </Button>
      <Button variant="oauth" py={5}>
        Some Other Provider
      </Button>
    </Flex>
  );
};
export default OAuthButtons;
