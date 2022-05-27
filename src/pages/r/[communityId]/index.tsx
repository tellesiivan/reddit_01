import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React, { useEffect } from "react";
import { firestore } from "../../../firebase/clientApp";
import { Community, communityState } from "../../../atoms/communitiesAtom";
import safejsonStringfy from "safe-json-stringify";
import NoCommunity from "../../../components/Community/NoCommunity";
import Header from "../../../components/Community/Header";
import PageContent from "../../../components/PageContent";
import CreatePostLink from "../../../components/Community/CreatePostLink";
import Posts from "../../../components/Posts/Posts";
import { useSetRecoilState } from "recoil";
import About from "../../../components/Community/About";

type CommunityPageProps = {
  community: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ community }) => {
  const setCurrentCommunity = useSetRecoilState(communityState);

  useEffect(() => {
    if (community) {
      setCurrentCommunity((prev) => ({
        ...prev,
        currentCommunity: community,
      }));
    }
  }, []);

  if (!community) return <NoCommunity />;

  return (
    <>
      <Header community={community} />
      <PageContent>
        {/* child 1 */}
        <>
          <CreatePostLink />
          <Posts communityData={community} />
        </>
        {/* child 2 */}
        <>
          <About community={community} />
        </>
      </PageContent>
    </>
  );
};
export default CommunityPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { communityId } = context.query;

  // get community data and pass to client
  try {
    const communityRef = doc(firestore, "communities", communityId as string);
    const communityDoc = await getDoc(communityRef);

    const communityData = {
      id: communityDoc.id,
      ...communityDoc.data(),
    };

    /// we need the doc id as well
    // { id: docSnap.id, ...docSnap.data() }

    return {
      props: {
        community: communityDoc.exists()
          ? JSON.parse(safejsonStringfy({ ...communityData }))
          : "",
      },
    };
  } catch (error) {
    console.log("getServerSideProps", error);
  }
}
