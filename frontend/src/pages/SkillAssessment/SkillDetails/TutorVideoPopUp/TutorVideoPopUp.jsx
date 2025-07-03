import { Button, Modal } from "@/components";
import FileProgressContainer from "@/components/layouts/FileProgressContainer";
import {
  handelUpdateSkill,
  handelUpdateStudentVideo,
  showSuccess,
  throwError,
} from "@/store/globalSlice";
import { useEffect, useRef, useState } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import { useDispatch } from "react-redux";
import "./TutorVideoPopUp.scss";
const TutorVideoPopUp = ({ onHide, data ,featchDetails}) => {
  const [enable, setEnable] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setIlsLoading] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const previewRef = useRef();

  const errorMSG = {
    message: "Webcam not detected. Please make sure your webcam is connected",
  };

  const VideoPreview = ({ stream, status }) => {
    const videoRef = useRef(null);
    useEffect(() => {
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
      }
    }, [stream]);

    useEffect(() => {
      if (stream && status === "stopped") {
        stream.getTracks().forEach((track) => track.stop());
        stream.getTracks().forEach((track) => (track.enabled = false));
      }
    }, [status]);

    if (!stream) {
      return null;
    }

    return (
      <>
        <video
          ref={videoRef}
          width="100%"
          height="100%"
          autoPlay={true}
          controls
          playsInline
        />
      </>
    );
  };

  const uploadFile = async (mediaBlobUrl) => {
    setIlsLoading(true);
    if (!mediaBlobUrl) return;

    // Initialize progress width
    let progressInterval;
    let isUploadComplete = false;

    const startProgress = () => {
      progressInterval = setInterval(() => {
        setProgressWidth((prevProgress) => {
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
    const response = await fetch(mediaBlobUrl);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append("studentResponseVideo", blob, "recording.mp4");
    const payload = {
      assignSkillId: data?.id,
      responseTitle:'recording.mp4',
    };

    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const res = await dispatch(handelUpdateStudentVideo(formData));
    if (res?.status === 200) {
      isUploadComplete = true;
      dispatch(showSuccess("Skill details updated successfully."));
      setProgressWidth(100);
      featchDetails()
      clearInterval(progressInterval);
      onHide();
    } else {
      isUploadComplete = true;
      clearInterval(progressInterval);
      setProgressWidth(0);
    }

    setIlsLoading(false);
  };

  return (
    <Modal onHide={onHide} isClose={true} size="lg">
      <div className="tutor-video-container-t">
        <ReactMediaRecorder
          video
          blobPropertyBag={{
            type: "video/mp4",
          }}
          askPermissionOnMount={true}
          render={({
            previewStream,
            status,
            startRecording,
            stopRecording,
            mediaBlobUrl,
            error,
          }) => {
            return (
              <div>
                <p className="title-t">RECORD VIDEO</p>
                {status === "idle" && (
                  <video controls loop width="100%" height="100%" />
                )}

                {status !== "recording" && mediaBlobUrl && (
                  <video
                    src={mediaBlobUrl}
                    controls
                    autoPlay={false}
                    width="100%"
                    height="100%"
                  />
                )}

                {status === "recording" && (
                  <VideoPreview stream={previewStream} status="recording" />
                )}
                <div className="fb-center">
                <div className="d-flex gap-3 mt-10">
                  <Button
                    className="h-37"
                    btnText="Start Recording"
                    onClick={() => {
                      if (error) {
                        dispatch(throwError(errorMSG?.message));
                      } else {
                        startRecording();
                        setEnable(false);
                        if (previewRef.current) {
                          previewRef.current.play();
                        }
                      }
                    }}
                  />
                  <Button
                    className="h-37"
                    btnText="Stop"
                    onClick={() => {
                      if (status === "recording") {
                        stopRecording();
                        setIlsLoading(true);
                      }
                    }}
                  />
                  <Button
                    className="h-37"
                    btnText="Save"
                    disabled={!isLoading}
                    onClick={() => {
                      setEnable(true);
                      uploadFile(mediaBlobUrl);
                    }}
                  />
                  {/* <button
                    className={`f-btn ${
                      status === "recording" ? "active" : ""
                    }`}
                  >
                    RECORD
                  </button> */}
                  {/* <button
                    onClick={() => {
                      if (status === "recording") {
                        stopRecording();
                        setIlsLoading(true);
                      }
                    }}
                    className={` ${
                      status === "stopped" && !enable ? "active" : ""
                    }`}
                  >
                    STOP
                  </button> */}
                  {/* <button
                    disabled={!isLoading}
                    className={`l-btn ${
                      status === "stopped" && enable ? "active" : ""
                    }`}
                   
                  >
                    SAVE
                  </button> */}
                </div>
                <div className="c-btn mt-20">
                  <Button
                    btnText="CANCEL"
                    btnStyle="PDB"
                    className="h-37"
                    onClick={onHide}
                  />
                </div>
                </div>

                <FileProgressContainer uploadProgress={progressWidth} />
              </div>
            );
          }}
        />
      </div>
    </Modal>
  );
};

export default TutorVideoPopUp;
