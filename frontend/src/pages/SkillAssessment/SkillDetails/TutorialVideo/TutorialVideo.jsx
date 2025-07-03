import { Button } from "@/components";
import FileProgressContainer from "@/components/layouts/FileProgressContainer";
import {
  handelUpdateSkill,
  handelUpdateStudentVideo,
  showSuccess,
  throwError,
} from "@/store/globalSlice";
import { icons } from "@/utils/constants";
import moment from "moment";
import { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useDispatch } from "react-redux";
import "./TutorialVideo.scss";

const fileTypes = ["JPEG", "PNG", "GIF", "MP4"];

const TutorialVideo = ({
  setDeleteId,
  setChanage,
  setPreview,
  setCreateTutor,
  featchDetails,
  getDetails,
  data,
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileError, setFileError] = useState("");

  const dispatch = useDispatch();

  const handleChange = async (file) => {
    if (getDetails?.status === "completed") {
      return dispatch(
        throwError(
          "The selected skill has already been completed. No further actions are required."
        )
      );
    }
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const selectedFile = file?.[0];
    if (selectedFile && selectedFile.size > MAX_FILE_SIZE) {
      return setFileError("The selected file exceeds the 10MB size limit.");
    }

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
    const payload = {
      assignSkillId: data?.id,
      studentResponseVideo: file?.[0],
      responseTitle: file?.[0].name,
    };
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const res = await dispatch(handelUpdateStudentVideo(formData));

    if (res?.status === 200) {
      isUploadComplete = true;
      dispatch(showSuccess("Skill details updated successfully."));
      setUploadProgress(100);
      featchDetails();
      clearInterval(progressInterval);
      setUploadProgress(0);
    } else {
      isUploadComplete = true;
      clearInterval(progressInterval);
      setUploadProgress(0);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setFileError("");
    }, 5000);
  }, [fileError]);

  return (
    <div id="tutorialvideo-container">
      <div className="cardBlock d-flex flex-column">
        <div className="fb-center flex-nowrap gap-3 mb-10">
          <div className="text-20-400 color-1a1a font-gilroy-sb">
            Student Response Videos
          </div>
        </div>

        <div className="text-16-400 color-5151 font-gilroy-m mb-10">
          Record a video for the instructor to grade or upload a file
        </div>
        <div className="file-div">
          <FileUploader
            multiple={true}
            handleChange={handleChange}
            name="file"
            types={fileTypes}
          >
            <div className="w-text text-15-400 color-9F9F">
              Drag and drop a file here or click to upload
            </div>
          </FileUploader>
        </div>
        {fileError && <div className="input-error mb-15 pt-0">{fileError}</div>}
        <div className="listBlock-b brave-scroll mb-10">
          {getDetails?.studentResponseVideo?.map((item, index) => (
            <div key={index}>
              <div className="fb-center">
                <div className="d-flex flex-column gap-3">
                  <div className="fa-center gap-2">
                    <div className="w-24 h-24 f-center">
                      <img
                        src={icons.dFileVideo}
                        alt=""
                        className="fit-image"
                      />
                    </div>
                    <div className="text-16-400 color-1a1a font-gilroy-m text-break">
                      {item.title}
                    </div>
                  </div>
                  <div className="text-14-400 color-aoao font-gilroy-m mb-5">
                    {moment(item?.time).format("MM/DD/YY")} -{" "}
                    {moment(item?.time).format("h:mm A")}
                  </div>
                </div>
                <div className="fa-center gap-3">
                  <div>
                    {" "}
                    <Button
                      btnText="Open"
                      btnStyle="PDO"
                      className="h-35"
                      onClick={() => {
                        setPreview({
                          videoUrl: item?.url,
                          isShowVideo: true,
                        });
                      }}
                    />
                  </div>
                  <div
                    className={`w-28 h-28 f-center  ${
                      getDetails?.status === "completed"
                        ? "disable-btn"
                        : "pointer"
                    } `}
                    onClick={(e) => {
                      if (getDetails?.status === "completed") {
                        e.preventDefault();
                        return;
                      }
                      setChanage({
                        title: item,
                        isShow: true,
                      });
                    }}
                  >
                    <img src={icons.editImg} alt="" className="fit-image" />
                  </div>
                  <div
                    className={`w-28 h-28 f-center  ${
                      getDetails?.status === "completed"
                        ? "disable-btn"
                        : "pointer"
                    } `}
                    onClick={(e) => {
                      if (getDetails?.status === "completed") {
                        e.preventDefault();
                        return;
                      }
                      setDeleteId({
                        id: item?._id,
                        isdelete: true,
                      });
                    }}
                  >
                    <img src={icons.gdelete} alt="" className="fit-image" />
                  </div>
                </div>
              </div>
              {/* {index !== dataList?.length - 1 && <hr />} */}
            </div>
          ))}
        </div>
        <div className="w-200">
          <Button
            onClick={() => {
              setCreateTutor(true);
            }}
            btnText="Record Video"
            className="h-37 text-17-400 font-gilroy-m"
            rightIcon={icons.wMic}
            disabled={getDetails?.status === "completed"}
          />
        </div>
        <FileProgressContainer uploadProgress={uploadProgress} />
      </div>
    </div>
  );
};

export default TutorialVideo;
