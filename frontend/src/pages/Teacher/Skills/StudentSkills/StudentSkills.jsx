import { Roundedloader } from "@/components";
import {
  handelStudentGetAssignedSkill,
  handelUpdateSkillAction,
} from "@/store/globalSlice";
import { icons } from "@/utils/constants";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import "./StudentSkills.scss";
import { getDataFromLocalStorage } from "@/utils/helpers";

const StudentSkills = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [loading, setIsLoading] = useState(false);
  const tabs = ["active", "inactive", "completed", "deleted"];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { state } = location;
  const [skillListArr, setSkillListArr] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [lodingUpdate, setLodingUpdate] = useState(false);
  const reduxData = useSelector((state) => state.global);
  const { profileData } = reduxData || {};

  const fetchSkillList = async () => {
    setIsLoading(true);
    if (state?.id) {
      const res = await dispatch(handelStudentGetAssignedSkill(state?.id));
      if (res?.status === 200) {
        setSkillListArr(res?.data?.response || []);
        getskill(res?.data?.response);
      }
    }
    setIsLoading(false);
  };

  const localData = getDataFromLocalStorage();

  const teacherID = localData.userId;

  useEffect(() => {
    fetchSkillList();
  }, []);

  const getskill = (val) => {
    if (val?.length > 0) {
      const filterConditions = {
        active: (skill) =>
          !skill?.is_deleted && skill?.is_active && !skill?.is_completed,
        inactive: (skill) =>
          (!skill?.is_deleted && !skill?.is_active && !skill?.is_completed) ||
          (!skill?.is_active && skill?.is_completed),
        completed: (skill) =>
          !skill?.is_deleted && skill?.is_active && skill?.is_completed,
        deleted: (skill) => skill?.is_deleted,
      };

      const filteredSkills = val?.filter(
        filterConditions[activeTab] || (() => true)
      );
      setStoreData(filteredSkills);
    } else {
      setStoreData([]);
    }
  };

  useEffect(() => {
    getskill(skillListArr);
  }, [activeTab]);

  const handleUpdateSkill = async (val) => {
    setLodingUpdate(true);
    const statusVal = val?.isComplete ? "completed" : "pending";
    const payload = {
      is_completed: val?.isComplete,
      assignedId: val?.id,
      status: statusVal,
    };
    const res = await dispatch(handelUpdateSkillAction(payload));

    if (res?.status === 200) {
      fetchSkillList();
    }
    setLodingUpdate(false);
  };
  const handleUpdateInActiveSkill = async (val) => {
    setLodingUpdate(true);
    const payload = {
      is_active: val?.is_active,
      assignedId: val?.id,
    };
    const res = await dispatch(handelUpdateSkillAction(payload));
    if (res?.status === 200) {
      fetchSkillList();
    }
    setLodingUpdate(false);
  };
  const handleDeleteSkill = async (val) => {
    setLodingUpdate(true);
    const payload = {
      is_deleted: val?.is_deleted,
      assignedId: val?.id,
    };
    const res = await dispatch(handelUpdateSkillAction(payload));
    if (res?.status === 200) {
      fetchSkillList();
    }
    setLodingUpdate(false);
  };

  return (
    <div id="studentskills-container">
      {/* {state?.id} */}

      <div className="mb-10">
        <p className="text-18-800 color-a1a1 mb-2">
          {state?.firstName} {state?.lastName}
        </p>
        {state?.id && (
          <span className="text-14-600 color-aoao mb-0">{state?.id}</span>
        )}
      </div>
      <div className="br-8 bg-dddd tabBlock p-4 gap-2 mb-20">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`tabs ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
      </div>
      <Row className="row-gap-3">
        {loading ? (
          <div className="d-flex justify-content-center pt-100 pb-100">
            <Roundedloader />
          </div>
        ) : (
          storeData?.length > 0 &&
          storeData?.map((skill, index) => {
            const {
              skillId,
              instrumentName,
              title,
              is_completed,
              is_active,
              _id,
              is_deleted,
            } = skill || {};
            return (
              <Col xl={4} md={6} key={index}>
                <div className="cardBlock p-20 d-flex flex-column hp-100">
                  <div className="fb-center flex-nowrap gap-3">
                    <div className="text-20-400 font-gilroy-sb color-1a1a">
                      {title}
                    </div>
                    <div className="w-34 h-34 f-center">
                      <img src={icons.bgStar} alt="" className="fit-image" />
                    </div>
                  </div>
                  <div className="text-18-400 font-gilroy-sb color-5151 mb-10">
                    {instrumentName}
                  </div>
                  <div className="fb-center flex-nowrap gap-3">
                    <div className="d-flex">
                      {Array(5).fill(
                        <div className="w-20 h-20">
                          <img src={icons.gStar} alt="" className="fit-image" />
                        </div>
                      )}
                    </div>
                    <div
                      className="b-fe5c px-10 py-4 br-6 text-15-400 font-gilroy-sb color-fe5c pointer"
                      onClick={() => {
                        navigate("/teacher/skills/create-skill", {
                          state: {
                            id: skillId,
                            studentId: state?.id,
                            sSkill: true,
                            firstName: state?.firstName,
                            lastName: state?.lastName,
                            assignedId: _id,
                          },
                        });
                      }}
                    >
                      Open
                    </div>

                    {/* <div
                      className="b-fe5c px-10 py-4 br-6 text-15-400 font-gilroy-sb color-fe5c pointer"
                    >
                      Join Meeting
                    </div> */}
                  </div>
                  <hr className="flex-grow-1" />
                  <div className="fb-center gap-3">
                    {(is_active && is_completed) ||
                    (!is_active && is_completed) ? (
                      <div
                        className="text-17-400 color-5ea1 font-gilroy-m px-16 py-4 br-6 pointer b-5ea1"
                        onClick={() => {
                          if (!lodingUpdate) {
                            handleUpdateSkill({ isComplete: false, id: _id });
                          }
                        }}
                      >
                        InComplete
                      </div>
                    ) : (
                      <div
                        className="text-17-400 color-5ea1 font-gilroy-m px-16 py-4 br-6 pointer b-5ea1"
                        onClick={() => {
                          if (!lodingUpdate) {
                            handleUpdateSkill({ isComplete: true, id: _id });
                          }
                        }}
                      >
                        Complete
                      </div>
                    )}
                    {(!is_active && !is_completed) ||
                    (!is_active && is_completed) ? (
                      <div
                        className="inActive text-17-400 color-5151 font-gilroy-m px-16 py-4 br-6 pointer"
                        onClick={() => {
                          if (!lodingUpdate) {
                            handleUpdateInActiveSkill({
                              is_active: true,
                              id: _id,
                            });
                          }
                        }}
                      >
                        Active
                      </div>
                    ) : (
                      <div
                        className="inActive text-17-400 color-5151 font-gilroy-m px-16 py-4 br-6 pointer"
                        onClick={() => {
                          if (!lodingUpdate) {
                            handleUpdateInActiveSkill({
                              is_active: false,
                              id: _id,
                            });
                          }
                        }}
                      >
                        Inactive
                      </div>
                    )}
                    {!is_deleted ? (
                      <div
                        className="text-17-400 color-1515 font-gilroy-m px-16 py-4 br-6 pointer b-1515"
                        onClick={() => {
                          if (!lodingUpdate) {
                            handleDeleteSkill({
                              is_deleted: true,
                              id: _id,
                            });
                          }
                        }}
                      >
                        Delete
                      </div>
                    ) : (
                      <div
                        className="text-17-400 color-1515 font-gilroy-m px-16 py-4 br-6 pointer b-1515"
                        onClick={() => {
                          if (!lodingUpdate) {
                            handleDeleteSkill({
                              is_deleted: false,
                              id: _id,
                            });
                          }
                        }}
                      >
                        Restore
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            );
          })
        )}
        {!loading && storeData?.length === 0 && (
          <div className="d-flex justify-content-center pt-100 pb-100 text-20-600">
            No data found
          </div>
        )}
      </Row>
    </div>
  );
};

export default StudentSkills;
