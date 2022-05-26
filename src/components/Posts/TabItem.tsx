import { Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { TabItem } from "./NewPostForm";

type TabItemProps = {
  item: TabItem;
  selected: boolean;
  setSelectedTab: (value: string) => void;
};

const TabItem: React.FC<TabItemProps> = ({
  item,
  selected,
  setSelectedTab,
}) => {
  return (
    <Flex
      justify="center"
      align="center"
      flexGrow={1}
      _hover={{
        bg: "gray.50",
      }}
      fontWeight="600"
      p="14px 0px"
      cursor="pointer"
      color={selected ? "blue.600" : "gray.500"}
      borderBottom="1px solid"
      borderRight="1px solid"
      borderRightColor="gray.100"
      borderBottomColor={selected ? "blue.600" : "gray.100"}
      onClick={() => setSelectedTab(item.title)}
    >
      <Flex align="center" height="20px" mr={2}>
        <Icon as={item.icon} />
      </Flex>
      <Text fontSize="9.5pt">{item.title}</Text>
    </Flex>
  );
};
export default TabItem;
