import React, { FC, useState } from "react";
import { useFileOperations } from "../hooks/useFileOperations";

import "@styles/userFiles.css";
import { RenderFile } from ".";
import UploadImage from "./UploadImage";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useIntl } from "react-intl";
import { useGetClinicLimits } from "@/features/clinic-management";
import { GetFilesRes } from "@/shared";

interface FileListProps {
  patientId: number;
}

const UserFiles: FC<FileListProps> = ({ patientId }) => {
  const { formatMessage: f } = useIntl();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<number | null>(
    null,
  );
  const [fileToDelete, setFileToDelete] = useState<GetFilesRes | null>(null);
  const { data: limits } = useGetClinicLimits(patientId);

  const { patientFiles, deleteFileMutation, deleteFilesMutation } =
    useFileOperations(patientId);

  if (patientFiles.isLoading) return <div>{f({ id: "files.loading" })}</div>;

  if (patientFiles.isError)
    return (
      <div>
        {f({ id: "files.error" }, { message: patientFiles?.error?.message })}
      </div>
    );

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

  const handleDeleteFile = (file: GetFilesRes) => {
    setFileToDelete(file);
    setIsConfirmationOpen(file.id);
  };

  const handleDeleteFiles = () => {
    setIsConfirmationOpen(-1);
    setFileToDelete(null);
  };

  const confirmDeletion = () => {
    if (fileToDelete) {
      deleteFileMutation.mutate(fileToDelete.id, {
        onSuccess: () => {
          alert(f({ id: "files.delete.success" }));
          setIsConfirmationOpen(null);
        },
        onError: (error) => {
          alert(f({ id: "files.delete.error" }, { message: error.message }));
        },
      });
    } else {
      deleteFilesMutation.mutate(patientId, {
        onSuccess: () => {
          alert(f({ id: "files.delete.allSuccess" }));
          setIsConfirmationOpen(null);
        },
        onError: (error) => {
          alert(f({ id: "files.delete.error" }, { message: error.message }));
        },
      });
    }
  };

  const cancelDeletion = () => {
    setIsConfirmationOpen(null);
    setFileToDelete(null);
  };

  return (
    <div className="files-section">
      <div className="user-files-container">
        {groupedFiles &&
          Object.keys(groupedFiles).map((fileType) => (
            <div key={fileType} className="file-section">
              <h2 className="file-section-title">
                {fileType.replace("_", " ")}
              </h2>
              <div className="file-list">
                {groupedFiles[fileType]?.map((file: GetFilesRes) => (
                  <div key={file.id} className="file-item">
                    <RenderFile file={file} />
                    <button onClick={() => handleDeleteFile(file)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    {isConfirmationOpen === file.id && (
                      <div className="confirmation-modal">
                        <h2>{f({ id: "files.delete.confirm" })}</h2>
                        <div className="confirmation-actions">
                          <button onClick={confirmDeletion}>
                            {f({ id: "files.delete.yes" })}
                          </button>
                          <button onClick={cancelDeletion}>
                            {f({ id: "files.delete.cancel" })}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        {patientFiles.data.length > 0 && (
          <button onClick={handleDeleteFiles}>
            {f({ id: "files.delete.all" })}
          </button>
        )}
        {isConfirmationOpen === -1 && (
          <div className="confirmation-modal">
            <h2>{f({ id: "files.delete.confirmAll" })}</h2>
            <div className="confirmation-actions">
              <button onClick={confirmDeletion}>
                {f({ id: "files.delete.yes" })}
              </button>
              <button onClick={cancelDeletion}>
                {f({ id: "files.delete.cancel" })}
              </button>
            </div>
          </div>
        )}

        {limits?.allowFileUpload && <UploadImage patientId={patientId + ""} />}
      </div>
    </div>
  );
};

export default UserFiles;
