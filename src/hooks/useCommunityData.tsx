import {
  collection,
  getDocs,
  writeBatch,
  doc,
  increment,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModalAtom";
import {
  communityState,
  Community,
  CommunitySnippet,
} from "../atoms/communitiesAtom";
import { auth, firestore } from "../firebase/clientApp";

const useCommunityData = () => {
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onJoinOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean
  ) => {
    // if no usere... open login modal
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    //  is the user signed in

    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }
    joinCommunity(communityData);
  };

  const getMySnippets = async () => {
    setLoading(true);

    try {
      // get snippets || path to that specific collection
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );
      const snippets = snippetDocs.docs.map((doc) => ({
        ...doc.data(),
      }));
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
      }));
    } catch (error: any) {
      console.log("getMySnippets", error);
      setError(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    getMySnippets();
  }, [user]);

  const joinCommunity = async (communityData: Community) => {
    const snippetRef = doc(
      firestore,
      `users/${user?.uid}/communitySnippets/${communityData.id}`
    );
    const communityRef = doc(firestore, `communities/${communityData.id}`);

    const newSnippet: CommunitySnippet = {
      communityId: communityData.id,
      imageURL: communityData.imageURL || "",
    };
    setLoading(true);
    try {
      // batch write
      const batch = writeBatch(firestore);
      // creating a new community snippet
      batch.set(snippetRef, newSnippet);
      /// updating number of members in this community (+1)
      batch.update(communityRef, {
        numberOfMembers: increment(1),
      });
      await batch.commit();
      // update recoil state - communityState.mySnippets
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));
    } catch (error: any) {
      console.log("joinCommunity", error);
      setError(error.message);
    }
    setLoading(false);
  };

  const leaveCommunity = async (communityId: string) => {
    const snippetRef = doc(
      firestore,
      `users/${user?.uid}/communitySnippets/${communityId}`
    );
    const communityRef = doc(firestore, `communities/${communityId}`);
    setLoading(true);
    try {
      // batch write
      const batch = writeBatch(firestore);
      // DELETE community snippet
      batch.delete(snippetRef);
      /// updating number of members in this community (-1)
      batch.update(communityRef, {
        numberOfMembers: increment(-1),
      });
      await batch.commit();
      // update recoil state - communityState.mySnippets
      setCommunityStateValue((prev) => ({
        ...prev,
        // return all elements that do not equal communityId
        mySnippets: prev.mySnippets.filter(
          (snippet) => snippet.communityId !== communityId
        ),
      }));
    } catch (error: any) {
      console.log("leaveCommunity", error);
      setError(error.message);
    }
    setLoading(false);
  };

  return {
    communityStateValue,
    onJoinOrLeaveCommunity,
    loading,
  };
};
export default useCommunityData;
