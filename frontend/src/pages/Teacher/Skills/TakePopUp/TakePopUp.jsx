import { Button, Modal } from "@/components";
import FileProgressContainer from "@/components/layouts/FileProgressContainer";
import {
  handelUpdateSkill,
  showSuccess,
  throwError,
} from "@/store/globalSlice";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Webcam from "react-webcam";
import "./TakePopUp.scss";

const TakePopUp = ({ onHide, skillId, featchSkillEditVal }) => {
  const webcamRef = useRef(null);
  const [url, setUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const capturePhoto = React.useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setUrl(imageSrc);
    } else {
      dispatch(
        throwError(
          "Unable to access webcam. Please check permissions or device."
        )
      );
    }
  }, [webcamRef]);

  const onUserMedia = (e) => {};

  const videoConstraints = {
    facingMode: "environment",
  };

  const uploadFile = async () => {
    setIsLoading(true);
    let progressInterval;
    let isUploadComplete = false;

    const startProgress = () => {
      progressInterval = setInterval(() => {
        setUploadProgress((prevProgress) => {
          if (prevProgress >= 90 && !isUploadComplete) {
            return 90;
          }
          if (prevProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prevProgress + 10;
        });
      }, 200);
    };

    startProgress();
    const response = await fetch(url);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append("supportingDocuments", blob);
    const payload = {
      skillId: skillId,
      supportingTitle: "screenshot.jpg",
    };

    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const res = await dispatch(handelUpdateSkill(formData));
    if (res?.status === 200) {
      isUploadComplete = true;
      dispatch(showSuccess("Skill details updated successfully."));
      setUploadProgress(100);
      clearInterval(progressInterval);
      featchSkillEditVal();
      onHide();
    } else {
      isUploadComplete = true;
      clearInterval(progressInterval);
      setUploadProgress(0);

    }
    setIsLoading(false);
  };
  const onUserMediaError = (err) => {
    dispatch(
      throwError("Unable to access webcam. Please check permissions or device.")
    );
  };

  return (
    <Modal onHide={onHide} isClose={false} size="lg">
      <div className="take-container">
        <div className="row gy-3">
          <div className="col-lg-6">
            <h1 className="take-p">TAKE PHOTO</h1>
            <div className="min-w">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                width="100%"
                videoConstraints={videoConstraints}
                onUserMedia={onUserMedia}
                onUserMediaError={onUserMediaError}
              />
            </div>
            <div className="f-center">
              <Button
                onClick={capturePhoto}
                btnText="Take Photo"
                btnStyle="PDO"
              />
            </div>
          </div>
          <div className="col-lg-6">
            <h1 className="take-p">PHOTO PREVIEW</h1>

            <div className="min-w">
              {url && <img src={url} alt="Screenshot" className="img-div" />}
            </div>

            <div className="f-center mt-8">
              <Button
                onClick={uploadFile}
                btnText="Save Photo"
                btnStyle="PDO"
                loading={isLoading}
                disabled={isLoading || !url}
              />
            </div>
          </div>
        </div>

        <div className="mt-30 max-btn">
          <Button
            btnText="Cancel"
            btnStyle="PDO"
            className="h-43"
            onClick={onHide}
          />
        </div>

        <div className="mt-20">
          <FileProgressContainer uploadProgress={uploadProgress} />
        </div>
      </div>
    </Modal>
  );
};

export default TakePopUp;
