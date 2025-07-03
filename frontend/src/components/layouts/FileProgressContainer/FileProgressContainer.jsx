import React from "react";
import "./FileProgressContainer.scss";

const FileProgressContainer = ({uploadProgress=20}) => {
  return (
    <React.Fragment>
        <div className="fileProgressContainer">
          <div className="progressBar">
            <div
              className="progress"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
    </React.Fragment>
  );
};

export default FileProgressContainer;
