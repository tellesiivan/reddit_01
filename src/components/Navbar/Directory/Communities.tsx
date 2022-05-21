import { Flex, Icon, MenuItem } from "@chakra-ui/react";
import React, { useState } from "react";
import CreateCommunityModal from "../../Modal/CreateCommunity/CreateCommunity";
import { GrAdd } from "react-icons/gr";

type CommunitiesProps = {};

const Communities: React.FC<CommunitiesProps> = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
      <MenuItem
        width="100%"
        _hover={{ bg: "blue.500", color: "white" }}
        onClick={() => setOpen(true)}
      >
        <Flex align="center" fontSize="10pt" fontWeight="700">
          <Icon as={GrAdd} mr={2.5} fontSize={20} />
          Create Community
        </Flex>
      </MenuItem>
    </>
  );
};
export default Communities;
