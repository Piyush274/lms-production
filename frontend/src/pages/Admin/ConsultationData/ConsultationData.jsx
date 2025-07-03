import "./ConsultationData.scss";

import { CheckBox } from "@/components";
import Table from "@/components/layouts/Table";
import {
  deleteUser,
  getUserslist,
  handelGetConsultation,
  setShowUserEditPopup,
  setUserEditData,
  setViewStudentDetails,
  setViewStudentDetailsPopUp,
} from "@/store/globalSlice";
import { icons } from "@/utils/constants";
import {
  storeLocalStorageData,
  titleCaseString,
} from "@/utils/helpers";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const ConsultationData = ({ show }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState("");
  const [loading, setloading] = useState(false);

  const getUserData = async (
    search = "",
    
  ) => {
    setloading(true);
    const payload = {
        search,
    };
    const res = await dispatch(handelGetConsultation(payload));
    if (res?.data?.response[0]?.data) {
      setData(res?.data?.response[0]?.data);
    }
    setloading(false);
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
      className: "wp-25 justify-content-start",
      isSort: false,
    },
   
    {
      title: "Email",
      className: "wp-30 justify-content-start",
      isSort: false,
    },
    {
      title: "Select date",
      className: "wp-25 justify-content-start",
      isSort: false,
    },
    {
      title: "Select time",
      className: "wp-25 justify-content-start",
      isSort: false,
    },
  
  ];
  const rowData = [];
  data?.forEach((elem, index) => {
    const {
        studentDetails,
        date
        ,startTime

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
        value: `${titleCaseString(studentDetails?.firstName) || ""}  ${
          titleCaseString(studentDetails?.lastName) || ""
        }`,
        className: "wp-25 justify-content-start",
      },
 
      {
        value: studentDetails?.email,
        className: "wp-30 justify-content-start flex-wrap",
      },
      {
        value: date,
        className: "wp-25 justify-content-start flex-wrap",
      },
      {
        value: startTime,
        className: "wp-25 justify-content-start flex-wrap",
      },
   
   
    ];
    rowData.push({ data: obj });
  });

useEffect(()=>{
    getUserData(searchTerm)
},[searchTerm])



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
            setCurrentPage={setCurrentPage}
            row={rowData}
            min="1000px"
            isSearchInput
            onSearch={setSearchTerm}
            searchPlaceholder="Search student"
            loading={loading}
            // isFilter
            // isExport
          />
        </div>
      </div>
    </div>
  );
};

export default ConsultationData;
