import { Button, Roundedloader } from "@/components";
import ChartData from "./ChartData";
import "./Dashboard.scss";
import HistoryAndLevel from "./HistoryAndLevel";
import Instruments from "./Instruments";
import ScheduleMeting from "./ScheduleMeting";
import { useDispatch, useSelector } from "react-redux";
import {
  getStudentDashboard,
  handelGetHistory,
  handelStudentSchedule,
  setScheduleList,
} from "@/store/globalSlice";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [detailsList, setDetailsList] = useState([]);
  const [histroyList, setHistroyList] = useState([]);
  const [list, setList] = useState([]);
  const [loading, setloading] = useState(false);

  const goal = false;

  const reduxData = useSelector((state) => state.global);
  const { profileData } = reduxData || {};

  const handleUnFollowStudent = async () => {
    if (!profileData?._id) return;
    setloading(true);
    const res = await dispatch(getStudentDashboard(profileData?._id));
    if (res?.status === 200) {
      setDetailsList(res?.data?.response || []);
    }
    setloading(false);
  };

  useEffect(() => {
    handleUnFollowStudent();
  }, [profileData?._id]);

  const fetchHistory = async () => {
    if (!profileData?._id) return;

    const payload = {
      studentId: profileData?._id,
    };
    const res = await dispatch(handelGetHistory(payload));
    setHistroyList(res?.data?.response?.[0]?.data || []);
  };

  useEffect(() => {
    fetchHistory();
  }, [profileData]);

  const handelSchedule = async () => {
    const res = await dispatch(handelStudentSchedule());
    if (res?.status === 200) {
      dispatch(setScheduleList(res?.data?.response || []));
      setList(res?.data?.response || []);
    }
  };

  useEffect(() => {
    handelSchedule();
  }, []);

  return (
    <div className="dashboard-container">
      {loading ? (
        <div className="div-h f-center">
          <Roundedloader size="md" />
        </div>
      ) : (
        <div className="row gy-4">
          <div className="col-xxl-8">
            {goal ? (
              <div className="fb-center mb-16">
                <div className="dashboard-title-s">Your Goals</div>
                <div>
                  <Button btnText="View all" btnStyle="white-black-b" />
                </div>
              </div>
            ) : (
              <div className="dashboard-title">Overview</div>
            )}
            <div className="t-w">
              <div>
                <ChartData goal={goal} data={detailsList} />
              </div>
              <div className="w-i">
                <Instruments goal={goal} data={detailsList?.instruments} />
              </div>
              <div className="w-i">
                <HistoryAndLevel goal={goal} data={histroyList} />
              </div>
            </div>
          </div>
          <div className="col-xxl-4">
            <div className="d-right-div">
              <ScheduleMeting data={histroyList} list={list} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
