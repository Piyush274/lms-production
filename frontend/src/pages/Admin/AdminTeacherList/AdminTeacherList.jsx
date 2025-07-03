import {
  Button,
  CheckBox,
  DeleteConfirmation,
  UserEditPopup,
} from "@/components";
import Table from "@/components/layouts/Table";
import ViewTeacherDetailPopUp from "@/components/layouts/ViewTeacherDetailPopUp";
import {
  deleteUser,
  getUserslist,
  setShowUserEditPopup,
  setUserEditData,
  setViewTeacherDetails,
  setViewTeacherDetailsPopUp,
} from "@/store/globalSlice";
import { icons } from "@/utils/constants";
import { handleExport, titleCaseString } from "@/utils/helpers";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./AdminTeacherList.scss";
// import StudentListPopUp from "@/components/layouts/StudentListPopUp";
import { useNavigate } from "react-router-dom";

const AdminTeacherList = ({ show }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.global);
  const { showUserEditPopup, viewTeacherDetailsPop } = reduxData || {};
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);
  const [loading, setloading] = useState(false);
  const [openStudentList, setOpenStudentList] = useState("");

  const [deleteID, setDeleteID] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState(1);
  const [exportloading, setExportloading] = useState(false);

  const getUserData = async (
    page = 1,
    search = "",
    sortColumn = sortBy,
    sortOrder = order
  ) => {
    setloading(true);
    const offset = (page - 1) * rowsPerPage;
    const payload = {
      limit: rowsPerPage,
      offset,
      role: "teacher",
      search,
      sortBy: sortColumn,
      order: sortOrder,
    };
    const res = await dispatch(getUserslist(payload));
    if (res?.data?.response[0]?.data) {
      setData(res?.data?.response[0]?.data);
      setTotalRows(res?.data?.response[0]?.totalCount);
    }
    setloading(false);
  };

  const handleSorting = () => {
    const columnName = "name";
    const newOrder = order === 1 ? -1 : 1;
    setSortBy(columnName);
    setOrder(newOrder);
    getUserData(currentPage, searchTerm, columnName, newOrder);
  };
  useEffect(() => {
    getUserData();
  }, []);
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

    {
      title: "Email",
      className: "wp-30 justify-content-start",
      isSort: false,
    },

    {
      title: "Active Student Assigned",
      className: "wp-40 justify-content-start",
      isSort: false,
    },
    {
      title: "Working Hours",
      className: "wp-20 justify-content-start",
      isSort: false,
    },
    {
      title: "Location",
      className: "wp-20 justify-content-start",
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
  data?.forEach((elem, index) => {
    const {
      lastName,
      role,
      email,
      isActive,
      _id,
      firstName,
      location,
      totalWorkingHours,
      activeStudentCount,
    } = elem;
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
        value: `${role}`,
        className: "wp-20 justify-content-start",
      },
      {
        value: email,
        className: "wp-30 justify-content-start flex-wrap",
      },
      // {
      //   value: activeStudentCount ? activeStudentCount : 0,
      //   className: "wp-20 justify-content-start flex-wrap",
      //   ...(activeStudentCount > 0 && {
      //     button: <Button className="view-button">View</Button>,
      //   }),
      // },
      {
        value: (
          <div className="d-flex align-items-center gap-2">
            <span className="me-2">
              {activeStudentCount ? activeStudentCount : 0}
            </span>
            {activeStudentCount > 0 && (
              <Button
                btnStyle={"PDO"}
                onClick={() =>
                  navigate("/admin/teacher-students", {
                    state: {
                      teacherId: _id,
                    },
                  })
                }
                btnText={"View"}
              />
            )}
          </div>
        ),
        className: "wp-40 justify-content-start flex-wrap",
      },
      {
        value: totalWorkingHours ? totalWorkingHours : 0,
        className: "wp-20 justify-content-start flex-wrap",
      },
      {
        value: location?.name,
        className: "wp-20 justify-content-start flex-wrap",
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
              src={icons.Actionbtn}
              alt=""
              className="fit-content pointer action-btn"
              onClick={() => {
                setDropdownOpen(dropdownOpen === index ? null : index);
              }}
            />
            {dropdownOpen === index && (
              <div className="dropdown-menus" ref={dropdownRef}>
                <div
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dispatch(setViewTeacherDetails(elem));
                    dispatch(setViewTeacherDetailsPopUp(true));
                    setDropdownOpen(null);
                  }}
                >
                  View
                </div>
                <div
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dispatch(setUserEditData(elem));
                    dispatch(setShowUserEditPopup(true));
                    setDropdownOpen(null);
                  }}
                >
                  Edit
                </div>
                <div
                  className="dropdown-item"
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

  const handleDelete = async () => {
    const res = await dispatch(deleteUser(deleteID));
    if (res?.status === 200) {
      setCurrentPage(1);
      setDeleteID("");
      getUserData();
    }
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    getUserData(currentPage, searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, rowsPerPage, searchTerm]);

  const handleExportCsv = async () => {
    setExportloading(true);
    const payload = {
      limit: totalRows,
      offset: 0,
      role: "teacher",
    };
    const res = await dispatch(getUserslist(payload));
    const data = res?.data?.response[0]?.data;

    if (data && data.length > 0) {
      const headers = ["FirstName", "LastName", "Account", "Email", "Activity"];
      const headerKeyMap = {
        FirstName: "firstName",
        LastName: "lastName",
        Account: "role",
        Email: "email",
        Activity: "isActive",
      };
      const transformedData = data?.map((item) => {
        const transformedRow = {};
        Object.keys(headerKeyMap).forEach((header) => {
          transformedRow[header] = item[headerKeyMap[header]] || "";
        });
        return transformedRow;
      });
      handleExport(headers, transformedData, "all_teacher_list");
    }
    setExportloading(false);
  };
  return (
    <div id="admin-teacher-list">
      {deleteID && (
        <DeleteConfirmation
          title="Teacher"
          onHide={() => {
            setDeleteID("");
          }}
          onDelete={handleDelete}
        />
      )}

      {/* {openStudentList && (
        <StudentListPopUp
          title="Teacher"
          onHide={() => {
            setOpenStudentList("");
          }}
          teacherId={openStudentList}
        />
      )} */}
      {showUserEditPopup && (
        <UserEditPopup
          handleSuccess={() => {
            setCurrentPage(1);
            getUserData();
            dispatch(setUserEditData({}));
            dispatch(setShowUserEditPopup(false));
          }}
          onHide={() => {
            dispatch(setUserEditData({}));
            dispatch(setShowUserEditPopup(false));
          }}
        />
      )}

      {viewTeacherDetailsPop && (
        <ViewTeacherDetailPopUp
          onHide={() => {
            dispatch(setViewTeacherDetails({}));
            dispatch(setViewTeacherDetailsPopUp(false));
          }}
        />
      )}
      <div
        className={
          show
            ? "admin-instrument-container"
            : "admin-instrument-container active"
        }
      >
        <div className="wp-100">
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
            onSearch={setSearchTerm}
            searchPlaceholder="Search teacher"
            loading={loading}
            handleSorting={handleSorting}
            handleExportCsv={handleExportCsv}
            isFilter
            isExport
            exportloading={exportloading}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminTeacherList;
