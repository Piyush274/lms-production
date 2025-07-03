import { Button, Roundedloader } from "@/components";
import ChartData from "./ChartData";
import "./ParentDashBoard.scss";
import HistoryAndLevel from "./HistoryAndLevel";
import Instruments from "./Instruments";
import ScheduleMeting from "./ScheduleMeting";
import { icons } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { getStudentDashboard, handelGetHistory } from "@/store/globalSlice";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ParentDashBoard = () => {
  const location = useLocation();
  const { state } = location;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [details, setDetails] = useState([]);
  const [lodaing, setLoading] = useState(false);

  const [HistroyList, setHistroyList] = useState([]);
  const fetchHistory = async () => {
    if (!state?.id) return;

    const payload = {
      studentId: state?.id,
    };
    const res = await dispatch(handelGetHistory(payload));
    setHistroyList(res?.data?.response?.[0]?.data || []);
  };

  useEffect(() => {
    fetchHistory();
  }, [state?.id]);

  //  const goal = false;
  const handleUnFollowStudent = async () => {
    if (!state?.id) return;
    setLoading(true);
    const res = await dispatch(getStudentDashboard(state?.id));
    if (res?.status === 200) {
      setDetails(res?.data?.response || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleUnFollowStudent();
  }, [state?._id]);

  return (
    <div className="parentdashboard-container">
      {lodaing ? (
        <div className="f-center loader-w">
          <Roundedloader size="md" />
        </div>
      ) : (
        <div className="row gy-4">
          <div className="col-xxl-8">
            {/* {goal ? (
            <div className="fb-center mb-16">
              <div className="dashboard-title-s">Your Goals</div>
              <div>
                <Button btnText="View all" btnStyle="white-black-b" />
              </div>
            </div>
          ) : ( */}
            <div className="dashboard-title">Overview</div>
            {/* )} */}
            <div className="fa-center gap-4" style={{ marginBottom: "16px" }}>
              <Button
                btnText="Back"
                btnStyle="btn-l-g"
                leftIcon={icons.backicon}
                onClick={() => {
                  navigate(-1);
                }}
              />
              <Button
                btnText={`${state?.childrenName}`}
                btnStyle="BB"
                className="btn-f-s"
              />
              <img
                src={icons.Atteachimg}
                alt="Atteachimg"
                className="img-fluid"
              />
            </div>
            <div className="t-w">
              <div>
                <ChartData data={details} />
              </div>
              <div className="w-i">
                <Instruments data={details?.instruments} />
              </div>
              <div className="w-i">
                <HistoryAndLevel HistroyList={HistroyList} />
              </div>
            </div>
          </div>
          <div className="col-xxl-4">
            <div className="d-right-div">
              <ScheduleMeting data={HistroyList} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashBoard;
