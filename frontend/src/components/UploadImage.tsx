import React, { useState, useRef } from "react";
import { UploadFileReq, UploadFileRes } from "../types";
import "../styles/patientFiles.css";
import { useMutation } from "@tanstack/react-query";
import { ApiError } from "../fetch/ApiError";
import { UploadFileApi } from "../fetch/api";

interface UploadImageProps {
  patientId: string;
  existingImageUrls?: string[];
}

const UploadImage: React.FC<UploadImageProps> = ({
  patientId,
  existingImageUrls = [],
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>(existingImageUrls);
  const [fileType, setFileType] = useState<string>("old_log");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const uploadFileMutation = useMutation<
    UploadFileRes,
    ApiError,
    UploadFileReq
  >(async (req) => UploadFileApi(req), {
    onSuccess: () => console.log("success uploading"), // todo: add a success message after every upload
    onError: () => {
      alert("Failed to upload file. Please try again.");
    },
  });

  const handleUploadFiles = async () => {
    setIsLoading(true);
    for (const file of files) {
      await uploadFileMutation.mutateAsync({
        patientId,
        fileType,
        description: "N/A",
        file,
      });
      setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
      setFilePreviews((prevPreviews) =>
        prevPreviews.filter((preview) => preview !== URL.createObjectURL(file)),
      );
    }
    alert("All files uploaded successfully!");
    setIsLoading(false);
    setFiles([]);
    setFilePreviews([]);
  };

  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));

    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    setFilePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  // Handle file type change
  const handleFileTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setFileType(event.target.value);
  };

  // Cancel selected files
  const cancelFiles = () => {
    setFiles([]);
    setFilePreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (files.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    handleUploadFiles();
  };

  return (
    <div className="upload-image-container">
      <h2>Upload Files</h2>
      <form onSubmit={handleSubmit}>
        <div
          className="upload-dropzone"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const droppedFiles = Array.from(event.dataTransfer.files);
            const newPreviews = droppedFiles.map((file) =>
              URL.createObjectURL(file),
            );
            setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
            setFilePreviews((prevPreviews) => [
              ...prevPreviews,
              ...newPreviews,
            ]);
          }}
        >
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            className="file-input"
          />
          <label
            className="file-label"
            onClick={() => fileInputRef.current?.click()}
          >
            Select or Drag Files
          </label>
        </div>

        {filePreviews.length > 0 && (
          <div className="file-previews">
            {filePreviews.map((preview, index) => (
              <div key={index} className="file-preview-item">
                <img src={preview} alt="Preview" width="200" />
                <p>{files[index]?.name || `File ${index + 1}`}</p>
                <button
                  type="button"
                  onClick={() => {
                    setFiles((prevFiles) =>
                      prevFiles.filter((_, i) => i !== index),
                    );
                    setFilePreviews((prevPreviews) =>
                      prevPreviews.filter((_, i) => i !== index),
                    );
                  }}
                  className="remove-file-button"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="file-type-select">
          <label htmlFor="fileType">File Type:</label>
          <select
            id="fileType"
            value={fileType}
            onChange={handleFileTypeChange}
          >
            <option value="old_log">Old Log</option>
            <option value="x_ray">X-Ray</option>
            <option value="medical_test">Medical Test</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={cancelFiles}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Uploading..." : "Upload Files"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadImage;
