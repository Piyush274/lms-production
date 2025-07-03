import { icons } from "@/utils/constants";
import "./MetingPopUp.scss";
import Button from "@/components/inputs/Button";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getStudentSkilldetails,
  handelStudentGetAssignedSkill,
  markAttendance,
} from "@/store/globalSlice";

const MetingPopUp = ({ position, selectedEvent, onClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.global);
  const { profileData } = reduxData || {};
  const { role } = profileData || {};
  const {
    title,
    end,
    start,
    date,
    day,
    teachers,
    studentId,
    lessonId,
    _id,
    attendance,
  } = selectedEvent;
  const [skillList, setSkillList] = useState([]);
  const [loading, setloading] = useState(false);

  const targetDate = moment(date).format("YYYY-MM-DD");
  const hasAttendance = attendance?.find(
    (item) => moment(item.date).format("YYYY-MM-DD") === targetDate
  );

  const getSkillList = async () => {
    const payload = {
      sortKey: "createdAt",
    };
    if (role === "teacher") {
      const res = await dispatch(handelStudentGetAssignedSkill(studentId?._id));
      if (res?.status === 200) {
        setSkillList(res?.data?.response || []);
        setloading(false);
      }
    } else {
      const res = await dispatch(getStudentSkilldetails(payload));
      if (res?.status === 200) {
        setSkillList(res?.data?.response || []);
        setloading(false);
      }
    }
    setloading(false);
  };

  const getActiveStudent = skillList?.find((ele) => ele.is_active);

  const meetingStartTime = moment(date, "YYYY-MM-DD");

  const isPastMeeting = meetingStartTime.isBefore(moment(), "day");

  const handleAttendance = async (
    status,
    studentId,
    date,
    lessonId,
    studentLessonId
  ) => {
    try {
      const payload = {
        status,
        studentId,
        date,
        lessonId,
        studentLessonId,
      };

      const res = await dispatch(markAttendance(payload));

      if (res?.status === 200) {
        alert(`Marked as ${status}`);
      } else {
        alert("Something went wrong.");
      }
    } catch (error) {
      console.error("Attendance Error:", error);
      alert("Failed to update attendance.");
    }
  };

  useEffect(() => {
    setloading(true);
    getSkillList();
  }, []);

  return (
    <section
      className="meting-container"
      style={{
        position: "absolute",
        left: window.innerWidth < 768 ? "1%" : "50%",
        top: window.innerWidth < 576 ? "18%" : "14%",
        width: window.innerWidth < 768 ? "100%" : "auto",
      }}
    >
      <div className="meeting-popup">
        <div className="top-div">
          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: "15px",
                height: "18px",
                backgroundColor: selectedEvent?.divColor,
                borderRadius: "3px",
              }}
            />
            <p className="box-title">{title}</p>
          </div>
          <div className="close-div pointer" onClick={onClick}>
            <img src={icons?.closeBgImg} alt="close-img" loading="lazy" />
          </div>
        </div>
        <div className="center-div">
          <div className="d-flex align-items-center mt-16 pb-16 div-gap">
            <h3 className="center-title">
              {day}, {moment(date).format("MMMM Do")}
            </h3>
            <div className="center-label">{`Weekly on ${day}`}</div>
          </div>
          <p className="center-time">
            {moment(start).format("hh:mm A")} - {moment(end).format("hh:mm A")}
          </p>
        </div>
        <div className="learning-div">
          <div className="learning-img">
            <img src={icons?.MenuIcons} alt="img" loading="lazy" />
          </div>
          <p className="learning-title">Learning basics</p>
        </div>
        <div className="learning-name-div">
          <div className="learning-a-img">
            <img src={icons?.userMultipleImg} alt="user-img" loading="lazy" />
          </div>
          <div>
            <p className="learning-name-title">{`${
              teachers[0]?.firstName || ""
            } ${teachers[0]?.lastName || ""} ${
              role === "teacher" ? "(You)" : ""
            }`}</p>
            <p className="learning-sub">Instructor</p>
            <h6 className="learning-t">{`${studentId?.firstName || ""} ${
              studentId?.lastName || ""
            } ${role === "student" ? "(You)" : ""}`}</h6>
            <p className="learning-sub">Student</p>
          </div>
        </div>
        <div className="meting-div">
          <img
            src={icons?.videoIcons}
            alt="video-icons"
            loading="lazy"
            className="pointer"
          />
          <Button
            btnText="Join Video Meeting"
            btnStyle="btn-light-p"
            disabled={isPastMeeting || loading}
            onClick={() => {
              if (getActiveStudent?.skillId) {
                navigate(
                  role === "teacher"
                    ? "/teacher/skills/create-skill"
                    : "/user/skill-assignments/details",
                  {
                    state:
                      role === "teacher"
                        ? {
                            id: getActiveStudent?.skillId,
                            studentId: studentId?._id,
                            sSkill: true,
                            firstName: studentId?.firstName,
                            lastName: studentId?.lastName,
                            assignedId: getActiveStudent?._id,
                            isOnline: true,
                          }
                        : {
                            id: getActiveStudent?._id,
                            skillId: getActiveStudent?.skillId,
                            studentId: getActiveStudent?.studentId,
                            isOnline: true,
                          },
                  }
                );
              } else {
                navigate(
                  role === "teacher"
                    ? "/teacher/skills/create-skill"
                    : "/user/skill-assignments/details",
                  {
                    state:
                      role === "teacher"
                        ? {
                            id: null,
                            studentId: studentId?._id,
                            sSkill: true,
                            firstName: studentId?.firstName,
                            lastName: studentId?.lastName,
                            assignedId: getActiveStudent?._id,
                            isOnline: true,
                          }
                        : {
                            id: null,
                            skillId: getActiveStudent?.skillId,
                            studentId: getActiveStudent?.studentId,
                            isOnline: true,
                          },
                  }
                );
              }
            }}
          />
          <img
            src={icons?.copyIcons}
            alt="copy-icons"
            loading="lazy"
            className="pointer"
          />
        </div>
        <div className="btn-group">
          {!hasAttendance && profileData.role == "teacher" ? (
            <>
              <Button
                disabled={!isPastMeeting}
                btnStyle="btn-green"
                btnText="Present"
                onClick={() =>
                  handleAttendance(
                    "present",
                    studentId?._id,
                    moment(date).format("YYYY-MM-DD"),
                    lessonId,
                    _id
                  )
                }
              />
              <Button
                disabled={!isPastMeeting}
                btnStyle="btn-red"
                btnText="Absent"
                onClick={() =>
                  handleAttendance(
                    "absent",
                    studentId?._id,
                    moment(date).format("YYYY-MM-DD"),
                    lessonId,
                    _id
                  )
                }
              />
              <Button btnStyle="org-btn-47" btnText="Reschedule" />
            </>
          ) : hasAttendance && hasAttendance.status === "present" ? (
            <Button btnStyle="btn-green" btnText="Marked Present" disabled />
          ) : hasAttendance && hasAttendance.status === "absent" ? (
            <Button btnStyle="btn-red" btnText="Marked Absent" disabled />
          ) : hasAttendance && hasAttendance.status === "cancel" ? (
            <Button btnStyle="btn-red" btnText="Cancelled Lesson" disabled />
          ) :(
            <>
              <Button
                btnStyle="btn-blue"
                btnText="Pending Attendence"
                disabled
              />
              {!isPastMeeting ? (
                <Button
                  btnStyle="org-btn-47"
                  btnText="Cancel Lesson"
                  onClick={() =>
                    handleAttendance(
                      "cancel",
                      studentId?._id,
                      moment(date).format("YYYY-MM-DD"),
                      lessonId,
                      _id
                    )
                  }
                />
              ) : (
                ""
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default MetingPopUp;
