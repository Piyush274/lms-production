import { icons } from "@/utils/constants";
import "./SkillDetails.scss";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import TutorialVideo from "./TutorialVideo";
import React, { useEffect, useState } from "react";
import TutorVideoPopUp from "./TutorVideoPopUp/TutorVideoPopUp";
import {
  getProfile,
  handelGetSkillDetails,
  handelGetStuentSkillDetails,
  handelUpdateAsssignSkill,
  handelUpdateSkillActionVC,
  handelUpdateStudentResponse,
} from "@/store/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button, DeleteConfirmation, Roundedloader } from "@/components";
import PreviewVideo from "./PreviewVideo";
import TakeTitlePopUp from "./TakeTitlePopUp";
import moment from "moment";
import { getDataFromLocalStorage } from "@/utils/helpers";
import uitoolkit from "@zoom/videosdk-ui-toolkit";
import "@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css";

const SkillDetails = ({ show }) => {
  const [createTutor, setCreateTutor] = useState(false);
  const [getDetails, setGetDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [skillLoading, setSkillLoading] = useState(false);
  const [preview, setPreview] = useState({
    videoUrl: null,
    isShowVideo: false,
    isExternal: false,
  });
  const [chanage, setChanage] = useState({
    title: "",
    isShow: false,
  });
  const [deleteId, setDeleteId] = useState({
    id: null,
    isdelete: false,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { state } = location;
  const reduxData = useSelector((state) => state.global);
  const { profileData } = reduxData || {};
  const isUserOnline = state.isOnline;

  const renderStars = (rating) => {
    const numericRating = parseFloat(rating);
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(numericRating);
    let stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} style={{ color: "#ffc107" }} />);
    }

    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key={`half-${fullStars}`} style={{ color: "#ffc107" }} />
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaStar key={`empty-${fullStars + i}`} style={{ color: "#D9D9D9" }} />
      );
    }

    return stars;
  };

  const featchDetails = async () => {
    if (!state?.id) return;
    setLoading(true);
    const payload = {
      id: state?.skillId,
      studentId: state?.studentId,
    };
    const res = await dispatch(handelGetStuentSkillDetails(payload));
    if (res?.status === 200) {
      setGetDetails(res?.data?.response);
    }
    setLoading(false);
  };

  useEffect(() => {
    featchDetails();
  }, []);

  const localData = getDataFromLocalStorage();
  const studentId = localData.userId;
  const teacherId = getDetails?.teacherId?._id;
  const assignedId = state.id;

  const handeldeleteTutorVideo = async () => {
    setDeleteLoading(true);
    const payload = {
      assignSkillId: state?.id,
      removeDocumentId: deleteId?.id,
    };

    const res = await dispatch(handelUpdateStudentResponse(payload));
    if (res?.status === 200) {
      featchDetails();
      setDeleteId({
        id: null,
        isdelete: false,
      });
    }
    setDeleteLoading(false);
  };

  const handelSumitSkill = async () => {
    if (!state?.id) return;
    setSkillLoading(true);
    const payload = {
      assignedId: state?.id,
      status: "submitted",
    };

    const res = await dispatch(handelUpdateAsssignSkill(payload));
    if (res?.status === 200) {
      featchDetails();
    }
    setSkillLoading(false);
  };

  const { lastName, firstName } = profileData || {};
  const userName = `${firstName} ${lastName}`;

  // Zoom Functionality
  const baseURL = import.meta.env.VITE_API_URL_ZOOM;
  const sessionKey = `session-${getDetails?.skillId?.title}-${teacherId}-${studentId}`;
  let sessionContainer = null;
  const authEndpoint = `${baseURL}/create-meet`;
  const config = {
    videoSDKJWT: "",
    sessionName: sessionKey,
    userName: JSON.stringify(userName),
    sessionPasscode: "123",
    features: [
      "video",
      "audio",
      "settings",
      "users",
      // "chat",
      "share",
      // "livestream",
      // "pstn",
      // "crc",
      // "ltt",
      // "recording",
    ],
    options: {
      init: {
        enforceMultipleVideos: true,
        enforceVirtualBackground: true,
      },
      audio: {},
      video: {},
      share: {
        optimizedForSharedVideo: true,
      },
    },
    virtualBackground: {
      allowVirtualBackground: true,
      allowVirtualBackgroundUpload: true,
      virtualBackgrounds: [
        "https://images.unsplash.com/photo-1715490187538-30a365fa05bd?q=80&w=1945&auto=format&fit=crop",
      ],
    },
  };

  function getVideoSDKJWT() {
    sessionContainer = document.getElementById("sessionContainer");
    document.getElementById("join-flow").style.display = "none";
    document.getElementById("zoomBlock").style.display = "none";
    fetch(authEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionName: config.sessionName,
        role: 1,
        userIdentity: userName,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.signature) {
          config.videoSDKJWT = data.signature;
          const payload = {
            assignedId: assignedId,
            meetId: sessionKey,
          };
          if (payload.assignedId) {
            await dispatch(handelUpdateSkillActionVC(payload));
          }
          joinSession();
        } else {
          console.error("Failed to get signature:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching JWT:", error);
      });
  }

  function joinSession() {
    if (sessionContainer) {
      uitoolkit.joinSession(sessionContainer, config);
      uitoolkit.onSessionClosed(sessionClosed);
      uitoolkit.on("video-active-change", (payload) => {
        if (payload.videoActive) {
          uitoolkit.subscribeVideo(payload.userId);
        } else {
          uitoolkit.unsubscribeVideo(payload.userId);
        }
      });
      uitoolkit.on("user-joined", (payload) => {
        uitoolkit.subscribeVideo(payload.userId);
      });
      uitoolkit.on("user-left", (payload) => {
        uitoolkit.unsubscribeVideo(payload.userId);
      });
      uitoolkit.on("*", (event, payload) => {
        // console.log("Received Event:", event, payload);
      });
      uitoolkit.showVideoComponent(sessionContainer);
      uitoolkit.showChatComponent(sessionContainer);
      uitoolkit.showControlsComponent(sessionContainer);
      uitoolkit.showUsersComponent(sessionContainer);
      uitoolkit.showSettingsComponent(sessionContainer);
    } else {
      console.error("Session container is not defined.");
    }
  }

  const sessionClosed = () => {
    sessionContainer && uitoolkit.closeSession(sessionContainer);
    document.getElementById("join-flow").style.display = "block";
    document.getElementById("zoomBlock").style.display = "block";
  };

  return (
    <>
      <div className="SkillDetails-main" style={{ padding: "0px" }}>
        <div
          className={`SkillDetails ${show === true ? "skillresponsive" : ""}`}
        >
          <div
            className="back-btn d-flex align-items-center justify-content-center"
            onClick={() => navigate(-1)}
          >
            <img src={icons.backicon} alt="icon" />
            <span> Back</span>
          </div>
          {loading ? (
            <div className="loading-div">
              <Roundedloader size="md" />
            </div>
          ) : (
            <React.Fragment>
              <div className="d-flex justify-content-end mb-10 me-2 gap-sm-4 gap-2">
                {/* {isUserOnline && (
                  <div id="join-flow">
                    <Button
                      btnText="Join Meeting"
                      btnStyle="PDO"
                      onClick={getVideoSDKJWT}
                    />
                  </div>
                )} */}
                <Button
                  btnText="Submit Skill"
                  onClick={handelSumitSkill}
                  disabled={
                    !getDetails?.studentResponseVideo?.length > 0 ||
                    getDetails?.is_completed ||
                    getDetails?.status === "submitted" ||
                    skillLoading
                  }
                  loading={skillLoading}
                />
              </div>
              <div className="row row-gap-3">
                {state?.id !== null && (
                  <div
                    className={`${isUserOnline ? "col-12 col-lg-4" : "col-12"}`}
                    style={{
                      maxHeight: isUserOnline ? "calc(100vh - 337px)" : "unset",
                      overflow: "auto",
                    }}
                  >
                    <div className="row row-gap-3">
                      <div
                        className={`${
                          isUserOnline ? "col-12" : "col-md-6 col-12"
                        }`}
                      >
                        <div className="border details-section">
                          <div className="d-flex">
                            <h1 className="details">Skill details</h1>
                            <div className="mt-10">
                              {getDetails?.status === "completed" ? (
                                <Button
                                  btnText="Completed"
                                  btnStyle="PG"
                                  textClass="text-12-400"
                                />
                              ) : getDetails?.status === "pending" ? (
                                <Button
                                  btnText="Pending"
                                  btnStyle="PB"
                                  textClass="text-12-400"
                                />
                              ) : (
                                <Button
                                  btnText="In Progress"
                                  btnStyle="PI"
                                  textClass="text-12-400"
                                />
                              )}
                            </div>
                            {/* 
                     <div className="tag-containert rounded-pill">
                      <h3 className="tag">Completed</h3>
                    </div>  */}
                          </div>
                          <div className="star flex justify-center items-center mb-2">
                            {renderStars(5)}
                          </div>
                          <h4 className="title">
                            Title:{" "}
                            <span className="ans">
                              {" "}
                              {getDetails?.skillId?.title}{" "}
                            </span>
                          </h4>
                          <h4>
                            Instrument:{" "}
                            <span className="ans">
                              {" "}
                              {getDetails?.skillId?.instrument?.name}{" "}
                            </span>
                          </h4>
                          <h4>
                            Category:{" "}
                            <span className="ans">
                              {" "}
                              {getDetails?.skillId?.category?.name}{" "}
                            </span>
                          </h4>
                          <h4>
                            Description:{" "}
                            <span className="ans">
                              {" "}
                              {getDetails?.skillId?.description}{" "}
                            </span>{" "}
                          </h4>
                          <h1 className="per">100%</h1>
                        </div>
                        <div className="mt-15">
                          <TutorialVideo
                            getDetails={getDetails}
                            data={state}
                            featchDetails={featchDetails}
                            setCreateTutor={setCreateTutor}
                            setPreview={setPreview}
                            setChanage={setChanage}
                            setDeleteId={setDeleteId}
                          />
                        </div>
                        <div className="personal-tutorials border ">
                          <h1 className="pb-10">Personal Tutorials</h1>
                          <div className="listBlock-p brave-scroll">
                            {getDetails?.skillId?.personalTutorials?.map(
                              (item, index) => (
                                <div key={index}>
                                  <div className="fb-center mb-10">
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
                                        {moment(item?.time).format("MM/DD/YY")}{" "}
                                        - {moment(item?.time).format("h:mm A")}
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
                                    </div>
                                  </div>
                                  {/* {index !== dataList?.length - 1 && <hr />} */}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`${
                          isUserOnline ? "col-12" : "col-md-6 col-12"
                        }`}
                      >
                        <div className="tutorials-video">
                          <h1 className="pb-10">Tutorial Videos</h1>
                          <div className="listBlock-t-b  brave-scroll">
                            {getDetails?.skillId?.tutorialVideos?.map(
                              (item, index) => (
                                <div key={index}>
                                  <div className="fb-center mb-10">
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
                                        {moment(item?.time).format("MM/DD/YY")}{" "}
                                        - {moment(item?.time).format("h:mm A")}
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
                                    </div>
                                  </div>
                                  {/* {index !== dataList?.length - 1 && <hr />} */}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                        <div className="external-videos border  brave-scroll">
                          <h1 className="pb-10">External Videos</h1>
                          <div className="listBlock-p">
                            {getDetails?.skillId?.externalVideos?.map(
                              (item, index) => (
                                <div key={index}>
                                  <div className="fb-center mb-10">
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
                                        {moment(item?.createdAt).format(
                                          "MM/DD/YY"
                                        )}{" "}
                                        -{" "}
                                        {moment(item?.createdAt).format(
                                          "h:mm A"
                                        )}
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
                                              videoUrl: item?.link,
                                              isShowVideo: true,
                                              isExternal: true,
                                            });
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  {/* {index !== dataList?.length - 1 && <hr />} */}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                        <div className="supporting-documents border">
                          <h1 className="pb-10">Supporting Documents</h1>

                          <div className="listBlock-p brave-scroll">
                            {getDetails?.skillId?.supportingDocuments?.map(
                              (item, index) => (
                                <div key={index}>
                                  <div className="fb-center mb-10">
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
                                        {moment(item?.createdAt).format(
                                          "MM/DD/YY"
                                        )}{" "}
                                        -{" "}
                                        {moment(item?.createdAt).format(
                                          "h:mm A"
                                        )}
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
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                        <div className="note border">
                          <h1>Notes</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Zoom Screen */}
                <div
                  className={`${
                    isUserOnline
                      ? state?.id === null
                        ? "col-10"
                        : "col-12 col-lg-8"
                      : "d-none"
                  }`}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      flexDirection: "column",
                    }}
                    className="br-20"
                  >
                    <div
                      id="zoomBlock"
                      style={{
                        width: "100%",
                        height: "50%",
                      }}
                      className="br-20"
                    >
                      <div className="f-center flex-column br-20 wp-100 position-relative">
                        <div className="wp-100">
                          <img
                            src={icons.zoomDummy}
                            alt=""
                            className="fit-image br-20"
                            loading="lazy"
                            width="100%"
                          />
                        </div>
                        <div
                          id="join-flow"
                          className="wp-100 position-absolute br-20"
                          style={{
                            bottom: 0,
                          }}
                        >
                          <Button
                            btnText="Join Meeting"
                            btnStyle="PDV"
                            onClick={getVideoSDKJWT}
                            className="br-bl-20 br-br-20 br-tl-0 br-tr-0"
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      id="sessionContainer"
                      style={{ width: "100%", height: "50%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
        {chanage?.isShow && (
          <TakeTitlePopUp
            data={state}
            chanage={chanage}
            onHide={() => {
              featchDetails();
              setChanage({
                isShow: false,
                title: "",
              });
            }}
          />
        )}

        {createTutor && (
          <TutorVideoPopUp
            featchDetails={featchDetails}
            data={state}
            // featchSkillEdit={featchSkillEditVal}
            onHide={() => {
              setCreateTutor(false);
            }}
          />
        )}
        {preview?.isShowVideo && (
          <PreviewVideo
            isExternal={preview?.isExternal}
            previewUrl={preview?.videoUrl}
            onHide={() => {
              setPreview({
                isShowVideo: false,
                videoUrl: null,
              });
            }}
          />
        )}
        {deleteId?.isdelete && (
          <DeleteConfirmation
            title="Student Response Videos"
            onDelete={handeldeleteTutorVideo}
            onHide={() => {
              setDeleteId({
                id: null,
                isdelete: false,
              });
            }}
          />
        )}
      </div>
    </>
  );
};

export default SkillDetails;
