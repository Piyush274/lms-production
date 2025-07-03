import {
  CheckBox,
  DeleteConfirmation,
  Roundedloader,
  SearchInput,
} from "@/components";
import useDebounce from "@/hook/useDebounce";
import {
  handelAddStudent,
  handelGetAllStudentList,
  handelGetDeleteStudentList,
  handelGetStudentList,
  handelRemoveStudent,
  handelUnArchive,
  handelUnFollowStudent,
  setIsMetting,
  setMettingData,
  throwError,
} from "@/store/globalSlice";
import { icons } from "@/utils/constants";
import {
  getInitials,
  handleExport,
  titleCaseString,
  trimLeftSpace,
} from "@/utils/helpers";
import { omit } from "lodash";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AllStudentList from "./AllStudentList";
import AssignSkill from "./AssignSkill";
import DeletedStudentList from "./DeletedStudentList";
import "./StudentsList.scss";
import ViewStudentProfile from "./ViewStudentProfile";
import UnFollowConfirmation from "@/components/layouts/UnFollowConfirmation/UnFollowConfirmation";
import ActionTaken from "@/components/layouts/ActionTaken/ActionTaken";
import Performance from "@/components/layouts/Performance/Performance";
import OutReach from "@/components/layouts/OutReach/OutReach";
import InstAssessment from "@/components/layouts/InstAssessment/InstAssessment";
import UnArchiveConfirmation from "@/components/layouts/UnArchiveConfirmation";
import AddMettingPopUp from "./AddMettingPopUp";

const StudentsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [studentList, setStudentList] = useState({
    total: 0,
    offset: 0,
    limit: 20,
    search: "",
  });
  const [isLoadingStudent, setIsLoadingStudent] = useState(false);
  const [isDeleteId, setIsDeleteId] = useState(null);
  const [isActionTaken, setisActionTaken] = useState(null);
  const [isPerformance, setisPerformance] = useState(null);
  const [isOutReach, setisOutReach] = useState(null);
  const [isInstAssessment, setisInstAssessment] = useState(null);
  const [searchName, setSearchName] = useState("");
  const debouncedValue = useDebounce(searchName, 300);

  //allList

  const [searchStudentName, setSearchStudentName] = useState("");
  const debouncedStudentValue = useDebounce(searchStudentName, 300);
  const [allStudentList, setAllStudentList] = useState({
    total: 0,
    offset: 0,
    limit: 10,
    search: "",
    sortKeyOrder: 1,
    sortKey: "",
  });
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setloading] = useState(false);
  const [deleteID, setDeleteID] = useState(null);
  const [isAdd, setIsAdd] = useState(false);
  const [isAddStudent, setIsAddStudent] = useState({});
  const [sortBy, setSortBy] = useState("title");
  const [order, setOrder] = useState(1);
  const [isUnArchive, setIsUnArchive] = useState(false);
  const [studentAssign, setStudentAssign] = useState({
    studentName: "",
    isVisible: false,
    assignId: null,
    viewProfileId: null,
    isVisibleProfile: false,
  });
  const [exportAllloading, setExportAllloading] = useState(false);

  // console.log(studentAssign, "STUDNT ASSSIGN");
  //deleteList
  const [deleteSearchStudent, setdeleteSearchStudent] = useState("");
  const debouncedDeleteSearchStudent = useDebounce(deleteSearchStudent, 300);
  const [deleteStudentList, setDeleteStudentList] = useState({
    total: 0,
    offset: 0,
    limit: 10,
    search: "",
    sortKeyOrder: 1,
    sortKey: "",
  });
  const [deleteTotalRows, setDeleteTotalRows] = useState(0);
  const [deleteCurrentPage, setDeleteCurrentPage] = useState(1);
  const [deleteRowsPerPage, setDeleteRowsPerPage] = useState(10);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sortByDelete, setSortByDelete] = useState("title");
  const [orderDelete, setOrderDelete] = useState(1);
  const [exportDeleteloading, setExportDeleteloading] = useState(false);
  const reduxData = useSelector((state) => state.global);
  const { profileData, IsMetting } = reduxData || {};
  //---

  const fetchStudentList = async (obj) => {
    setIsLoadingStudent(true);
    const payload = omit(obj, ["data", "total"]);
    const res = await dispatch(handelGetStudentList(payload));

    if (res?.status === 200) {
      setStudentList((prev) => {
        return {
          ...prev,
          total: res?.data?.response?.[0]?.totalCount,
          data: res?.data?.response?.[0]?.data || {},
        };
      });
    }
    setIsLoadingStudent(false);
  };

  useEffect(() => {
    fetchStudentList(studentList);
  }, []);

  const handleUnFollowStudent = async (id) => {
    const res = await dispatch(handelUnFollowStudent({ studentId: id }));
    if (res?.status === 200) {
      setIsDeleteId(null);
      fetchAllStudentList(currentPage, allStudentList);
      fetchStudentList();
      fetchdeleteList();
    }
  };

  const handleUnArchiveStudent = async (id) => {
    const res = await dispatch(handelUnArchive({ studentId: id }));
    if (res?.status === 200) {
      setIsUnArchive(null);
      fetchdeleteList(deleteCurrentPage, deleteStudentList);
      fetchAllStudentList(currentPage, allStudentList);
    }
  };

  useEffect(() => {
    let newData = { ...studentList, search: debouncedValue };
    setStudentList(newData);
    fetchStudentList(newData);
  }, [debouncedValue]);

  const fetchAllStudentList = async (page = 1, obj) => {
    setloading(true);
    const offset = (page - 1) * rowsPerPage;
    const removeData = omit(obj, ["data", "total"]);
    const payload = {
      limit: rowsPerPage,
      offset,
      search: removeData?.search,
      sortKeyOrder: removeData?.sortKeyOrder,
      sortKey: removeData?.sortKey,
    };
    const res = await dispatch(handelGetAllStudentList(payload));

    if (res?.status === 200) {
      setTotalRows(res?.data?.response[0]?.totalCount);
      setAllStudentList((prev) => {
        return {
          ...prev,
          total: res?.data?.response?.[0]?.totalCount,
          data: res?.data?.response?.[0]?.data || {},
        };
      });
    }
    setloading(false);
  };

  const handleSorting = () => {
    const columnName = "lastName";
    let newData = { ...allStudentList };
    newData = {
      ...newData,
      sortKeyOrder: newData?.sortKeyOrder === 1 ? -1 : 1,
      sortKey: columnName,
    };
    setAllStudentList(newData);
    fetchAllStudentList(currentPage, newData);
  };

  useEffect(() => {
    fetchAllStudentList(currentPage, allStudentList);
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    let newData = { ...allStudentList, search: debouncedStudentValue };
    setAllStudentList(newData);
    fetchAllStudentList(currentPage, newData);
  }, [debouncedStudentValue]);

  const handleDeleteStudentVal = async (id) => {
    const res = await dispatch(handelRemoveStudent({ studentId: id }));

    if (res?.status === 200) {
      fetchStudentList();
      fetchdeleteList();
      fetchAllStudentList(currentPage, allStudentList);
      setDeleteID(null);
    }
  };

  const handleAddStudent = async (id) => {
    const payload = {
      studentId: id,
    };
    const res = await dispatch(handelAddStudent(payload));
    if (res?.status === 200) {
      fetchStudentList();
      fetchAllStudentList(currentPage, allStudentList);
      setIsAddStudent({});
      setIsAdd(false);
    }
  };

  const handleExportCsv = async () => {
    setExportAllloading(true);
    if (totalRows === 0) {
      dispatch(throwError("The student list was not found."));
    } else {
      const payload = {
        limit: totalRows,
        offset: 0,
      };
      const res = await dispatch(handelGetAllStudentList(payload));
      const data = res?.data?.response[0]?.data;
      if (data && data.length > 0) {
        const headers = [
          "FirstName",
          "LastName",
          "Account",
          "Email",
          "Activity",
        ];
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
            if (header === "Account") {
              transformedRow[header] = item[headerKeyMap[header]] || "Student";
            } else {
              transformedRow[header] = item[headerKeyMap[header]] || "";
            }
          });
          return transformedRow;
        });

        handleExport(headers, transformedData, "all_student_list");
      }
      setExportAllloading(false);
    }
  };

  //deleteList

  const fetchdeleteList = async (page = 1, obj) => {
    setDeleteLoading(true);
    const offset = (page - 1) * deleteRowsPerPage;
    const removeData = omit(obj, ["data", "total"]);
    const payload = {
      limit: deleteRowsPerPage,
      offset,
      search: removeData?.search,
      sortKeyOrder: removeData?.sortKeyOrder,
      sortKey: removeData?.sortKey,
    };
    const res = await dispatch(handelGetDeleteStudentList(payload));

    if (res?.status === 200) {
      setDeleteTotalRows(res?.data?.response[0]?.totalCount);
      setDeleteStudentList((prev) => {
        return {
          ...prev,
          total: res?.data?.response?.[0]?.totalCount,
          data: res?.data?.response?.[0]?.data || {},
        };
      });
    }
    setDeleteLoading(false);
  };

  const handleDeleteSorting = () => {
    const columnName = "lastName";
    const { sortKeyOrder } = deleteStudentList;
    const newData = {
      ...deleteStudentList,
      sortKeyOrder: sortKeyOrder === 1 ? -1 : 1,
      sortKey: columnName,
    };
    setDeleteStudentList(newData);
    fetchdeleteList(deleteCurrentPage, newData);
  };

  useEffect(() => {
    fetchdeleteList(deleteCurrentPage, deleteStudentList);
  }, [deleteCurrentPage, deleteRowsPerPage]);

  useEffect(() => {
    let newData = {
      ...deleteStudentList,
      search: debouncedDeleteSearchStudent,
    };
    setDeleteStudentList(newData);
    fetchdeleteList(deleteCurrentPage, newData);
  }, [debouncedDeleteSearchStudent]);

  const handleExportDeleteCsv = async () => {
    setExportDeleteloading(true);
    if (deleteTotalRows === 0) {
      dispatch(throwError("The delete student list was not found."));
    } else {
      const payload = {
        limit: deleteRowsPerPage,
        offset: 0,
      };
      const res = await dispatch(handelGetDeleteStudentList(payload));
      const data = res?.data?.response[0]?.data;
      if (data && data.length > 0) {
        const headers = [
          "FirstName",
          "LastName",
          "Account",
          "Email",
          "Activity",
        ];
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
            if (header === "Account") {
              transformedRow[header] = item[headerKeyMap[header]] || "Student";
            } else {
              transformedRow[header] = item[headerKeyMap[header]] || "";
            }
          });
          return transformedRow;
        });
        handleExport(headers, transformedData, "delete_student_list");
      }
    }
    setExportDeleteloading(false);
  };
  return (
    <div id="studentslist-container">
      <div className="fb-center mb-20 gap-3">
        <div className="text-20-400 color-1a1a font-gilroy-sb">
          Your Students
        </div>
        <div>
          <SearchInput
            value={searchName}
            id="search-students"
            placeholder={"Search Students"}
            className="mw-372 bg-f9f9 wp-100"
            onChange={(e) => {
              setSearchName(trimLeftSpace(e?.target?.value));
            }}
          />
        </div>
      </div>

      <div className="mb-30">
        {isLoadingStudent ? (
          <div className="mt-100 mb-100 d-flex justify-content-center">
            <Roundedloader type="D" size="md" />
          </div>
        ) : (
          <Row className="row-gap-3">
            {studentList?.data?.map((student, index) => {
              const {
                name,
                lastName,
                profileImage,
                selected,
                _id,
                firstName,
                teacherDetails,
              } = student || {};
              const isTeacherPresent = teacherDetails?.some(
                (ele) => ele?.teacherId === profileData?._id
              );
              const isActive = isTeacherPresent;
              return (
                <Col md={4} xl={3} key={index}>
                  <div className="cardBlock d-flex flex-column hp-100">
                    <div className="fb-center flex-nowrap flex-grow-1">
                      <div className="fa-center flex-nowrap gap-3">
                        <div>
                          <div className="w-45 h-45 f-center br-50 bg-bebe">
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
                                <div className="f-center text-16-400 color-003e font-gilroy-m">
                                  {getInitials(firstName || lastName)}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-18-400 color-1a1a font-gilroy-m">
                            {titleCaseString(firstName)}
                          </div>
                          <div className="text-18-400 color-5151 font-gilroy-m">
                            {titleCaseString(lastName)}
                          </div>
                          <div>
                            {selected && (
                              <div className="text-14-400 color-fe5c font-gilroy-m">
                                Selected
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <CheckBox checked={selected} className="s-19" />
                      </div>
                    </div>
                    <hr />
                    <div className="d-flex gap-3 flex-wrap">
                      {/* <div className="btnBlock f-center flex-nowrap gap-2 pointer">
                        <div className="text-17-400 color-5151 font-gilroy-m">
                          Chat
                        </div>
                        <div className="w-20 h-20 f-center">
                          <img src={icons.chat} alt="" className="fit-image" />
                        </div>
                      </div>
                      <div className="btnBlock f-center flex-nowrap gap-2 pointer">
                        <div className="text-17-400 color-5151 font-gilroy-m">
                          Skills
                        </div>
                        <div className="w-20 h-20 f-center">
                          <img src={icons.skill} alt="" className="fit-image" />
                        </div>
                      </div> */}
                      <div
                        className={`btnBlock f-center flex-nowrap gap-2 pointer ${
                          !isActive ? "disable-btn" : ""
                        }`}
                        onClick={() => {
                          navigate(`/teacher/student-report`, {
                            state: { id: _id },
                          });
                        }}
                      >
                        <div className="text-17-400 color-5151 font-gilroy-m">
                          Report
                        </div>
                        <div className="w-20 h-20 f-center">
                          <img
                            src={icons.bubble}
                            alt=""
                            className="fit-image"
                          />
                        </div>
                      </div>
                      <div
                        className={`btnBlock f-center flex-nowrap gap-2 pointer ${
                          !isActive ? "disable-btn" : ""
                        }`}
                        data-bs-toggle="tooltip"
                        title="Assign Skills"
                        onClick={() => {
                          setStudentAssign({
                            studentName: `${firstName ? firstName : ""} ${
                              lastName ? lastName : ""
                            }`,
                            assignId: _id,
                            isVisible: true,
                          });
                        }}
                      >
                        <img
                          src={icons.assignmentImg}
                          alt=""
                          className="fit-image h-28 w-28 "
                        />
                        {/* <div className="text-17-400 color-5151 font-gilroy-m">
                          Assign Skills
                        </div> */}
                      </div>

                      <div
                        className={`btnBlock f-center flex-nowrap gap-2 pointer ${
                          !isActive ? "disable-btn" : ""
                        }`}
                        data-bs-toggle="tooltip"
                        data-placement="bottom"
                        title="View Skill"
                        onClick={() => {
                          navigate("/teacher/skills/student-skill", {
                            state: {
                              id: _id,
                              firstName: firstName,
                              lastName: lastName,
                            },
                          });
                        }}
                      >
                        <img
                          src={icons.websiteImg}
                          alt=""
                          className="fit-image h-28 w-28 "
                        />
                        {/* <div className="text-17-400 color-5151 font-gilroy-m">
                          View Skill
                        </div> */}
                      </div>

                      <div
                        className={`btnBlock f-center flex-nowrap gap-2 pointer ${
                          !isActive ? "disable-btn" : ""
                        }`}
                        data-bs-toggle="tooltip"
                        title="View Profile"
                        onClick={() => {
                          setStudentAssign({
                            viewProfileId: _id,
                            isVisibleProfile: true,
                          });
                        }}
                      >
                        {/* <div className="text-17-400 color-5151 font-gilroy-m">
                          View Profile
                        </div> */}
                        <img
                          src={icons.paperImg}
                          alt=""
                          className="fit-image h-28 w-28 "
                        />
                      </div>
                      {profileData?.location?.locationType === "online" && (
                        <div
                          className={`btnBlock f-center flex-nowrap gap-2 pointer ${
                            !isActive ? "disable-btn" : ""
                          }`}
                          data-bs-toggle="tooltip"
                          title="View Profile"
                          onClick={() => {
                            dispatch(setIsMetting(true));
                            dispatch(setMettingData(student));
                          }}
                        >
                          {/* <div className="text-17-400 color-5151 font-gilroy-m">
                          View Profile
                        </div> */}
                          <img
                            src={icons.mettingImg}
                            alt=""
                            className="fit-image h-28 w-28 "
                          />
                        </div>
                      )}
                      <div
                        className="btnBlock redBlock f-center flex-nowrap gap-2 pointer"
                        onClick={() => setIsDeleteId(_id)}
                      >
                        <div className="text-17-400 color-1515 font-gilroy-m">
                          UnFollow
                        </div>
                        <div className="w-20 h-20 f-center">
                          <img
                            src={icons.remove}
                            alt=""
                            className="fit-image"
                          />
                        </div>
                      </div>
                      <div className="f-center flex-nowrap gap-2 pointer">
                        <div
                          className="btnBlock greenBlock f-center flex-nowrap gap-2 pointer"
                          onClick={() => setisActionTaken(_id)}
                        >
                          <div className="text-17-400 color-5ea1 font-gilroy-m">
                            Action Taken
                          </div>
                        </div>
                        <div
                          className="btnBlock greenBlock f-center flex-nowrap gap-2 pointer"
                          onClick={() => setisOutReach(_id)}
                        >
                          <div className="text-17-400 color-5ea1 font-gilroy-m">
                            Outreach
                          </div>
                        </div>
                      </div>
                      <div className="f-center flex-nowrap gap-2 pointer">
                        <div
                          className="btnBlock greenBlock f-center flex-nowrap gap-2 pointer"
                          onClick={() => setisPerformance(_id)}
                        >
                          <div className="text-17-400 color-5ea1 font-gilroy-m">
                            Performance
                          </div>
                        </div>
                        <div
                          className="btnBlock greenBlock f-center flex-nowrap gap-2 pointer"
                          onClick={() => setisInstAssessment(_id)}
                        >
                          <div className="text-17-400 color-5ea1 font-gilroy-m">
                            Inst Assessment
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        )}

        {!isLoadingStudent && studentList?.data?.length === 0 && (
          <div className="text-center text-14-600 pt-100 pb-100">
            No data found
          </div>
        )}
      </div>
      <div className="mb-30">
        <AllStudentList
          exportAllloading={exportAllloading}
          handleExportCsv={handleExportCsv}
          setStudentAssign={setStudentAssign}
          handleSorting={handleSorting}
          allStudentList={allStudentList}
          loading={loading}
          searchStudentName={searchStudentName}
          setSearchStudentName={setSearchStudentName}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          setRowsPerPage={setRowsPerPage}
          setCurrentPage={setCurrentPage}
          totalRows={totalRows}
          setDeleteID={setDeleteID}
          setIsAdd={setIsAdd}
          setIsAddStudent={setIsAddStudent}
          isAddStudent={isAddStudent}
          isAdd={isAdd}
          handleAddStudent={handleAddStudent}
        />
      </div>
      <div>
        <DeletedStudentList
          exportloading={exportAllloading}
          handleExportCsv={handleExportDeleteCsv}
          handleSorting={handleDeleteSorting}
          setdeleteSearchStudent={setdeleteSearchStudent}
          deleteSearchStudent={deleteSearchStudent}
          deleteLoading={deleteLoading}
          deleteRowsPerPage={deleteRowsPerPage}
          deleteCurrentPage={deleteCurrentPage}
          deleteTotalRows={deleteTotalRows}
          deleteStudentList={deleteStudentList}
          setDeleteCurrentPage={setDeleteCurrentPage}
          setDeleteRowsPerPage={setDeleteRowsPerPage}
          setIsUnArchive={setIsUnArchive}
        />
      </div>

      {isDeleteId && (
        <UnFollowConfirmation
          title="Student"
          onHide={() => {
            setIsDeleteId(null);
          }}
          onDelete={() => {
            handleUnFollowStudent(isDeleteId);
          }}
        />
      )}
      {deleteID && (
        <DeleteConfirmation
          title="Student"
          onHide={() => {
            setDeleteID(null);
          }}
          onDelete={() => {
            handleDeleteStudentVal(deleteID);
          }}
        />
      )}
      {isActionTaken && (
        <ActionTaken
          title="Student"
          id={isActionTaken}
          onHide={() => {
            setisActionTaken(null);
          }}
        />
      )}
      {isOutReach && (
        <OutReach
          title="Student"
          id={isOutReach}
          onHide={() => {
            setisOutReach(null);
          }}
        />
      )}
      {isPerformance && (
        <Performance
          title="Student"
          id={isPerformance}
          onHide={() => {
            setisPerformance(null);
          }}
        />
      )}
      {isInstAssessment && (
        <InstAssessment
          title="Student"
          id={isInstAssessment}
          onHide={() => {
            setisInstAssessment(null);
          }}
        />
      )}

      {studentAssign?.isVisible && (
        <AssignSkill
          data={studentAssign}
          fetchAllStudentList={fetchAllStudentList}
          fetchStudentList={fetchStudentList}
          onHide={() => {
            setStudentAssign({
              isVisible: false,
              assignId: null,
            });
          }}
        />
      )}

      {studentAssign?.isVisibleProfile && (
        <ViewStudentProfile
          data={studentAssign}
          onHide={() => {
            setStudentAssign({
              viewProfile: false,
              viewProfileId: null,
            });
          }}
        />
      )}

      {isUnArchive && (
        <UnArchiveConfirmation
          title="Student"
          onHide={() => {
            setIsUnArchive(null);
          }}
          onDelete={() => {
            handleUnArchiveStudent(isUnArchive);
          }}
        />
      )}

      {IsMetting && (
        <AddMettingPopUp
          fetchAllStudentList={fetchAllStudentList}
          fetchStudentList={fetchStudentList}
          onHide={() => {
            dispatch(setIsMetting(false));
            dispatch(setMettingData([]));
          }}
        />
      )}
    </div>
  );
};

export default StudentsList;
