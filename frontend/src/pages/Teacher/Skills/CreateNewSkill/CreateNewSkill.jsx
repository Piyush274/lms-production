import { Button, DeleteConfirmation } from "@/components";
import {
  handelAddNewExternal,
  handelGetSkillDetails,
  handelUpdateSkill,
  handelUpdateSkillActionVC,
  showSuccess,
} from "@/store/globalSlice";
// Zoom
import uitoolkit from "@zoom/videosdk-ui-toolkit";
import "@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css";
// import "./ZoomMeeting.scss";

import { icons } from "@/utils/constants";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ExternalPopup from "../ExternalPopup";
import PreviewVideo from "../PreviewVideo";
import TakePopUp from "../TakePopUp";
import TakeTitlePopUp from "../TakeTitlePopUp";
import TutorPopUp from "../TutorPopUp";
import TutorVideoPopUp from "../TutorVideoPopUp/TutorVideoPopUp";
import "./CreateNewSkill.scss";
import ExternalVideo from "./ExternalVideo";
import Notes from "./Notes";
import PersonalTutorial from "./PersonalTutorial";
import SkillDetailForm from "./SkillDetailForm";
import SkillDetails from "./SkillDetails";
import StudentResponseVideo from "./StudentResponseVideo";
import SupportingDocument from "./SupportingDocument";
import TutorialVideo from "./TutorialVideo";
import {
  getDataFromLocalStorage,
  storeLocalStorageData,
} from "@/utils/helpers";
import PersonalVideoPopup from "./PersonalTutorial/PersonalVideoPopup";
import PersonalTitlePopUp from "./PersonalTutorial/PersonalTitlePopUp";
import ZoomMeeting from "@/pages/Zoom/ZoomMeeting";
// import ZoomMeeting from "@/pages/Zoom/ZoomMeeting";

