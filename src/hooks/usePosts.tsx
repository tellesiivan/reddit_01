import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModalAtom";
import { communityState } from "../atoms/communitiesAtom";
import { Post, postState, PostVote } from "../atoms/postsAtom";
import { auth, firestore, storage } from "../firebase/clientApp";

const usePosts = () => {
  const communityStateValue = useRecoilValue(communityState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const [user] = useAuthState(auth);

  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => {
    // check for user: if not, open auth modal

    event.stopPropagation();
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    const { voteStatus } = post;
    const existingVote = postStateValue.postVotes.find(
      (v) => v.postId === post.id
    );

    try {
      const batch = writeBatch(firestore);
      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      let updatedPostsVotes = [...postStateValue.postVotes];
      let voteChange = vote;

      // new vote
      if (!existingVote) {
        // create a new vote doc
        const postVoteRef = doc(
          collection(firestore, "users", `${user?.uid}/postVotes`)
        );

        const newVote: PostVote = {
          id: postVoteRef.id,
          communityId,
          postId: post.id!,
          voteValue: vote, // 1 or -1
        };

        batch.set(postVoteRef, newVote);

        // add/subtract 1 vote from voteStatus
        updatedPost.voteStatus = voteStatus + vote;
        updatedPostsVotes = [...updatedPostsVotes, newVote];
      }
      // EXISTING VOTE - they voted already
      else {
        const existingPostVoteRef = doc(
          firestore,
          "users",
          `${user?.uid}/postVotes/${existingVote.id}`
        );
        // removing vote => (up vote to neutral OR  down vote to nuetral)
        if (existingVote.voteValue === vote) {
          voteChange *= -1;
          // add/subtract 1 vote from voteStatus
          updatedPost.voteStatus = voteStatus - vote;
          updatedPostsVotes = updatedPostsVotes.filter(
            (vote) => vote.id !== existingVote.id
          );
          // deleting post doc
          batch.delete(existingPostVoteRef);
        }
        // flipping their vote => (up to down OR down to up)
        else {
          voteChange = 2 * vote;
          // add/subtract 2 vote from voteStatus
          updatedPost.voteStatus = voteStatus + 2 * vote;

          const voteIndx = postStateValue.postVotes.findIndex(
            (vote) => vote.id === existingVote.id
          );
          if (voteIndx !== -1) {
            updatedPostsVotes[voteIndx] = {
              ...existingVote,
              voteValue: vote,
            };
          }

          // updating existing postVote document
          batch.update(existingPostVoteRef, {
            voteValue: vote,
          });
        }
      }

      // update post doc
      const postRef = doc(firestore, `posts/${post.id}`);
      batch.update(postRef, { voteStatus: voteStatus + voteChange });

      await batch.commit();

      // update state with updated
      const postIndx = postStateValue.posts.findIndex(
        (item) => item.id === post.id
      );
      console.log(existingVote);
      updatedPosts[postIndx] = updatedPost;

      setPostStateValue((prev) => ({
        ...prev,
        posts: updatedPosts,
        postVote: updatedPostsVotes,
      }));
    } catch (error: any) {
      console.log(error.message, "onVote");
    }
  };

  const getCommunityPostVotes = async (communityId: string) => {
    const postVotesQuery = query(
      collection(firestore, `users/${user?.uid}/postVotes`),
      where("communityId", "==", communityId)
    );
    const postVoteDocs = await getDocs(postVotesQuery);
    const postVotes = postVoteDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPostStateValue((prev) => ({
      ...prev,
      postVotes: postVotes as PostVote[],
    }));

    // const unsubscribe = onSnapshot(postVotesQuery, (querySnapshot) => {
    //   const postVotes = querySnapshot.docs.map((postVote) => ({
    //     id: postVote.id,
    //     ...postVote.data(),
    //   }));

    // });

    // return () => unsubscribe();
  };

  useEffect(() => {
    if (!user?.uid || !communityStateValue.currentCommunity) return;
    getCommunityPostVotes(communityStateValue.currentCommunity.id);
  }, [user, communityStateValue.currentCommunity]);

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
