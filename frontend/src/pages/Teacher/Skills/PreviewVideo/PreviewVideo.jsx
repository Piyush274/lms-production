import { Button, Modal } from "@/components";
import React from "react";
import "./PreviewVideo.scss";

const PreviewVideo = ({ onHide, previewUrl }) => {
  return (
    <Modal onHide={onHide} isClose={false}>
      {previewUrl && (
        <React.Fragment>
          <video
            src={previewUrl}
            width="100%"
            height="100%"
            autoPlay={false}
            controls
            playsInline
          />

          <div className="d-flex justify-content-end  mt-15">
            <Button
              btnText="Cancel"
              btnStyle="PDO"
              className="h-43"
              onClick={onHide}
            />
          </div>
        </React.Fragment>
      )}
    </Modal>
  );
};

export default PreviewVideo;
