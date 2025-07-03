import { CheckBox } from "@/components";
import ConfirmPopUp from "@/components/layouts/ConfirmPopUp";
import Table from "@/components/layouts/Table";
import { icons } from "@/utils/constants";
import {
  calculateAge,
  calculateAgeVal,
  titleCaseString,
} from "@/utils/helpers";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./AllStudentList.scss";
import { setIsMetting, setMettingData } from "@/store/globalSlice";
import AddMettingPopUp from "../AddMettingPopUp";
import moment from "moment";

const AllStudentList = ({
  allStudentList,
  loading,
  setSearchStudentName,
  setRowsPerPage,
  setCurrentPage,
  currentPage,
  rowsPerPage,
  totalRows,
  setDeleteID,
  searchStudentName,
  isAdd,
  isAddStudent,
  setIsAddStudent,
  setIsAdd,
  handleAddStudent,
  handleSorting,
  setStudentAssign,
  exportAllloading,
  handleExportCsv,
}) => {
  // console.log("✌️allStudentList --->", allStudentList);

  const dispatch = useDispatch();
  //   const [data, setData] = useState([
  //     {
  //       _id: 1,
  //       name: "John",
  //       email: "john.doe@example.com",
  //       isActive: true,
  //       role: "Student",
  //       lastName: "Doe",
  //     },
  //     {
  //       _id: 2,
  //       name: "John",
  //       email: "john.doe@example.com",
  //       isActive: false,
  //       role: "Student",
  //       lastName: "Doe",
  //     },
  //     {
  //       _id: 3,
  //       name: "John",
  //       email: "john.doe@example.com",
  //       isActive: true,
  //       role: "Student",
  //       lastName: "Doe",
  //     },
  //     {
  //       _id: 4,
  //       name: "John",
  //       email: "john.doe@example.com",
  //       isActive: false,
  //       role: "Student",
  //       lastName: "Doe",
  //     },
  //     {
  //       _id: 5,
  //       name: "John",
  //       email: "john.doe@example.com",
  //       isActive: true,
  //       role: "Student",
  //       lastName: "Doe",
  //     },
  //   ]);
  const dropdownRef = useRef(null);

  const [dropdownOpen, setDropdownOpen] = useState(null);
  const navigate = useNavigate();
  const reduxData = useSelector((state) => state.global);
  const { profileData, IsMetting } = reduxData || {};

  const header = [
    {
      title: (
        <div className="f-center mt-4">
          <CheckBox className="" />
        </div>
      ),
      className: "wp-5 justify-content-center",
    },
    {
      title: "Profile",
      className: "wp-20 justify-content-start",
      isSort: true,
    },
    {
      title: "Account",
      className: "wp-20 justify-content-start",
      // isSort: true,
    },
    // {
    //   title: "Email",
    //   className: "wp-40 justify-content-start",
    //   isSort: false,
    // },
    {
      title: "Age",
      className: "wp-20 justify-content-start",
      isSort: false,
    },
    {
      title: "Metting link",
      className: "wp-20 justify-content-center",
      isSort: false,
    },
    {
      title: "Activity",
      className: "wp-20 justify-content-center",
      isSort: false,
    },
    {
      title: "Actions",
      className: "wp-10 justify-content-center",
      // isSort: true,
    },
  ];
  const rowData = [];
  allStudentList?.data?.forEach((elem, index) => {
    const {
      name,
      lastName,
      role,
      email,
      isActive,
      _id,
      firstName,
      teacherDetails,
      date_of_birth,
    } = elem;
    const isTeacherPresent = teacherDetails?.some(
      (ele) => ele?.teacherId === profileData?._id
    );
    const age = calculateAgeVal(date_of_birth);

    const disableF = isTeacherPresent;

    let obj = [
      {
        value: (
          <div className="f-center mt-4">
            <CheckBox className="" />
          </div>
        ),
        className: "wp-5 justify-content-center ",
      },
      {
        value: `${titleCaseString(firstName) || ""} ${
          titleCaseString(lastName) || ""
        }`,
        className: "wp-20 justify-content-start",
      },
      {
        value: `${role || "Student"}`,
        className: "wp-20 justify-content-start",
      },
      // {
      //   value: email,
      //   className: "wp-40 justify-content-start flex-wrap",
      // },
      {
        value: age,
        className: "wp-20 justify-content-start flex-wrap",
      },
      {
        value: (
          <>
            {teacherDetails?.[0]?.meeting_link && (
              <img src={icons.Right} alt="right" className="img-fluid" />
            )}
            {!teacherDetails?.[0]?.meeting_link && (
              <img src={icons.Wrong} alt="wrong" className="img-fluid" />
            )}
          </>
        ),
        className: "wp-20 justify-content-center",
      },
      {
        value: (
          <>
            {isActive && (
              <img src={icons.Right} alt="right" className="img-fluid" />
            )}
            {!isActive && (
              <img src={icons.Wrong} alt="wrong" className="img-fluid" />
            )}
          </>
        ),
        className: "wp-20 justify-content-center",
      },
      {
        value: (
          <div className="dropdown-container">
            <img
              src={dropdownOpen === index ? icons.sMenu : icons.Actionbtn}
              alt=""
              className="fit-content pointer action-btn"
              onClick={() => {
                setDropdownOpen(dropdownOpen === index ? null : index);
              }}
            />
            {dropdownOpen === index && (
              <div className="dropdown-menus" ref={dropdownRef}>
                <div
                  // className="dropdown-item"
                  className={`dropdown-item  deleteText ${
                    !disableF ? "disable-btn" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDropdownOpen(null);
                    setIsAddStudent(_id);
                    setIsAdd(true);
                  }}
                >
                  Follow
                </div>
                {/* <div
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDropdownOpen(null);
                  }}
                >
                  Chat
                </div> */}
                <div
                  // className="dropdown-item"
                  className={`dropdown-item ${!disableF ? "disable-btn" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDropdownOpen(null);
                    setStudentAssign({
                      studentName: `${firstName ? firstName : ""} ${
                        lastName ? lastName : ""
                      }`,
                      assignId: _id,
                      isVisible: true,
                    });
                  }}
                >
                  Assign skill
                </div>
                <div
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDropdownOpen(null);
                    setStudentAssign({
                      viewProfileId: _id,
                      isVisibleProfile: true,
                    });
                  }}
                >
                  View profile
                </div>

                <div
                  className={`dropdown-item ${!disableF ? "disable-btn" : ""}`}
                  // className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDropdownOpen(null);
                    navigate("/teacher/skills/student-skill", {
                      state: {
                        id: _id,
                        firstName: firstName,
                        lastName: lastName,
                      },
                    });
                  }}
                >
                  View skill
                </div>
                {profileData?.location?.locationType === "online" && (
                  <div
                    className={`dropdown-item ${
                      !disableF ? "disable-btn" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDropdownOpen(null);
                      dispatch(setIsMetting(true));
                      dispatch(setMettingData(elem));
                    }}
                  >
                    Meeting Link
                  </div>
                )}

                {/* <div
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDropdownOpen(null);
                  }}
                >
                  Skill
                </div> */}
                <div
                  // className="dropdown-item"
                  className={`dropdown-item ${!disableF ? "disable-btn" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDropdownOpen(null);
                    navigate(`/teacher/student-report`, { state: { id: _id } });
                  }}
                >
                  Report
                </div>
                <div
                  // className="dropdown-item deleteText"
                  className={`dropdown-item  deleteText ${
                    !disableF ? "disable-btn" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDeleteID(_id);
                    setDropdownOpen(null);
                  }}
                >
                  Delete
                </div>
              </div>
            )}
          </div>
        ),
        className: "wp-10 justify-content-center",
      },
    ];
    rowData.push({ data: obj });
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div id="allstudentlist-container">
      <div className="text-20-400 color-1a1a font-gilroy-sb">All Students</div>
      <div className="text-16-400 color-5151 font-gilroy-m">
        Select a student here to follow them in the Chat and Skills panels.
      </div>
      <div className="tableBlock mt-20">
        <Table
          header={header}
          row={rowData}
          min="1000px"
          isSearchInput
          totalRows={totalRows}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          //   searchVal={searchStudentName}
          onSearch={setSearchStudentName}
          //   onSearchChnage={onSearchChnage}
          handleSorting={handleSorting}
          searchPlaceholder="Search Students"
          loading={loading}
          tableTitle=""
          isExport
          isFilter
          handleExportCsv={handleExportCsv}
          exportloading={exportAllloading}
        />
      </div>

      {isAdd && (
        <ConfirmPopUp
          title="Student"
          onHide={() => {
            setIsAddStudent({});
            setIsAdd(false);
          }}
          onAdd={() => {
            handleAddStudent(isAddStudent);
          }}
        />
      )}
    </div>
  );
};

export default AllStudentList;
