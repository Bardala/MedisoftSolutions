import { GetFilesRes } from "@/shared";
import { convertFilePath } from "@/utils";
import { FC } from "react";

const RenderFile: FC<{ file: GetFilesRes }> = ({ file }) => {
  const fileExtension = file.filePath.split(".").pop()?.toLowerCase();

  if (
    fileExtension === "png" ||
    fileExtension === "jpg" ||
    fileExtension === "jpeg"
  ) {
    return (
      <img
        src={convertFilePath(file.filePath)}
        alt={file.description}
        className="file-image"
      />
    );
  } else if (fileExtension === "pdf") {
    return (
      <embed
        src={convertFilePath(file.filePath)}
        type="application/pdf"
        // width="600"
        // height="400"
      />
    );
  } else {
    return (
      <a
        href={convertFilePath(file.filePath)}
        target="_blank"
        rel="noopener noreferrer"
        className="file-link"
      >
        {file.description}
      </a>
    );
  }
};

export default RenderFile;