const CreateNewSkill = ({
  handleBackToSkillTemplates,
  instrumentsList,
  categoriesList,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [skillTitle, setSkillTitle] = useState({});
  const [skillEdit, setSkillEdit] = useState({});
  const [yuVideo, setYuVideo] = useState(false);
  const [yuVideoEdit, setYuVideoEdit] = useState({});
  const [takePhoto, setTakePhoto] = useState(false);
  const [deletePhoto, setDeletePhoto] = useState(false);
  const [deleteVideo, setDeleteVideo] = useState(false);
  const [changeTitle, setChangeTitle] = useState(false);
  const [changeSuppotingTitle, setChangeSuppotingTitle] = useState({});
  const [changeTitleTutor, setChangeTitleTutor] = useState({});
  const [deleteTutorVideo, setDeleteTutorVideo] = useState(false);
  const [deleteTutorVideoId, setDeleteTutorVideoId] = useState(null);
  const [changeTutorTitle, setChangeTutorTitle] = useState(false);
  const [CreateTutor, setCreateTutor] = useState(false);
  const [isShowPreview, setIsShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [deleteExternal, setDeleteExternal] = useState(null);
  const [deleteDocument, setDeleteDocument] = useState(null);
  const [changePersonal, setChangePersonal] = useState(false);
  const [changeVideo, setChangeVideo] = useState(false);
  const [deletePersonalVideo, setDeletePersonalVideo] = useState(false);
  const [deletePersonalId, setDeletePersonalId] = useState(null);
  const [changeTitlePersonal, setChangeTitlePersonal] = useState({});
  const localData = getDataFromLocalStorage();
  const teacherId = localData.userId;
  const studentId = state?.studentId;
  const assignedId = state?.assignedId;
  const reduxData = useSelector((state) => state.global);
  const { profileData, isMeetStarted } = reduxData || {};
  // const isEdit = profileData?.location?.locationType !== "online";
  const isEdit = !state?.isOnline;
  const [isNew, setIsNew] = useState(true);

  const featchSkillEditVal = async () => {
    if (state?.id) {
      const res = await dispatch(handelGetSkillDetails(state?.id));
      if (res?.status === 200) {
        setSkillEdit(res?.data?.response);
        setIsNew(false)
      }
    }
  };

  useEffect(() => {
    if (state) {
      featchSkillEditVal();
    }
  }, [state]);

  const handeldeleteTutorVideo = async () => {
    if (!deleteTutorVideoId) return;

    const payload = {
      skillId: state?.id,
      removeTutorialVideos: deleteTutorVideoId,
    };
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const res = await dispatch(handelUpdateSkill(formData));
    if (res?.status === 200) {
      dispatch(showSuccess("Your skill has been successfully deleted"));
      featchSkillEditVal();
      setDeleteTutorVideo(false);
      setDeleteTutorVideoId(null);
    }
  };

  const handleDeleteDocument = async () => {
    if (!deleteExternal) return;

    const payload = {
      skillId: state?.id,
      externalId: deleteExternal,
      isDeleted: true,
    };
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const res = await dispatch(handelAddNewExternal(formData));
    if (res?.status === 200) {
      featchSkillEditVal();
      setDeleteExternal(null);
      setDeleteVideo(false);
    }
  };
  const handeldeleteDocument = async () => {
    if (!deleteDocument) return;

    const payload = {
      skillId: state?.id,
      removeSupportingDocuments: deleteDocument,
    };
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const res = await dispatch(handelUpdateSkill(formData));
    if (res?.status === 200) {
      dispatch(showSuccess("Your skill has been successfully deleted"));
      featchSkillEditVal();
      setDeleteDocument(null);
      setDeletePhoto(false);
    }
  };
  const handelDeletePersonalVideo = async () => {
    if (!deletePersonalId) return;

    const payload = {
      skillId: state?.id,
      removePersonalTutorials: deletePersonalId,
    };
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const res = await dispatch(handelUpdateSkill(formData));
    if (res?.status === 200) {
      dispatch(showSuccess("Your skill has been successfully deleted"));
      featchSkillEditVal();
      setDeletePersonalId(null);
      setDeletePersonalVideo(false);
    }
  };

  const { lastName, firstName } = profileData || {};
  const userName = `${firstName} ${lastName}`;

  // Zoom VC Functions
  const sessionKey = `session-${skillEdit.title}-${teacherId}-${studentId}`;
  const baseURL = import.meta.env.VITE_API_URL_ZOOM;

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
          await dispatch(handelUpdateSkillActionVC(payload));
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
    <div id="createnewskill-container">
      <div className="fa-center mb-20">
        <div
          className="back f-center gap-2 pointer"
          style={{
            width: "fit-content",
          }}
          onClick={() => {
            if (state?.sSkill) {
              navigate("/teacher/skills/student-skill", {
                state: {
                  id: state?.studentId,
                  firstName: state?.firstName,
                  lastName: state?.lastName,
                  sSkill: true,
                },
              });
            } else {
              navigate("/teacher/skills/skill-templete");
              storeLocalStorageData({ skillId: "" });
              storeLocalStorageData({ tabId: "" });
            }
          }}
        >
          <div className="w-10 h-10 f-center">
            <img src={icons.eBack} className="fit-image" alt="" />
          </div>
          <div>Back</div>
        </div>
      </div>
      <div className="text-20-400 color-1a1a font-gilroy-m mb-20">
        {isEdit && !isNew ? (
          <>
            <div className="text-20-400 font-gilroy-m color-1a1a">
              Skill Details: <span className="color-5151">{skillEdit.title}</span>
            </div>
          </>
        ) : (
          <div className="container-fluid">
            <div className="row">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  width: "81%",
                }}
              >
                <div>Create new skill template</div>
                {/* <div id="join-flow">
                  <Button
                    btnText="Join Meeting"
                    btnStyle="PDO"
                    onClick={getVideoSDKJWT}
                  />
                </div> */}
              </div>
            </div>
          </div>
        )}
      </div>

      <Row className="row-gap-3 rowBlock brave-scroll">
        {state?.id !== null && (
          <div
            className={`${isEdit ? "col-12" : "col-lg-4 col-12"}`}
            style={{
              maxHeight: isEdit ? "unset" : "calc(100vh - 341px)",
              overflow: "auto",
            }}
          >
            <Row className="row-gap-3 rowBlock brave-scroll">
              <Col xl={isEdit ? 5 : 12} md={12}>
                <Row className="row-gap-3">
                  <Col md={12}>
                    {isEdit ? (
                      <>
                        <SkillDetailForm 
                        instrumentsList={instrumentsList}
                        categoriesList={categoriesList}
                        skillEdit={skillEdit}
                        featchSkillEditVal={featchSkillEditVal}
                        isNew={isNew}
                        setIsNew={setIsNew}
                        />
                      </>
                    ) : (
                      <>
                        <SkillDetailForm
                          skillEdit={skillEdit}
                          featchSkillEditVal={featchSkillEditVal}
                          skillTitle={skillTitle}
                          instrumentsList={instrumentsList}
                          categoriesList={categoriesList}
                        />{" "}
                      </>
                    )}
                  </Col>
                  {/* <Col md={12}>
              <PersonalTutorial
                changePersonal={changePersonal}
                changeVideo={changeVideo}
                setChangeVideo={setChangeVideo}
                setChangePersonal={setChangePersonal}
                featchSkillEditVal={featchSkillEditVal}
                skillEdit={skillEdit}
                setDeletePersonalId={setDeletePersonalId}
                setDeletePersonalVideo={setDeletePersonalVideo}
                setPreviewUrl={setPreviewUrl}
                setIsShowPreview={setIsShowPreview}
                setChangeTitlePersonal={setChangeTitlePersonal}
              />
            </Col> */}
                  <Col md={12}>
                    <StudentResponseVideo />
                  </Col>
                </Row>
              </Col>
              <Col xl={isEdit ? 5 : 12} md={12}>
                <Row className="row-gap-3">
                  <Col md={12}>
                    <TutorialVideo
                      featchSkillEditVal={featchSkillEditVal}
                      setChangeTitleTutor={setChangeTitleTutor}
                      setDeleteTutorVideoId={setDeleteTutorVideoId}
                      skillEdit={skillEdit}
                      setDeleteTutorVideo={setDeleteTutorVideo}
                      setChangeTutorTitle={setChangeTutorTitle}
                      setCreateTutor={setCreateTutor}
                      setPreviewUrl={setPreviewUrl}
                      setIsShowPreview={setIsShowPreview}
                    />
                  </Col>
                  <Col md={12}>
                    <ExternalVideo
                      setDeleteExternal={setDeleteExternal}
                      setYuVideoEdit={setYuVideoEdit}
                      skillEdit={skillEdit}
                      setYuVideo={setYuVideo}
                      yuVideo={yuVideo}
                      setDeleteVideo={setDeleteVideo}
                    />
                  </Col>
                  <Col md={12}>
                    <SupportingDocument
                      setDeleteDocument={setDeleteDocument}
                      setChangeSuppotingTitle={setChangeSuppotingTitle}
                      featchSkillEditVal={featchSkillEditVal}
                      skillEdit={skillEdit}
                      setChangeTitle={setChangeTitle}
                      setTakePhoto={setTakePhoto}
                      setDeletePhoto={setDeletePhoto}
                    />
                  </Col>
                  <Col md={12}>
                    <Notes />
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        )}

        {/* Zoom Screen */}
        {/* <div className={`${isEdit ? "d-none" : "col-12 col-lg-8"}`}> */}
        <div
          className={`${
            isEdit
              ? "d-none"
              : state?.id === null
              ? "col-12 col-lg-10"
              : "col-12 col-lg-8"
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
      </Row>

      {yuVideo && (
        <ExternalPopup
          setYuVideoEdit={setYuVideoEdit}
          yuVideoEdit={yuVideoEdit}
          setYuVideo={setYuVideo}
          featchSkillEditVal={featchSkillEditVal}
          skillId={state?.id}
          onHide={() => {
            setYuVideo(false);
            setYuVideoEdit({});
          }}
        />
      )}

      {takePhoto && (
        <TakePopUp
          featchSkillEditVal={featchSkillEditVal}
          skillId={state?.id}
          onHide={() => {
            setTakePhoto(false);
          }}
        />
      )}

      {deletePhoto && (
        <DeleteConfirmation
          title="Supporting Document"
          onDelete={handeldeleteDocument}
          onHide={() => {
            setDeleteDocument(null);
            setDeletePhoto(false);
          }}
        />
      )}

      {deleteVideo && (
        <DeleteConfirmation
          onDelete={handleDeleteDocument}
          title="External Videos"
          onHide={() => {
            setDeleteExternal(null);
            setDeleteVideo(false);
          }}
        />
      )}

      {changeTitle && (
        <TakeTitlePopUp
          skillId={state?.id}
          setChangeTitle={setChangeTitle}
          featchSkillEditVal={featchSkillEditVal}
          changeSuppotingTitle={changeSuppotingTitle}
          onHide={() => {
            setChangeTitle(false);
            setChangeSuppotingTitle({});
          }}
        />
      )}

      {isShowPreview && (
        <PreviewVideo
          previewUrl={previewUrl}
          onHide={() => {
            setPreviewUrl(null);
            setIsShowPreview(false);
          }}
        />
      )}

      {deleteTutorVideo && (
        <DeleteConfirmation
          title="Tutor Videos"
          onDelete={handeldeleteTutorVideo}
          onHide={() => {
            setDeleteTutorVideo(false);
            setDeleteTutorVideoId(null);
          }}
        />
      )}

      {changeTutorTitle && (
        <TutorPopUp
          skillId={state?.id}
          featchSkillEditVal={featchSkillEditVal}
          setChangeTitleTutor={setChangeTitleTutor}
          setChangeTutorTitle={setChangeTutorTitle}
          changeTitleTutor={changeTitleTutor}
          onHide={() => {
            setChangeTutorTitle(false);
            setChangeTitleTutor({});
          }}
        />
      )}

      {CreateTutor && (
        <TutorVideoPopUp
          skillId={state?.id}
          featchSkillEdit={featchSkillEditVal}
          onHide={() => {
            setCreateTutor(false);
          }}
        />
      )}

      {changeVideo && (
        <PersonalVideoPopup
          skillId={state?.id}
          featchSkillEdit={featchSkillEditVal}
          onHide={() => {
            setChangeVideo(false);
          }}
        />
      )}

      {deletePersonalVideo && (
        <DeleteConfirmation
          title="Personal Videos"
          onDelete={handelDeletePersonalVideo}
          onHide={() => {
            setDeletePersonalVideo(false);
            setDeletePersonalId(null);
          }}
        />
      )}

      {changePersonal && (
        <PersonalTitlePopUp
          skillId={state?.id}
          featchSkillEditVal={featchSkillEditVal}
          setChangeTitlePersonal={setChangeTitlePersonal}
          setChangePersonal={setChangePersonal}
          changeTitlePersonal={changeTitlePersonal}
          onHide={() => {
            setChangeTitlePersonal({});
            setChangePersonal(false);
          }}
        />
      )}
    </div>
  );
};

export default CreateNewSkill;
