import React, { FC } from "react";
import { useGetFiles } from "../hooks/useGetFiles";
import { host } from "../utils";
import { GetFilesRes } from "../types";
import "../styles/userFiles.css";
import { RenderFile } from "./RenderFile";

interface FileListProps {
  patientId: number;
}
// export const convertFilePath = (filePath: string) => {
//   const correctedPath = filePath.replace("src/main/resources/static", "");
//   return `${host(correctedPath)}`;
// };

const UserFiles: FC<FileListProps> = ({ patientId }) => {
  const { patientFiles } = useGetFiles(patientId);

  if (patientFiles.isLoading) return <div>Loading...</div>;

  if (patientFiles.isError)
    return <div>Error: {patientFiles?.error?.message}</div>;

  // Group files by type
  const groupedFiles = patientFiles.data?.reduce(
    (acc: Record<string, GetFilesRes[]>, file: GetFilesRes) => {
      if (!acc[file.fileType]) {
        acc[file.fileType] = [];
      }
      acc[file.fileType].push(file);
      return acc;
    },
    {},
  );

  return (
    <div className="user-files-container">
      {groupedFiles &&
        Object.keys(groupedFiles).map((fileType) => (
          <div key={fileType} className="file-section">
            <h2 className="file-section-title">{fileType.replace("_", " ")}</h2>
            <div className="file-list">
              {groupedFiles[fileType]?.length > 0 &&
                groupedFiles[fileType].map((file: GetFilesRes) => (
                  <div key={file.id} className="file-item">
                    <h3 className="file-description">{file.description}</h3>
                    {/* {renderFile(file)} */}
                    <RenderFile file={file} />
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default UserFiles;

// export const renderFile = (file: GetFilesRes) => {
//   const fileExtension = file.filePath.split(".").pop()?.toLowerCase();

//   if (
//     fileExtension === "png" ||
//     fileExtension === "jpg" ||
//     fileExtension === "jpeg"
//   ) {
//     return (
//       <img
//         src={convertFilePath(file.filePath)}
//         alt={file.description}
//         className="file-image"
//       />
//     );
//   } else if (fileExtension === "pdf") {
//     return (
//       <embed
//         src={convertFilePath(file.filePath)}
//         type="application/pdf"
//         width="600"
//         height="400"
//       />
//     );
//   } else {
//     return (
//       <a
//         href={convertFilePath(file.filePath)}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="file-link"
//       >
//         {file.description}
//       </a>
//     );
//   }
// };
