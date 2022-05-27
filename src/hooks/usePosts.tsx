import React from "react";
import { useRecoilState } from "recoil";
import { postState } from "../atoms/postsAtom";

const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);

  const onVote = async () => {};
  const onSelect = () => {};
  const onDelete = async () => {};

  return {
    postStateValue,
    setPostStateValue,
  };
};
export default usePosts;
