import { Button, Flex, Text } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/clientApp";

const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  return (
    <Flex experimental_spaceY={2} flexDirection="column" mb={4} width="100%">
      <Button
        experimental_spaceX={2}
        variant="oauth"
        py={5}
        isLoading={loading}
        onClick={() => signInWithGoogle()}
      >
        <FcGoogle size="1.3em" />
        <Text ml={2}>Continue with Google</Text>
      </Button>
      <Button variant="oauth" py={5}>
        Some Other Provider
      </Button>
      {error && <Text>{error?.message}</Text>}
    </Flex>
  );
};
export default OAuthButtons;
