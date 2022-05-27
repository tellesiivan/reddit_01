import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React from "react";
import { useRecoilState } from "recoil";
import { Post, postState } from "../atoms/postsAtom";
import { firestore, storage } from "../firebase/clientApp";

const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);

  const onVote = async () => {};
  const onSelect = () => {};
  const onDelete = async (post: Post): Promise<boolean> => {
    try {
      // check if post has image
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        // Delete the file
        await deleteObject(imageRef);
      }
      // delete post from firebase
      await deleteDoc(doc(firestore, `posts/${post.id}`));
      // update post state
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id),
      }));

      return true;
    } catch (error: any) {
      console.log(error.message, "onDelete");
      return false;
    }
  };

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelect,
    onDelete,
  };
};
export default usePosts;
