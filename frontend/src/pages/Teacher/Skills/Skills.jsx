import { handelGetCategories, handelGetinstruments } from "@/store/globalSlice";
import {
  getDataFromLocalStorage,
  storeLocalStorageData,
} from "@/utils/helpers";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import CreateNewSkill from "./CreateNewSkill";
import "./Skills.scss";
import SkillTemplate from "./SkillTemplate";
import StudentSkills from "./StudentSkills";

const Skills = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [previousTab, setPreviousTab] = useState(null);
  const [instrumentsList, setInstrumentsList] = useState({});
  const [categoriesList, setCategoriesList] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const skillId = getDataFromLocalStorage("skillId");
  const tabId = getDataFromLocalStorage("tabId");

  const location = useLocation();

  const handleClickNewSkill = () => {
    storeLocalStorageData({ tabId: "1" });
    navigate("/teacher/skills/create-skill");
    setPreviousTab(activeTab);
    // setActiveTab("2");
  };

  const handleBackToSkillTemplates = (val) => {
    if (val) {
      navigate("/teacher/skills/skill-templete");

      storeLocalStorageData({ skillId: "" });
      storeLocalStorageData({ tabId: "" });

      navigate("/teacher/skills/skill-templete");
    }
    // setPreviousTab(null);
  };

  const fetchInstruments = async () => {
    const res = await dispatch(handelGetinstruments());
    if (res?.status === 200) {
      setInstrumentsList(res?.data?.response?.result || {});
    }
  };

  const fetchCategories = async () => {
    const res = await dispatch(handelGetCategories());

    if (res?.status === 200) {
      setCategoriesList(res?.data?.response?.result || {});
    }
  };

  useEffect(() => {
    fetchInstruments();
    fetchCategories();
  }, []);

  return (
    <div id="skills-container">
      <div className="d-flex gap-3 mb-20">
        {/* {(activeTab === "1" || previousTab === "1") && activeTab !== "2" && ( */}
        {/* {tabId !== "1" &&
          location?.pathname !== "/teacher/skills/create-skill" && (
            <div
              onClick={() => {
                //   setActiveTab("1");
                setPreviousTab(null);
                navigate("/teacher/skills/skill-templete", {
                  state: { id: location?.state?.id },
                });
              }}
              className={`text-20-400 font-gilroy-m bb2 pb-12 pointer ${
                location?.pathname === "/teacher/skills/skill-templete"
                  ? "color-003e bb2-003e"
                  : "color-cccc bb2-cccc"
              }`}
            >
              Skill Templates
            </div>
          )} */}
        {/* )} */}
        {/* {(activeTab === "2" || previousTab === "2") && ( */}

        {tabId === "1" &&
          (location?.pathname === "/teacher/skills/create-skill" ||
            location?.pathname === "/teacher/skills/student-skill") && (
            <div
              onClick={() => {
                storeLocalStorageData({ tabId: "1" });
                navigate("/teacher/skills/create-skill");
              }}
              className={`text-20-400 font-gilroy-m bb2 pb-12 pointer ${
                location?.pathname === "/teacher/skills/create-skill"
                  ? "color-003e bb2-003e"
                  : "color-cccc bb2-cccc"
              }`}
            >
              Create New Skill
            </div>
          )}
        {/* )} */}
        {location.pathname === "/teacher/skills/student-skill" &&
          location?.state?.id && (
            <div
              onClick={() => {
                setPreviousTab(activeTab);
                setActiveTab("3");
                navigate("/teacher/skills/student-skill", {
                  state: { id: location?.state?.id },
                });
              }}
              className={`text-20-400 font-gilroy-m bb2 pb-12 pointer ${
                location?.pathname === "/teacher/skills/student-skill"
                  ? "color-003e bb2-003e"
                  : "color-cccc bb2-cccc"
              }`}
            >
              Student’s Skills
            </div>
          )}
      </div>
      {/* {activeTab === "1" && ( */}
      {location?.pathname === "/teacher/skills/skill-templete" && (
        <SkillTemplate handleClickNewSkill={handleClickNewSkill} />
      )}
      {/* )} */}
      {/* {activeTab === "3" &&  */}
      {location?.pathname === "/teacher/skills/student-skill" && (
        <StudentSkills />
      )}
      {/* } */}
      {/* {activeTab === "2" && ( */}
      {location?.pathname === "/teacher/skills/create-skill" && (
        <CreateNewSkill
          instrumentsList={instrumentsList}
          categoriesList={categoriesList}
          handleBackToSkillTemplates={handleBackToSkillTemplates}
        />
      )}
      {/* )} */}
    </div>
  );
};

export default Skills;
