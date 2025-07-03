import { Button } from "@/components";
import {
  getInitials,
  storeLocalStorageData,
  titleCaseString,
} from "@/utils/helpers";
import { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { icons } from "utils/constants";
import "./Sidebar.scss";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isResponsive, show, setShow, role, handleLogout }) => {
  const loacation = useLocation();
  const isStudentDashboard = loacation.pathname.includes("student-dashboard");
  const isparentchild = location.pathname.includes("/parent/dashboard/");
  const { childName, type } = useParams();
  const navigate = useNavigate();
  const reduxData = useSelector((state) => state.global);
  const { profileData } = reduxData || {};
  const {
    name,
    role: userRole,
    lastName,
    profileImage,
    firstName,
  } = profileData || {};
  const [expand, setExpand] = useState("");

  const handleNavigate = (parentLink, subChildURL) => {
    navigate(`${parentLink}${subChildURL ? subChildURL : ""}`);
  };

  const optionsList = {
    admin: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: icons.dashboardImg,
        activeIcons: icons.whiteDashboardImg,
      },
      {
        title: "Calendar",
        url: "/admin/calender",
        icon: icons.calendardark,
        activeIcons: icons.calendarLight,
      },
      {
        title: "Registration",
        url: "/admin/registration",
        icon: icons.registrationDark,
        activeIcons: icons.registration,
        line: true,
      },
      {
        title: "Students List",
        url: "/admin/studentlist",
        icon: icons.students,
        activeIcons: icons.whiteStudent,
      },

      {
        title: "Teachers List",
        url: "/admin/teacherlist",
        icon: icons.teacherBlack,
        activeIcons: icons.teacherWhite,
      },
      {
        title: "Performance",
        url: "/admin/performance",
        icon: icons.performance || icons.eStudent,
        activeIcons: icons.performance || icons.eStudent,
      },
      // {
      //   title: "Consultation List",
      //   url: "/admin/consultation",
      //   icon: icons.consultationImg,
      //   activeIcons: icons.consultationWhiteImg,
      // },
      {
        title: "Instrument",
        url: "/admin/instrument",
        icon: icons.musicDark,
        activeIcons: icons.musicLight,
      },
      {
        title: "Subscription",
        url: "/admin/SubScription",
        icon: icons.subBlack,
        activeIcons: icons.subWhite,
        line: true,
      },
      {
        title: "Master Form",
        url: "/admin/master-form/location",
        icon: icons.scrumImg,
        activeIcons: icons.formImg,
      },
      {
        title: "Account Setting",
        url: "/admin/accountsetting",
        icon: icons.settingsBlackIcons,
        activeIcons: icons.settingsWhiteIcons,
        line: true,
      },
    ],
    student: [
      {
        title: "Dashboard",
        url: "/user/dashboard",
        icon: icons.dashboardImg,
        activeIcons: icons.whiteDashboardImg,
      },
      {
        title: "Lesson Schedule",
        url: "/user/lesson-schedule",
        icon: icons.calenderImg,
        activeIcons: icons.calenderWhiteIcons,
      },
      {
        title: "Skills & Assignments",
        url: "/user/skill-assignments",
        icon: icons.settingsBlackIcons,
        activeIcons: icons.settingsWhiteIcons,
        line: true,
      },
      {
        title: "Chat",
        url: "/user/chat",
        icon: icons.chatBlackImg,
        activeIcons: icons.chatWhiteImg,
        line: true,
      },
      {
        title: "Billing",
        url: "/user/billing",
        icon: icons.subBlack,
        activeIcons: icons.subWhite,
      },
      {
        title: "Account Settings",
        url: "/user/account-settings",
        icon: icons.settingsBlackIcons,
        activeIcons: icons.settingsWhiteIcons,
        line: true,
      },
    ],
    teacher: [
      {
        title: "Dashboard",
        url: "/teacher/dashboard",
        icon: icons.dashboardImg,
        activeIcons: icons.whiteDashboardImg,
      },
      {
        title: "Lesson Schedule",
        url: "/teacher/lesson-schedule",
        icon: icons.calenderImg,
        activeIcons: icons.calenderWhiteIcons,
      },
      {
        title: "Students",
        url: "/teacher/studentList",
        icon: icons.students,
        activeIcons: icons.whiteStudent,
      },
      {
        title: "Skills",
        url: "/teacher/skills/skill-templete",
        icon: icons.bStar,
        activeIcons: icons.wStar,
      },
      {
        title: "Chat",
        url: "/teacher/chat",
        icon: icons.chatBlackImg,
        activeIcons: icons.chatWhiteImg,
      },
      // {
      //   title: "Student Report",
      //   url: "/teacher/student-report",
      //   icon: icons.bBubble,
      //   activeIcons: icons.wBubble,
      //   line: true,
      // },
      // {
      //   title: "Billing",
      //   url: "/teacher/billing",
      //   icon: icons.subBlack,
      //   activeIcons: icons.subWhite,
      // },
      {
        title: "Account Settings",
        url: "/teacher/accountsetting",
        icon: icons.settingsBlackIcons,
        activeIcons: icons.settingsWhiteIcons,
        line: true,
      },
    ],
    parent: [
      {
        title: "Dashboard",
        url: "/parent/dashboard",
        icon: icons.dashboardImg,
        activeIcons: icons.whiteDashboardImg,
      },
      {
        title: "Billing",
        url: "/parent/billing",
        icon: icons.subBlack,
        activeIcons: icons.subWhite,
      },
      {
        title: "Account Settings",
        url: "/parent/accountsetting",
        icon: icons.settingsBlackIcons,
        activeIcons: icons.settingsWhiteIcons,
        line: true,
      },
    ],
  };

  const sidebarOptions = optionsList[role] || [];

  return (
    <>
      {show && (
        <Offcanvas
          show={show}
          onHide={() => {
            setShow(false);
          }}
          responsive="lg"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Offcanvas</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div id="sidebar-container">
              <div className="profile-div">
                <div className="profile-img">
                  <div className="img-m">
                    <img src={icons.logo} alt="logo" className="fit-image" />
                  </div>
                  <p className="profile-title">PracticePad®</p>
                </div>
                {!isResponsive && (
                  <div
                    className="right-div pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      setShow(false);
                    }}
                  >
                    <img
                      src={icons?.leftArrowImg}
                      alt="left-arrow"
                      loading="lazy"
                    />
                  </div>
                )}
                {isResponsive && (
                  <div className="w-50 f-center">
                    <div
                      className="close-img pointer"
                      onClick={() => {
                        setShow(false);
                      }}
                    >
                      <img src={icons.close} alt="close" />
                    </div>
                  </div>
                )}
              </div>
              <div className="profile-content">
                <div className="user-img">
                  {(role === "admin" ||
                    role === "teacher" ||
                    role === "parent") && (
                    <div className="w-56 h-56 f-center br-50 bg-bebe">
                      {profileImage ? (
                        <>
                          <img
                            src={profileImage}
                            alt=""
                            className="fit-image br-50"
                          />
                        </>
                      ) : (
                        <>
                          <div className="f-center text-16-400 color-003e font-gilroy">
                            {getInitials(firstName || lastName) || "User"}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  {role === "student" && (
                    <div className="main-img">
                      {profileImage ? (
                        <>
                          <img src={profileImage} className="user-re" />
                          <svg className="circle" width="60" height="60">
                            <circle
                              cx="30"
                              cy="30"
                              r="28"
                              stroke="#FE5C38"
                              strokeWidth="2"
                              fill="none"
                              strokeDasharray="164"
                              strokeDashoffset="40"
                            />
                          </svg>
                        </>
                      ) : (
                        <div className="w-56 h-56 f-center br-50 bg-bebe">
                          <div className="f-center text-16-400 color-003e font-gilroy">
                            {getInitials(firstName || lastName)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="left-div">
                  <h6 className="left-name">
                    {titleCaseString(firstName)} {titleCaseString(lastName)}
                  </h6>
                  <p className="left-pra">{titleCaseString(userRole)}</p>
                </div>
              </div>

              {isStudentDashboard && (
                <div className="mb-20 mt-10 mx-6 bg-003E br-6 px-20 py-8 d-flex flex-column">
                  <div className="text-15-400 color-fe5c font-gilroy-m">
                    Selected Student:
                  </div>
                  <div className="text-16-400 color-ffff font-gilroy-m">
                    Alexander
                  </div>
                </div>
              )}

              {isparentchild && (
                <div
                  className="mb-20 mt-10 mx-6  br-6 px-20 py-8 d-flex flex-column"
                  style={{
                    borderBottom: "0.5px solid #e2e2e2",
                  }}
                >
                  <div className="text-15-400 color-fe5c font-gilroy-m">
                    Selected Child:
                  </div>
                  <div className="text-16-400 color-1a1a font-gilroy-m">
                    {loacation?.state?.childrenName}
                  </div>
                </div>
              )}
              <div className="side-option-container brave-scroll">
                {sidebarOptions?.map((elm, index) => {
                  const { title, icon, url, childOptions, activeIcons, line } =
                    elm;

                  const isSkillsTab =
                    window.location.pathname?.startsWith("/teacher/skills");
                  const Parentdas =
                    window.location.pathname?.startsWith("/parent/dashboard");
                  const data = isSkillsTab
                    ? url == `/teacher/skills/${type}`
                    : Parentdas
                    ? url == `/parent/dashboard/${type}`
                    : "";

                  const isActive =
                    window.location.pathname?.includes(url) || data;
                  const isChild = childOptions?.length > 0;
                  return (
                    <div
                      key={index}
                      className={`main-option-block ${
                        line ? " pb-40 border-b mb-28" : ""
                      }`}
                    >
                      <div
                        className={` option-item ${isActive ? "active" : ""}`}
                        onClick={() => {
                          if (isChild) {
                            setExpand(index);
                          } else {
                            setExpand("");
                          }
                          if (isResponsive) {
                            setShow(false);
                          }
                          handleNavigate(url);
                          storeLocalStorageData({ tabId: "" });
                        }}
                      >
                        {isActive && <span className="v-active-line" />}
                        <span className="icon-block">
                          <img
                            src={isActive ? activeIcons : icon}
                            alt={title}
                            className="fit-image"
                          />
                        </span>
                        <p className="title-block">{title}</p>
                        {isChild && (
                          <span className="down-block">
                            <img
                              src={icons.down}
                              alt="down"
                              className="fit-image"
                            />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {/* {role === "teacher" && (
                  <div className="mt-10 mx-6 br-11 px-20 py-10 pb-4 d-flex b-7690 flex-column practicePad mb-20">
                    <div className="fb-center mb-3">
                      <div className="w-23 h-23 f-center">
                        <img
                          src={icons.coinsWhite}
                          alt=""
                          className="fit-image"
                        />
                      </div>
                      <div className="w-16 h-16 f-center">
                        <img
                          src={icons.infoWhite}
                          alt=""
                          className="fit-image"
                        />
                      </div>
                    </div>
                    <div className="text-15-400 color-ffff font-gilroy-sb">
                      PracticePad Score
                    </div>
                    <div className="text-35-400 color-ffff font-gilroy-sb">
                      45.2
                    </div>
                  </div>
                )} */}
                {/* {(role === "student" || role === "teacher") &&
                  (loacation?.pathname === "/user/dashboard" ||
                    location?.pathname === "/teacher/dashboard") && (
                    <div className="upgrade-card mb-30">
                      <div className="w-34 h-34 f-center mb-12">
                        <img
                          src={icons.diamondImg}
                          alt=""
                          className="fit-image"
                        />
                      </div>
                      <div className="Upgrade-text">Upgrade Account</div>

                      <div className="Upgrade-pra mb-8">
                        Stay focused on what matters most
                      </div>
                      <Button
                        btnText="Upgrade Plan"
                        btnStyle="upgrade-btn"
                        textClass="text-13-400 font-gilroy-sb"
                      />
                    </div>
                  )} */}
              </div>
              <div className="side-footer">
                <div className="footer-div pointer" onClick={handleLogout}>
                  <div className="footer-block">
                    <img src={icons?.logoutImg} />
                  </div>
                  <p className="footer-title ">Sign Out</p>
                </div>
              </div>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </>
  );
};

export default Sidebar;
