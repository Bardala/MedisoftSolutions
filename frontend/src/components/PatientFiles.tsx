import React, { useState, useRef } from "react";
import { UploadFileReq, UploadFileRes } from "../types";
import { ENDPOINT } from "../fetch/endpoints";
import { fetchFn } from "../fetch";
import "../styles/patientFiles.css";

interface UploadImageProps {
  patientId: string;
  existingImageUrls?: string[];
}

const _UploadImage: React.FC<UploadImageProps> = ({
  patientId,
  existingImageUrls = [],
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>(existingImageUrls);
  const [fileType, setFileType] = useState<string>("old_log");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (files.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("patientId", patientId);
    formData.append("fileType", fileType);
    formData.append("description", "N/A");

    files.forEach((file) => {
      formData.append("file", file);
    });

    try {
      await fetchFn<UploadFileReq, UploadFileRes>(
        ENDPOINT.UPLOAD_PATIENT_FILE,
        "POST",
        formData,
      );
      alert("Files uploaded successfully!");
      setFiles([]); // Clear selected files
      setFilePreviews([]); // Clear previews
      if (fileInputRef.current) fileInputRef.current.value = ""; // Clear input field
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload files. Please try again.");
    } finally {
      setIsUploading(false);
    }
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
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Files"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default _UploadImage;
