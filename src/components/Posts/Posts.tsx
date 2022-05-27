import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Community } from "../../atoms/communitiesAtom";
import { Post } from "../../atoms/postsAtom";
import { firestore } from "../../firebase/clientApp";
import usePosts from "../../hooks/usePosts";

type PostsProps = {
  communityData: Community;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  const [loading, setLoading] = useState(false);
  const { postStateValue, setPostStateValue } = usePosts();

  const getPosts = async () => {
    setLoading(true);
    try {
      const postQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData.id),
        orderBy("createdAt", "desc")
      );
      const postsDocs = await getDocs(postQuery);

      // store in out posts state
      const posts = postsDocs.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error: any) {
      console.log("getPosts", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return <div>Posts</div>;
};
export default Posts;
