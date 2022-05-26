/* eslint-disable @next/next/no-img-element */
import { Button, Flex, Input, Image, Stack } from "@chakra-ui/react";
import React, { useRef } from "react";

type ImageUploadProps = {
  selectedFile?: string;
  setSelectedTab: (value: string) => void;
  onSelectImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedFile: (value: string) => void;
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  onSelectImage,
  setSelectedTab,
  selectedFile,
  setSelectedFile,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Flex justify="center" align="center" width="100%">
      <Flex
        p={10}
        border="1px dashed"
        width="100%"
        borderColor="gray.300"
        justify="center"
        align="center"
        direction="column"
      >
        {selectedFile ? (
          <>
            <Image
              src={selectedFile}
              alt=""
              borderRadius={4}
              maxWidth="400px"
              maxHeight="400px"
            />
            <Stack direction="row" marginTop={3}>
              <Button height="28px" onClick={() => setSelectedTab("Post")}>
                Back to post
              </Button>
              <Button
                variant="outline"
                height="28px"
                onClick={() => setSelectedFile("")}
              >
                Remove
              </Button>
            </Stack>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              height="28px"
              onClick={() => inputRef.current?.click()}
            >
              Upload
            </Button>
            <Input type="file" ref={inputRef} hidden onChange={onSelectImage} />
          </>
        )}
      </Flex>
    </Flex>
  );
};
export default ImageUpload;
