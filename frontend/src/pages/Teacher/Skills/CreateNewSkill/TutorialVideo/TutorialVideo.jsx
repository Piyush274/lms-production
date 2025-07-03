import { Button } from "@/components";
import FileProgressContainer from "@/components/layouts/FileProgressContainer";
import {
	handelUpdateSkill,
	showSuccess,
	throwError,
} from "@/store/globalSlice";
import { icons } from "@/utils/constants";
import moment from "moment";
import { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useDispatch } from "react-redux";
import "./TutorialVideo.scss";

const fileTypes = ["JPG", "PNG", "GIF", "MP4"];

const TutorialVideo = ({
  setDeleteTutorVideoId,
  skillEdit,
  setDeleteTutorVideo,
  setChangeTutorTitle,
  setCreateTutor,
  setIsShowPreview,
  setPreviewUrl,
  setChangeTitleTutor,
  featchSkillEditVal,
}) => {
  const [file, setFile] = useState(null);
  const [progressWidth, setProgressWidth] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileError, setFileError] = useState("");

  const dispatch = useDispatch();

  const handleChange = async (file) => {

    if (!skillEdit?._id) {
      dispatch(
        throwError( "Please add skill details before proceeding")
      );
    } else {
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
        skillId: skillEdit?._id,
        tutorialTitle: file?.[0]?.name,
        tutorialVideos: file?.[0],
      };

      const formData = new FormData();

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
        setUploadProgress(0);
      } else {
        isUploadComplete = true;
        clearInterval(progressInterval);
        setUploadProgress(0);
      }
    }
  };

  const dataList = [
    {
      name: "Manual.mp4",
      date: "08/09/24",
      time: "9:02 AM",
    },
    {
      name: "Manual.mp4",
      date: "08/09/24",
      time: "9:02 AM",
    },
  ];

    useEffect(() => {
      setTimeout(() => {
        setFileError("");
      }, 5000);
    }, [fileError]);
  return (
    <div id="tutorialvideo-container">
      <div className="cardBlock d-flex flex-column">
        <div className="fb-center flex-nowrap gap-3 mb-20">
          <div className="text-20-400 color-1a1a font-gilroy-sb">
            Tutorial Videos
          </div>
          <div>
            <Button
              onClick={() => {
                setCreateTutor(true);
              }}
              btnText="Record Video"
              className="h-37 text-17-400 font-gilroy-m"
              rightIcon={icons.wMic}
              disabled={!skillEdit?._id}
            />
          </div>
        </div>
        <div className="fa-center gap-2 flex-nowrap infoBlock text-16-400 mb-30">
          <div className="w-18 h-18 f-center">
            <img src={icons.bInfo} alt="" className="fit-image" />
          </div>
          <div>
            All students can see these videos. To leave a video for a specific
            student, please use a Personal Tutorial instead.
          </div>
        </div>
        <div className="flex-grow-1 mb-26">
          <FileUploader
            multiple={true}
            handleChange={handleChange}
            name="file"
            types={fileTypes}
          >
            <div className="f-center text-15-400 color-9F9F">
              Drag and drop a file here or click to upload
            </div>
          </FileUploader>
          {fileError && <div className="input-error mb-15 pt-12">{fileError}</div>}

        </div>
        <div className="listBlock brave-scroll">
          {skillEdit?.tutorialVideos?.map((item, index) => (
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
                        setPreviewUrl(item?.url);
                        setIsShowPreview(true);
                      }}
                    />
                  </div>
                  <div
                    className="w-28 h-28 f-center pointer"
                    onClick={() => {
                      setChangeTitleTutor(item);
                      setChangeTutorTitle(true);
                    }}
                  >
                    <img src={icons.editImg} alt="" className="fit-image" />
                  </div>
                  <div
                    className="w-28 h-28 f-center pointer"
                    onClick={() => {
                      setDeleteTutorVideoId(item?._id);
                      setDeleteTutorVideo(true);
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

        <FileProgressContainer uploadProgress={uploadProgress} />
      </div>
    </div>
  );
};

export default TutorialVideo;
