import { Flex } from "@chakra-ui/react";
import React from "react";

type PageContentProps = {
  children: any;
};

const PageContent: React.FC<PageContentProps> = ({ children }) => {
  return (
    <Flex justify="center" padding="16px 0px">
      <Flex justify="center" width="95%" maxWidth="860px">
        <Flex
          direction="column"
          width={{ base: "100%", md: "65%" }}
          mr={{ base: "0", md: 6 }}
        >
          {children[0 as keyof typeof children]}
        </Flex>
        <Flex
          width={{ base: "0%", md: "35%" }}
          display={{ base: "none", md: "flex" }}
          direction="column"
        >
          {children[1 as keyof typeof children]}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PageContent;
