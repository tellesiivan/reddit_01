import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
  Icon,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { AiFillCloseCircle } from "react-icons/ai";
import TabItem from "./TabItem";
import TextInputs from "./PostForm/TextInputs";
import ImageUpload from "./PostForm/ImageUpload";
import { Post } from "../../atoms/postsAtom";
import { User } from "firebase/auth";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore, storage } from "../../firebase/clientApp";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

type NewPostsFormProps = {
  user: User;
};

const formTabs: TabItem[] = [
  { title: "Post", icon: IoDocumentText },
  { title: "Images & Video", icon: IoImageOutline },
  { title: "Link", icon: BsLink45Deg },
  { title: "Poll", icon: BiPoll },
  { title: "Talk", icon: BsMic },
];

export type TabItem = {
  title: string;
  icon: typeof Icon.arguments;
};

const NewPostForm: React.FC<NewPostsFormProps> = ({ user }) => {
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>("");

  const onSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e;

    const reader = new FileReader();

    if (files?.[0]) {
      reader.readAsDataURL(files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target.result as string);
      }
    };
  };

  const onTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;

    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreatePost = async () => {
    const { communityId } = router.query;
    setError(false); // reset error
    /// create new post object => type Post
    const newPost: Post = {
      communityId: communityId as string,
      creatorId: user.uid,
      creatorDisplayName: user.displayName || user.email!.split("@")[0],
      title: textInputs.title,
      body: textInputs.body,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
    };
    setLoading(true);
    try {
      // store the post in DB. // /firebase to generate a unique id.. therfore  we use addDoc
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
      // if there is an image selected,
      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        //  added to strorage then get DOWNLOAD URL to update the post in DB
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadedUrl = await getDownloadURL(imageRef);
        // update post doc with image URL
        await updateDoc(postDocRef, {
          imageURL: downloadedUrl,
        });
      }
      // redirect user to community page
      router.back();
    } catch (error: any) {
      setError(true);
      console.log("handleCreatePost", error.message);
    }
    setLoading(false);
  };

  return (
    <Flex direction="column" bg="white" borderRadius={4} overflow="hidden">
      <Flex width="100%">
        {formTabs.map((item) => (
          <TabItem
            key={item.title}
            item={item}
            setSelectedTab={setSelectedTab}
            selected={item.title === selectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Post" && (
          <TextInputs
            onChange={onTextChange}
            textInputs={textInputs}
            handleCreatePost={handleCreatePost}
            loading={loading}
          />
        )}
        {selectedTab === "Images & Video" && (
          <ImageUpload
            onSelectImage={onSelectImage}
            setSelectedTab={setSelectedTab}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
        )}
      </Flex>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle fontSize="10pt">Oops.. ran into an error</AlertTitle>
          <AlertDescription fontSize="9.4pt">
            Try uploading your post again!
          </AlertDescription>
        </Alert>
      )}
    </Flex>
  );
};
export default NewPostForm;
