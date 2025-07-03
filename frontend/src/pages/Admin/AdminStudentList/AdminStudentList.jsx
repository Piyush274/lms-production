import { CheckBox, DeleteConfirmation, UserEditPopup } from "@/components";
import Table from "@/components/layouts/Table";
import ViewStudentDetailsPopUp from "@/components/layouts/ViewStudentDetailsPopUp";
import ActionTaken from "@/components/layouts/ActionTaken";
import OutReach from "@/components/layouts/OutReach";
import Performance from "@/components/layouts/Performance";
import InstAssessment from "@/components/layouts/InstAssessment";
import {
  deleteUser,
  getUserslist,
  setShowUserEditPopup,
  setUserEditData,
  setViewStudentDetails,
  setViewStudentDetailsPopUp
} from "@/store/globalSlice";
import { icons } from "@/utils/constants";
import { calculateAgeVal, handleExport, storeLocalStorageData, titleCaseString } from "@/utils/helpers";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./AdminStudentList.scss";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const AdminStudentList = ({ show }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxData = useSelector((state) => state.global);
  const { showUserEditPopup, viewStudentDetailsPop } = reduxData || {};
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);
  const [loading, setloading] = useState(false);
  const [deleteID, setDeleteID] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState(1);
  const [exportloading, setExportloading] = useState(false);
  const [getActionData, setActionData] = useState("");
  const [getOutReach, setOutReach] = useState("");
  const [getPerformance, setPerformance] = useState("");
  const [getInstAssessment, setInstAssessment] = useState("");


  const getUserData = async (page = 1, search = "",   sortColumn = sortBy,
    sortOrder = order) => {
    setloading(true);
    const offset = (page - 1) * rowsPerPage;
    const payload = {
      limit: rowsPerPage,
      offset,
      role: "student",
      search,
   sortBy: sortColumn,
      order: sortOrder,
    };
    const res = await dispatch(getUserslist(payload));
    if (res?.data?.response[0]?.data) {
      setData(res?.data?.response[0]?.data);
      setTotalRows(res?.data?.response[0]?.totalCount);
      setloading(false);
    }
    setloading(false);
  };

  const handleSorting = () => {
    const columnName = "name";
    const newOrder =  order === 1 ? -1 : 1;
    setSortBy(columnName);
    setOrder(newOrder);
    getUserData(currentPage, searchTerm,columnName, newOrder);
  };

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
      title: "Registration Date",
      className: "wp-20 justify-content-start",
      isSort: false,
    },
    {
      title: "Subscription",
      className: "wp-20 justify-content-center",
      isSort: false,
    },
    {
      title: "Days From Renewal",
      className: "wp-10 justify-content-center",
      isSort: false,
    },
    {
      title: "Age",
      className: "wp-20 justify-content-start",
      isSort: false,
    },
    {
      title: "Payment status",
      className: "wp-20 justify-content-start",
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
  data?.forEach((elem, index) => {
    const {
      lastName,
      role,
      email,
      isActive,
      _id,
      paymentStatus,
      selectedPlan,
      firstName,
      date_of_birth,
      createdAt,
      hasSubscriptionPlan, 
      activePlan
      // console.log('selectedPlan', selectedPlan)
    } = elem;
      const age = calculateAgeVal(date_of_birth)
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
        value: `${titleCaseString(firstName) || ""}  ${
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
      {
        value: moment(createdAt).format("DD MMM YYYY") ,
        className: "wp-20 justify-content-start flex-wrap",
      },
      {
        value: (
          <>
            {hasSubscriptionPlan && (
              <img src={icons.Right} alt="right" className="img-fluid" />
            )}
            {!hasSubscriptionPlan && (
              <img src={icons.Wrong} alt="wrong" className="img-fluid" />
            )}
          </>
        ),
        className: "wp-20 justify-content-center",
      },
      {
        value: activePlan ? activePlan?.daysUntilRenewal :"-",
        className: "wp-10 justify-content-start flex-wrap",
      },
      {
        value: age ,
        className: "wp-20 justify-content-start flex-wrap",
      },
      {
        value: paymentStatus,
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
                    dispatch(setViewStudentDetails(elem));
                    dispatch(setViewStudentDetailsPopUp(true));
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
                    setActionData(_id);
                    setDropdownOpen(null);
                  }}
                >
                  Action Taken
                </div>
                <div
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOutReach(_id);
                    setDropdownOpen(null);
                  }}
                >
                  Outreach
                </div>
                <div
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPerformance(_id);
                    setDropdownOpen(null);
                  }}
                >
                  Performance
                </div>
                <div
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setInstAssessment(_id);
                    setDropdownOpen(null);
                  }}
                >
                  Inst Assessment
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

                {paymentStatus === "pending" && (
                  <div
                    className="dropdown-item"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      storeLocalStorageData({
                        studentData: {
                          studentName: firstName,
                          listId: _id,
                        },
                      });
                      navigate(`/admin/payment/${_id}`, {
                        state: {
                          isTrue: true,
                          studentPlan: {
                            id: _id,
                            subscribtionId: selectedPlan?._id,
                          },
                        },
                      });
                    }}
                  >
                    Pay
                  </div>
                )}
                {paymentStatus === "failed" && (
                  <div
                    className="dropdown-item"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/admin/payment/${_id}`, {
                        state: {
                          isTrue: true,
                          studentPlan: {
                            id: _id,
                            subscribtionId: selectedPlan?._id,
                          },
                        },
                      });
                    }}
                  >
                    Pay
                  </div>
                )}
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
  }, [currentPage, rowsPerPage, searchTerm]);

  const handleExportCsv = async()=>{
    setExportloading(true);
    const payload = {
      limit: totalRows,
     offset: 0,
     role: "student",
    };
    const res = await dispatch(getUserslist(payload));
    const data = res?.data?.response[0]?.data;
  
    if (data && data.length > 0) {
      const headers = ['FirstName','LastName','Account','Email','PaymentStatus','Activity']
      const headerKeyMap = {
        FirstName: "firstName",
        LastName: "lastName",
        Account: "role", 
        Email: "email",
        PaymentStatus:'paymentStatus',
        Activity: "isActive",
      };
      const transformedData = data?.map((item) => {
        const transformedRow = {};
        Object.keys(headerKeyMap).forEach((header) => {
          transformedRow[header] = item[headerKeyMap[header]] || ""; 
        });
        return transformedRow;
      });
      handleExport(headers, transformedData,'all_student_list');
    }
    setExportloading(false);
  };

  

  return (
    <div id="admin-student-list">
      {deleteID && (
        <DeleteConfirmation
          title="Student"
          onHide={() => {
            setDeleteID("");
          }}
          onDelete={handleDelete}
        />
      )}
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
      {viewStudentDetailsPop && (
        <ViewStudentDetailsPopUp
          onHide={() => {
            dispatch(setViewStudentDetails({}));
            dispatch(setViewStudentDetailsPopUp(false));
          }}
        />
      )}
      {getActionData && (
        <ActionTaken
          title="Student"
          id={getActionData}
          onHide={() => {
            setActionData(null);
          }}
        />
      )}
      {getOutReach && (
        <OutReach
          title="Student"
          id={getOutReach}
          onHide={() => {
            setOutReach(null);
          }}
        />
      )}
       {getPerformance && (
        <Performance
          title="Student"
          id={getPerformance}
          onHide={() => {
            setPerformance(null);
          }}
        />
      )}
      {getInstAssessment && (
        <InstAssessment
          title="Student"
          id={getInstAssessment}
          onHide={() => {
            setInstAssessment(null);
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
          exportloading={exportloading}
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
            searchPlaceholder="Search student"
            loading={loading}
            handleSorting={handleSorting}
            isFilter
            isExport
            handleExportCsv={handleExportCsv}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminStudentList;
