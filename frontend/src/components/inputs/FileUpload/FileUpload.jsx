import { useDropzone } from "react-dropzone";
import "./FileUpload.scss";
import React, { useCallback } from "react";

const FileUpload = ({ setStoreFile }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      setStoreFile(acceptedFiles);
    },
    [setStoreFile]
  );
  const { getRootProps, getInputProps, acceptedFiles, isDragActive } =
    useDropzone({
      onDrop,
    });
  return (
    <React.Fragment>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-file">Drop the files here ...</p>
        ) : (
          <p className="text-file">
            Drag and drop a file here or click to upload
          </p>
        )}
      </div>
      <ul className="mt-10">
        {acceptedFiles.map((f) => (
          <li key={f.name}>{f.name}</li>
        ))}
      </ul>
    </React.Fragment>
  );
};

export default FileUpload;
