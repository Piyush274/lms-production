import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { icons } from "@/utils/constants";
import StudentStats from "./StudentStatus";
import ParentHistroyTable from "./ParentHistroyTable";
import ParantChatAndScore from "./ParantChatAndScore";
import "./Parent.scss";
import { useDispatch, useSelector } from "react-redux";
import { getchildern, getparentdashboard, getStudentDashboard } from "@/store/globalSlice";

const Parent = ({ show }) => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.global);
  const { profileData } = reduxData || {};
  const [selectedChild, setSelectedChild] = useState("");
  const [selectChildren, setSelectChildren] = useState([]);
  const [dashboarddata , setdashboarddata] =useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setSelectedChild(event.target.value);
  };

  const handleChildSelect = (childName) => {
    // Navigate to the user dashboard page for the selected child

    navigate(`/parent/dashboard/${childName?._id}`, {
      state: { childrenName: `${childName?.firstName} ${childName?.lastName}` ,id:childName?._id},
    });
  };

  const children = ["Alexander Dave", "Alexander Dave2", "Alexander Dave3"];



  const fetchChildernList = async () => {
    const res = await dispatch(getchildern());

    if (res?.status === 200) {
      setSelectChildren(res?.data?.response);
    }
  };

  const fetchdashboard = async () => {
    const res = await dispatch(getparentdashboard());

    if (res?.status === 200) {
      setdashboarddata(res?.data?.response)
    }
  };

  useEffect(() => {
    fetchChildernList();
    fetchdashboard();
  }, []);
  return (
    <>
      <div id="parentdashboad-container">
        <div className="dashboard-title">Overview</div>
        <div className="d-flex align-items-center short">
          <Dropdown className="Dropdown ml-2" style={{ padding: "0px" }}>
            <Dropdown.Toggle id="dropdown-basic">
              <div className="fa-center flex-nowrap gap-2">
                <span>Select a child to view their dashboard</span>
                <img src={icons.Dropdown} alt="short icon" className="ml-2" />
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {selectChildren?.map((child, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => handleChildSelect(child?.studentId)}
                >
                  {`${child?.studentId?.firstName} ${child?.studentId?.lastName}`}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="row gy-4">
          <div className="col-xxl-7 col-lg-12 col-12">
            <div className="d-flex flex-column gap-4">
              <StudentStats Dashboarddata={dashboarddata}/>
            </div>
          </div>
          <div className="col-xxl-5 col-lg-12 col-12">
            <ParantChatAndScore  Dashboarddata={dashboarddata}/>
          </div>
          <div className="col-12">
            <div className="d-right-div">
              <ParentHistroyTable Dashboarddata={dashboarddata}/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Parent;
