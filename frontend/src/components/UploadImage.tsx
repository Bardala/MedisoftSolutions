import React, { useState, useRef, useMemo } from "react";
import "../styles/patientFiles.css";
import { useIntl } from "react-intl";
import { useFileOperations } from "../hooks/useFileOperations";

interface UploadImageProps {
  patientId: string;
  existingImageUrls?: string[];
  maxFiles?: number;
  maxTotalSizeMB?: number;
  maxFileSizeMB?: number;
}

const UploadImage: React.FC<UploadImageProps> = ({
  patientId,
  existingImageUrls = [],
  maxFiles = 5,
  maxTotalSizeMB = 10,
  maxFileSizeMB = 5,
}) => {
  const { formatMessage: f } = useIntl();
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>(existingImageUrls);
  const [fileType, setFileType] = useState<string>("old_log");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { uploadFileMutation } = useFileOperations(parseInt(patientId));

  // Calculate total size and files count
  const { totalSizeMB, filesCount } = useMemo(
    () => ({
      totalSizeMB: files.reduce(
        (sum, file) => sum + file.size / (1024 * 1024),
        0,
      ),
      filesCount: files.length,
    }),
    [files],
  );

  const sanitizeFileName = (fileName: string) => {
    return fileName.replace(/\s+/g, "_").replace(/[^\w.-]/g, "");
  };

  const validateFiles = (newFiles: File[]) => {
    // Check individual file sizes first
    const oversizedFiles = newFiles.filter(
      (file) => file.size > maxFileSizeMB * 1024 * 1024,
    );

    if (oversizedFiles.length > 0) {
      throw new Error(
        f(
          { id: "fileTooLarge" },
          {
            max: maxFileSizeMB,
            file: oversizedFiles[0].name,
          },
        ),
      );
    }

    // Then check total quantity and size
    const newTotalSize =
      totalSizeMB +
      newFiles.reduce((sum, file) => sum + file.size / (1024 * 1024), 0);
    const newFilesCount = filesCount + newFiles.length;

    if (newFilesCount > maxFiles) {
      throw new Error(f({ id: "maxFilesExceeded" }, { max: maxFiles }));
    }

    if (newTotalSize > maxTotalSizeMB) {
      throw new Error(f({ id: "maxSizeExceeded" }, { max: maxTotalSizeMB }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const selectedFiles = Array.from(event.target.files || []);
      validateFiles(selectedFiles);

      const newPreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file),
      );
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
      setFilePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
      setError(null);
    } catch (err) {
      setError(err.message);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUploadFiles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      for (const file of files) {
        const fileExtension = file.name.split(".").pop();
        const sanitizedFileName =
          sanitizeFileName(file.name.substring(0, file.name.lastIndexOf("."))) +
          `.${fileExtension}`;

        const sanitizedFile = new File([file], sanitizedFileName, {
          type: file.type,
        });

        await uploadFileMutation.mutateAsync({
          patientId,
          fileType,
          description: "N/A",
          file: sanitizedFile,
        });
      }

      alert(f({ id: "success" }));
      cancelFiles();
    } catch (err) {
      setError(f({ id: "uploadError" }));
    } finally {
      setIsLoading(false);
    }
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
      alert(f({ id: "selectAtLeastOne" }));
      return;
    }

    handleUploadFiles();
  };

  return (
    <div className="upload-image-container">
      <h2>{f({ id: "uploadFiles" })}</h2>

      <div className="upload-limits">
        {f(
          { id: "filesLimit" },
          {
            count: filesCount,
            max: maxFiles,
            size: totalSizeMB.toFixed(2),
            maxSize: maxTotalSizeMB,
          },
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

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
            {f({ id: "selectOrDrag" })}
          </label>
        </div>

        {/* Progress bar */}
        {files.length > 0 && (
          <div className="upload-progress">
            <progress value={totalSizeMB} max={maxTotalSizeMB} />
            <span>
              {totalSizeMB.toFixed(2)}MB / {maxTotalSizeMB}MB
            </span>
          </div>
        )}

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
                  {f({ id: "remove" })}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="file-type-select">
          <label htmlFor="fileType">{f({ id: "fileType" })}:</label>
          <select
            id="fileType"
            value={fileType}
            onChange={handleFileTypeChange}
          >
            <option value="old_log">{f({ id: "oldLog" })}</option>
            <option value="x_ray">{f({ id: "xRay" })}</option>
            <option value="medical_test">{f({ id: "medicalTest" })}</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={cancelFiles}
            disabled={isLoading}
          >
            {f({ id: "cancel" })}
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading || files.length === 0}
          >
            {isLoading ? f({ id: "uploading" }) : f({ id: "upload" })}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadImage;
