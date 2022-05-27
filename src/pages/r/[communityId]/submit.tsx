import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import { communityState } from "../../../atoms/communitiesAtom";
import PageContent from "../../../components/PageContent";
import NewPostForm from "../../../components/Posts/NewPostForm";
import { auth } from "../../../firebase/clientApp";

type submitProps = {};

const SubmitPostPage: React.FC<submitProps> = () => {
  const communityStateValue = useRecoilState(communityState);
  const [user] = useAuthState(auth);

  console.log(communityStateValue);

  return (
    <PageContent>
      <>
        <Box
          p="14px 0px"
          borderBottom="1px solid"
          borderColor="white"
          marginBottom={3}
        >
          <Text fontWeight="700">Create Post</Text>
        </Box>
        {user && <NewPostForm user={user} />}
      </>
      <></>
    </PageContent>
  );
};
export default SubmitPostPage;
