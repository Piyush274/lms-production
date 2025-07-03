import Table from "@/components/layouts/Table";
import {
  getTeacherStudentList,
} from "@/store/globalSlice";
import { icons } from "@/utils/constants";
import { calculateAgeVal, titleCaseString } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./TeacherStudentList.scss";
import { useLocation } from "react-router-dom";
import moment from "moment";

const TeacherStudentList = ({ show }) => {
  const dispatch = useDispatch();
  const location = useLocation()
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);


  const getUserData = async () => {
    setLoading(true);
    const res = await dispatch(getTeacherStudentList(location?.state?.teacherId));
    if (res?.data?.response) {
      setData(res?.data?.response);
    }
    setLoading(false);
  };



  const header = [
    {
      title: (
        <div className="f-center mt-4">
          {"Profile"}
        </div>
      ),
      className: "wp-20 justify-content-center",
    },
    {
      title: "Account",
      className: "wp-20 justify-content-start",
    },
    {
      title: "Email",
      className: "wp-30 justify-content-start",
      isSort: false,
    },
    {
      title: "Age",
      className: "wp-20 justify-content-start",
      isSort: false,
    },
    {
      title: "Registration Date",
      className: "wp-20 justify-content-start",
      isSort: false,
    },
    {
      title: "Activity",
      className: "wp-20 justify-content-center",
      isSort: false,
    },
  ];
  const rowData = [];
  data?.forEach((elem, index) => {
    const {
      lastName,
      role,
      email,
      isActive,
      firstName,
      date_of_birth,
      createdAt,
      // console.log('selectedPlan', selectedPlan)
    } = elem;
    const age = calculateAgeVal(date_of_birth)
    let obj = [
      {
        value: (
          <div className="f-center mt-4">
            {`${titleCaseString(firstName) || ""}  ${titleCaseString(lastName) || ""
              }`}
          </div>
        ),
        className: "wp-20 justify-content-center ",
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
        value: age,
        className: "wp-20 justify-content-start flex-wrap",
      },
      {
        value: moment(createdAt).format("DD MMM YYYY"),
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
    ];
    rowData.push({ data: obj });
  });



  useEffect(() => {
    getUserData();
  }, []);


  return (
    <div id="admin-student-list">
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
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default TeacherStudentList;
