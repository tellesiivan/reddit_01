import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Image,
  Input,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { Community, communityState } from "../../atoms/communitiesAtom";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore, storage } from "../../firebase/clientApp";
import useSelectFile from "../../hooks/useSelectFile";
import { FaReddit } from "react-icons/fa";
import { useRecoilState, useSetRecoilState } from "recoil";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

type AboutProps = {
  community: Community;
};

const About: React.FC<AboutProps> = ({ community }) => {
  const selectedFileRef = useRef<HTMLInputElement>(null);
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const [user] = useAuthState(auth);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { selectedFile, setSelectedFile, onSelectedFile } = useSelectFile();

  const onUpdateImage = async () => {
    const storageImageRef = ref(storage, `communities/${community.id}/image`);
    const dbCommunityRef = doc(firestore, `communities/${community.id}`);

    setUploadingImage(true);
    try {
      await uploadString(storageImageRef, selectedFile, "data_url");
      const downloadedUrl = await getDownloadURL(storageImageRef);

      await updateDoc(dbCommunityRef, {
        imageURL: downloadedUrl,
      });

      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          ...prev.currentCommunity,
          imageURL: downloadedUrl,
        } as Community,
      }));
    } catch (error: any) {
      console.log("onUpdateImage", error.message);
    }

    setUploadingImage(false);
  };

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
      <Flex direction="column" p={3} bg="white" borderRadius="0px 0px 4px 4px">
        <Stack>
          <Flex width="100%" p={2} fontSize="10pt" fontWeight="600">
            <Flex direction="column" flexGrow={1}>
              <Text>{community.numberOfMembers.toLocaleString()}</Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction="column" flexGrow={1}>
              <Text>1</Text>
              <Text>Online</Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex
            align="center"
            width="100%"
            p={1}
            fontWeight={500}
            fontSize="10pt"
          >
            <Icon as={RiCakeLine} fontSize={16} mr={2} />
            {community.createdAt && (
              <Text fontSize="10pt">
                Created{" "}
                {moment(new Date(community.createdAt.seconds * 1000)).format(
                  "MMM DD, YYYY"
                )}
              </Text>
            )}
          </Flex>
          {user && (
            <Link href={`/r/${community.id}/submit`}>
              <Button mt={3} height="30px">
                Create Post
              </Button>
            </Link>
          )}
          {community.creatorId === user?.uid && (
            <>
              <Divider />
              <Stack spacing={1} fontSize="10pt">
                <Text fontWeight="600">Admin</Text>
                <Flex
                  align="center"
                  justify="space-between"
                  marginBottom="10px"
                >
                  <Text
                    color="blue.500"
                    cursor="pointer"
                    onClick={() => selectedFileRef.current?.click()}
                    _hover={{ textDecoration: "underline" }}
                  >
                    Change Image
                  </Text>
                  {community.imageURL || selectedFile ? (
                    <Image
                      src={
                        communityStateValue.currentCommunity?.imageURL ||
                        selectedFile ||
                        community.imageURL
                      }
                      borderRadius="full"
                      boxSize="45px"
                      alt="community image"
                    />
                  ) : (
                    <Icon
                      as={FaReddit}
                      fontSize={50}
                      border="4px solid white"
                      color="blue.500"
                      borderRadius="50%"
                    />
                  )}
                </Flex>
                {selectedFile &&
                  (uploadingImage ? (
                    <Spinner />
                  ) : (
                    <Button
                      height="30px"
                      cursor="pointer"
                      onClick={onUpdateImage}
                    >
                      Save Changes
                    </Button>
                  ))}
                <Input
                  type="file"
                  ref={selectedFileRef}
                  hidden
                  onChange={onSelectedFile}
                />
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};
export default About;
