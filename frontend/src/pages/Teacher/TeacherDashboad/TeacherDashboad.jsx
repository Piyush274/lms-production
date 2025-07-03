import { useEffect, useState } from "react";
import ChatAndScore from "./ChatAndScore";
import HistoryTable from "./HistoryTable";
import ScheduleMeting from "./ScheduleMeting";
import StudentStats from "./StudentStats";
import "./TeacherDashboad.scss";
import {
  getTeachersDetails,
  handelTecherSchedule,
  setScheduleList,
} from "@/store/globalSlice";
import { useDispatch, useSelector } from "react-redux";

const TeacherDashboad = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [teachersDetails, setTeachersDetails] = useState({});
  const reduxData = useSelector((state) => state.global);
  const { profileData } = reduxData || {};

  const featchDetails = async () => {
    setLoading(true);
    const res = await dispatch(getTeachersDetails());
    if (res?.status === 200) {
      setTeachersDetails(res?.data?.response || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    featchDetails();
  }, []);

  const featchSchedule = async () => {
    const res = await dispatch(handelTecherSchedule(profileData?._id));
    if (res?.status === 200) {
      dispatch(setScheduleList(res?.data?.response || []));
    }
  };

  useEffect(() => {
    if (!profileData?._id) return;
    featchSchedule();
  }, [profileData]);

  return (
    <div id="teacherdashboad-container">
      <div className="dashboard-title">Overview</div>
      <div className="row gy-4">
        <div className="col-xxl-9">
          <div className="d-flex flex-column gap-4">
            <StudentStats data={teachersDetails} />
            <ChatAndScore data={teachersDetails} />
            <HistoryTable />
          </div>
        </div>
        <div className="col-xxl-3">
          <div className="d-right-div">
            <ScheduleMeting />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboad;
