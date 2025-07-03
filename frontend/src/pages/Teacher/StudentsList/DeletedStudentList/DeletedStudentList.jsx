import { CheckBox } from "@/components";
import Table from "@/components/layouts/Table";
import { icons } from "@/utils/constants";
import { calculateAgeVal, titleCaseString } from "@/utils/helpers";
import { useEffect, useRef, useState } from "react";
import "./DeletedStudentList.scss";
import { useNavigate } from "react-router-dom";

const DeletedStudentList = ({
  deleteStudentList,
  deleteTotalRows,
  deleteRowsPerPage,
  setDeleteRowsPerPage,
  deleteCurrentPage,
  setDeleteCurrentPage,
  deleteLoading,
  setdeleteSearchStudent,
  handleSorting,
  setIsUnArchive,
  handleExportCsv,
  exportloading,
}) => {
  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  const [dropdownOpen, setDropdownOpen] = useState(null);

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
    //   className: "wp-30 justify-content-start",
    //   isSort: false,
    // },
    {
      title: "Age",
      className: "wp-20 justify-content-start flex-wrap",
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
  deleteStudentList?.data?.forEach((elem, index) => {
    const {
      name,
      lastName,
      role,
      email,
      isActive,
      _id,
      firstName,
      date_of_birth,
      teacherDetails,
    } = elem;
    const age = calculateAgeVal(date_of_birth);
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
      //   className: "wp-30 justify-content-start flex-wrap",
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
              <div className="dropdown-menus w-150" ref={dropdownRef}>
                {/* <div
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDropdownOpen(null);
                  }}
                >
                  Chat
                </div>
                <div
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
                  className="dropdown-item"
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
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDropdownOpen(null);
                    setIsUnArchive(_id);
                  }}
                >
                  Un-Aarchive
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
    <div id="deletedstudentlist-container">
      <div className="text-20-400 color-1a1a font-gilroy-sb">
        Deleted Students
      </div>
      <div className="tableBlock mt-20 ">
        <Table
          header={header}
          row={rowData}
          min="1000px"
          isSearchInput
          totalRows={deleteTotalRows}
          rowsPerPage={deleteRowsPerPage}
          setRowsPerPage={setDeleteRowsPerPage}
          currentPage={deleteCurrentPage}
          setCurrentPage={setDeleteCurrentPage}
          onSearch={setdeleteSearchStudent}
          handleSorting={handleSorting}
          searchPlaceholder="Search Students"
          loading={deleteLoading}
          tableTitle=""
          isExport
          isFilter
          handleExportCsv={handleExportCsv}
          exportloading={exportloading}
        />
      </div>
    </div>
  );
};

export default DeletedStudentList;
