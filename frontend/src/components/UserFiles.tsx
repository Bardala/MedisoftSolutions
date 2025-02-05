import React, { FC, useState } from "react";
import { useFileOperations } from "../hooks/useFileOperations";
import { GetFilesRes } from "../types";
import "../styles/userFiles.css";
import { RenderFile } from "./RenderFile";
import UploadImage from "./UploadImage";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface FileListProps {
  patientId: number;
}

const UserFiles: FC<FileListProps> = ({ patientId }) => {
  // const [showFiles, setShowFiles] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<number | null>(
    null,
  );
  const [fileToDelete, setFileToDelete] = useState<GetFilesRes | null>(null);

  const { patientFiles, deleteFileMutation, deleteFilesMutation } =
    useFileOperations(patientId);

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

  // Handle the delete file action with confirmation
  const handleDeleteFile = (file: GetFilesRes) => {
    setFileToDelete(file);
    setIsConfirmationOpen(file.id);
  };

  const handleDeleteFiles = () => {
    setIsConfirmationOpen(-1); // Use -1 to indicate delete all files
    setFileToDelete(null); // Null indicates we're deleting multiple files
  };

  const confirmDeletion = () => {
    if (fileToDelete) {
      // Delete a single file
      deleteFileMutation.mutate(fileToDelete.id, {
        onSuccess: () => {
          alert("File deleted successfully");
          setIsConfirmationOpen(null);
        },
        onError: (error) => {
          alert(`Error: ${error.message}`);
        },
      });
    } else {
      // Delete multiple files
      deleteFilesMutation.mutate(patientId, {
        onSuccess: () => {
          alert("All files deleted successfully");
          setIsConfirmationOpen(null);
        },
        onError: (error) => {
          alert(`Error: ${error.message}`);
        },
      });
    }
  };

  const cancelDeletion = () => {
    setIsConfirmationOpen(null);
    setFileToDelete(null);
  };

  return (
    <>
      <div className="files-section">
        {/* <button
          className="toggle-button"
          onClick={() => setShowFiles(!showFiles)}
        >
          {showFiles ? "Hide Files Section" : "Show Files Section"}
        </button> */}

        {/* {showFiles && ( */}
        <div className="user-files-container">
          {groupedFiles &&
            Object.keys(groupedFiles).map((fileType) => (
              <div key={fileType} className="file-section">
                <h2 className="file-section-title">
                  {fileType.replace("_", " ")}
                </h2>
                <div className="file-list">
                  {groupedFiles[fileType]?.length > 0 &&
                    groupedFiles[fileType].map((file: GetFilesRes) => (
                      <div key={file.id} className="file-item">
                        <h3 className="file-description">{file.description}</h3>
                        <RenderFile file={file} />
                        <button onClick={() => handleDeleteFile(file)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                        {isConfirmationOpen === file.id && (
                          <div className="confirmation-modal">
                            <h2>Are you sure you want to delete this file?</h2>
                            <div className="confirmation-actions">
                              <button onClick={confirmDeletion}>
                                Yes, Delete
                              </button>
                              <button onClick={cancelDeletion}>Cancel</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          {patientFiles.data.length > 0 && (
            <button onClick={handleDeleteFiles}>Delete All Files</button>
          )}
          {isConfirmationOpen === -1 && (
            <div className="confirmation-modal">
              <h2>Are you sure you want to delete these files?</h2>
              <div className="confirmation-actions">
                <button onClick={confirmDeletion}>Yes, Delete</button>
                <button onClick={cancelDeletion}>Cancel</button>
              </div>
            </div>
          )}
          <UploadImage patientId={patientId + ""} />
        </div>
        {/* )} */}
      </div>
    </>
  );
};

export default UserFiles;
