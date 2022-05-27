import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { firestore } from "../../../firebase/clientApp";
import { Community } from "../../../atoms/communitiesAtom";
import safejsonStringfy from "safe-json-stringify";
import NoCommunity from "../../../components/Community/NoCommunity";
import Header from "../../../components/Community/Header";
import PageContent from "../../../components/PageContent";
import CreatePostLink from "../../../components/Community/CreatePostLink";
import Posts from "../../../components/Posts/Posts";

type CommunityPageProps = {
  community: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ community }) => {
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
        <>RHS</>
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
