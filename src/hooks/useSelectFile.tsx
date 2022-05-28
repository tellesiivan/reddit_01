import React, { useState } from "react";

const useSelectFile = () => {
  const [selectedFile, setSelectedFile] = useState<string>("");

  const onSelectedFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e;

    const reader = new FileReader();

    if (files?.[0]) {
      reader.readAsDataURL(files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target.result as string);
      }
    };
  };

  return { selectedFile, setSelectedFile, onSelectedFile };
};
export default useSelectFile;
