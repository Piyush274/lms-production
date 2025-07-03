import { icons } from "@/utils/constants";
import "./SkillAssessment.scss";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Dropdown, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getDataFromLocalStorage } from "@/utils/helpers";
import { getStudentSkilldetails } from "@/store/globalSlice";
import { useDispatch } from "react-redux";
import { Roundedloader } from "@/components";

const SkillAssessment = () => {
  const disptch = useDispatch();
  const [status, setStatus] = useState("active");
  const [loading, setIsLoading] = useState(false);

  const [studentList, setStudentList] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [sortBy, setSortBy] = useState("");

  const navigate = useNavigate();

  const renderStars = (rating) => {
    const numericRating = parseFloat(rating);
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(numericRating);
    let stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} style={{ color: "#ffc107" }} />);
    }

    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key={`half-${fullStars}`} style={{ color: "#ffc107" }} />
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaStar key={`empty-${fullStars + i}`} style={{ color: "#D9D9D9" }} />
      );
    }

    return stars;
  };

  const Statusactive = (sta) => {
    setStatus(sta);
  };

  const handleUnFollowStudent = async (val) => {
    setIsLoading(true);
    const keyOrder = val && val;
    const payload = {
      sortKey: "createdAt",
      sortKeyOrder: keyOrder,
    };
    const res = await disptch(getStudentSkilldetails(payload));
    if (res?.status === 200) {
      setStudentList(res?.data?.response || []);
      getskill(res?.data?.response);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    handleUnFollowStudent();
  }, []);

  useEffect(() => {
    handleUnFollowStudent(sortBy);
  }, [sortBy]);

  const getskill = (val) => {
    if (val?.length > 0) {
      const filterConditions = {
        active: (skill) => skill?.is_active && !skill?.is_completed,
        inactive: (skill) =>
          (!skill?.is_active && !skill?.is_completed) ||
          (!skill?.is_active && skill?.is_completed),
        completed: (skill) => skill?.is_active && skill?.is_completed,
      };
      const filteredSkills = val?.filter(
        filterConditions[status] || (() => true)
      );
      setStoreData(filteredSkills);
    } else {
      setStoreData([]);
    }
  };
  
  useEffect(() => {
    getskill(studentList);
  }, [status]);

  return (
    <div id="skillContainer">
      <div className="container-fluid SkillAssessment-main">
        <div className="SkillAssessment">
          <div className="alert-title d-flex justify-content-start align-items-center">
            <div className="d-flex align-items-start">
              <img src={icons.informationImg} alt="info" />
              <span className="ps-10">
                Skills assigned by your instructor(s) will appear here. To
                complete your assignments, open the skill and upload a recording
                for your instructor to review and score.
              </span>
            </div>
          </div>
          <div className="active-container">
            <div className="d-flex flex-wrap gap-4 ">
              <div
                className="d-flex status justify-content-between brave-scroll"
                style={{ overflowX: "auto" }}
              >
                <div
                  className={`act-btn ${status === "active" ? "active" : ""}`}
                  onClick={() => Statusactive("active")}
                >
                  <span>Active</span>
                </div>
                <div
                  className={`act-btn ${status === "inactive" ? "active" : ""}`}
                  onClick={() => Statusactive("inactive")}
                >
                  <span>Inactive</span>
                </div>
                <div
                  className={`act-btn ${
                    status === "completed" ? "active" : ""
                  }`}
                  onClick={() => Statusactive("completed")}
                >
                  <span>Completed</span>
                </div>
              </div>
              <div className="d-flex align-items-start">
                <Dropdown className="Dropdown ml-2">
                  <Dropdown.Toggle id="dropdown-basic">
                    <span>Sort by</span>
                    <img
                      src={icons.shorticon}
                      alt="short icon"
                      className="ml-2"
                    />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => {
                        setSortBy(1);
                      }}
                    >
                      Most recent
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        setSortBy(-1);
                      }}
                    >
                      Least recent
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>

          <Row className="card-container row-gap-3">
            {loading ? (
              <div className="d-flex justify-content-center pt-100 pb-100">
                <Roundedloader />
              </div>
            ) : (
              <>
                {storeData?.map((item, index) => (
                  <Col xxl={3} xl={4} sm={6} key={index}>
                    <div className="skill-card border d-flex flex-column justify-content-between mx-auto">
                      <div className="d-flex justify-content-between desc-part">
                        <div>
                          <h1 className="card-title">{item?.title}</h1>
                          <p className="card-desc">{item?.description}</p>
                          <div className="star flex justify-center items-center mb-2">
                            {renderStars(item.rating || 4)}
                          </div>
                        </div>
                        <div>
                          {status === "completed" && (
                            <img
                              src={icons.complatedicon}
                              alt="icon"
                              className="img-fluid card-icon"
                            />
                          )}
                          {status === "active" && (
                            <img
                              src={icons.complatedicon}
                              alt="icon"
                              className="img-fluid card-icon"
                            />
                          )}
                          {status === "inactive" && (
                            <img
                              src={icons.inactiveicon}
                              alt="icon"
                              className="img-fluid card-icon"
                            />
                          )}
                        </div>
                      </div>
                      <div className="d-flex justify-content-between  per-part">
                        <div>
                          <h1 className="card-per d-flex align-items-center">
                            {item.per || "100%"}
                          </h1>
                        </div>
                        <div className="btn-container">
                          <button
                            className="btn-card"
                            onClick={() => {
                              navigate("/user/skill-assignments/details", {
                                state: {
                                  id: item?._id,
                                  skillId: item?.skillId,
                                  studentId: item?.studentId,
                                },
                              });
                            }}
                          >
                            Open
                          </button>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </>
            )}
          </Row>

          {!loading && storeData?.length === 0 && (
            <div className="d-flex justify-content-center pt-100 pb-100 text-20-600">
              No data found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillAssessment;
{
  /* <button className="btn-card" onClick={() => {
  if (status === "ActiveCard") {
    navigate("/user/meting-room");
  } else {
    navigate("/user/skill-assignments/details", { state: item });
  }
}}>
  Open
</button> */
}
