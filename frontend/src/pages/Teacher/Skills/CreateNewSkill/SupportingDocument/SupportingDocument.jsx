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
import "./SupportingDocument.scss";

const fileTypes = ["JPG", "PNG", "GIF", "MP4"];

const SupportingDocument = ({
  setTakePhoto,
  setDeletePhoto,
  setChangeTitle,
  skillEdit,
  featchSkillEditVal,
  setChangeSuppotingTitle,
  setDeleteDocument,
}) => {
  const dispatch = useDispatch();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileError, setFileError] = useState("");

  const handleChange = async (file) => {
    if (!skillEdit?._id) {
      dispatch(throwError("Please add skill details before proceeding"));
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
        supportingTitle: file?.[0]?.name,
        supportingDocuments: file?.[0],
      };

      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const res = await dispatch(handelUpdateSkill(formData));
      if (res?.status === 200) {
        isUploadComplete = true;
        setUploadProgress(100);
        dispatch(showSuccess("Skill details updated successfully."));
        setUploadProgress(0);
        featchSkillEditVal();
        clearInterval(progressInterval);
      } else {
        isUploadComplete = true;
        clearInterval(progressInterval);
        setUploadProgress(0);
      }
    }
  };

  //   const dataList = [
  //     {
  //       name: "Manual.mp4",
  //       date: "08/09/24",
  //       time: "9:02 AM",
  //     },
  //     {
  //       name: "Manual.mp4",
  //       date: "08/09/24",
  //       time: "9:02 AM",
  //     },
  //   ];

  useEffect(() => {
    setTimeout(() => {
      setFileError("");
    }, 5000);
  }, [fileError]);

  const handleClick = (url) => {
    window.open(url, "_blank");
  };
  return (
    <div id="supportingdocument-container">
      <div className="cardBlock d-flex flex-column">
        <div className="fb-center flex-nowrap gap-3 mb-20">
          <div className="text-20-400 color-1a1a font-gilroy-sb">
            Supporting documents
          </div>
          <div>
            <Button
              btnText="Take Photo"
              className="h-37 text-17-400 font-gilroy-m"
              rightIcon={icons.wCamera}
              disabled={!skillEdit?._id}
              onClick={() => {
                setTakePhoto(true);
              }}
            />
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
          {fileError && (
            <div className="input-error mb-15 pt-12">{fileError}</div>
          )}
        </div>
        <div className="listBlock brave-scroll">
          {skillEdit?.supportingDocuments?.map((item, index) => {
            const { createdAt, title, url, _id } = item;

            return (
              <div key={index}>
                <div className="fb-center mb-15">
                  <div className="d-flex flex-column gap-3">
                    <div className="fa-center gap-2">
                      <div className="w-24 h-24 f-center">
                        <img src={url} alt="" className="fit-image" />
                      </div>
                      <div className="text-16-400 color-1a1a font-gilroy-m">
                        {title}
                      </div>
                    </div>
                    <div className="text-14-400 color-aoao font-gilroy-m">
                      {moment(createdAt).format("MM/DD/YY")} -{" "}
                      {moment(createdAt).format("h:mm A")}
                    </div>
                  </div>
                  <div className="fa-center gap-3">
                    <div>
                      <Button
                        btnText="Open"
                        btnStyle="PDO"
                        className="h-35"
                        onClick={() => {
                          handleClick(url);
                        }}
                      />
                    </div>
                    <div
                      className="w-28 h-28 f-center pointer"
                      onClick={() => {
                        setChangeSuppotingTitle(item);
                        setChangeTitle(true);
                      }}
                    >
                      <img src={icons.editImg} alt="" className="fit-image" />
                    </div>
                    <div
                      className="w-28 h-28 f-center pointer"
                      onClick={() => {
                        setDeleteDocument(_id);
                        setDeletePhoto(true);
                      }}
                    >
                      <img src={icons.gdelete} alt="" className="fit-image" />
                    </div>
                  </div>
                </div>
                {/* {index !== dataList?.length - 1 && <hr />} */}
              </div>
            );
          })}
        </div>

        <FileProgressContainer uploadProgress={uploadProgress} />
      </div>
    </div>
  );
};

export default SupportingDocument;
