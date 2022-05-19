/* eslint-disable react/no-children-prop */
import { SearchIcon } from "@chakra-ui/icons";
import { Flex, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import React from "react";

type SearchInputProps = {
  //   user: "";
};

const SearchInput: React.FC<SearchInputProps> = () => {
  return (
    <Flex flexGrow={1} mx={2} align="center">
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray.300" mb={2.5} />}
        />
        <Input
          type="text"
          placeholder="Search Reddit"
          fontSize="10pt"
          _placeholder={{ color: "gray.500" }}
          _hover={{
            bg: "white",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          _focus={{
            outline: "none",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          height="30px"
          bg="gray.50"
        />
      </InputGroup>
    </Flex>
  );
};
export default SearchInput;
