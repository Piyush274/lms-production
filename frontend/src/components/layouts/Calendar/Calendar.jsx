import moment from "moment";
import "./Calendar.scss";
import { icons } from "@/utils/constants";
import React, { useState, useEffect } from "react";
import Button from "@/components/inputs/Button";
import { useDispatch, useSelector } from "react-redux";
import { getStudentSkilldetails } from "@/store/globalSlice";
import { useNavigate } from "react-router-dom";

const Calendar = ({
  setSelectedDate,
  selectedDate,
  reschedule,
  rescheduleList,
  date,
  leftTime,
  sheduleList,
  error,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.global);
  const { scheduleList } = reduxData || {};
  const [studentList, setStudentList] = useState([]);
  const [loading, setloading] = useState(false);

  const headBar = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const [currentDate, setCurrentDate] = useState(moment());

  // Function to handle month navigation
  const handleMonth = (monthType) => {
    const updatedDate = currentDate
      .clone()
      .add(monthType === "NEXT" ? 1 : -1, "month");
    setCurrentDate(updatedDate);
    setSelectedDate(null);
  };

  const getStudentiList = async () => {
    const payload = {
      sortKey: "createdAt",
    };
    const res = await dispatch(getStudentSkilldetails(payload));
    if (res?.status === 200) {
      setStudentList(res?.data?.response || []);
      setloading(false);
    }
    setloading(false);
  };

  const getActiveStudent = studentList?.find((ele) => ele.is_active);

  useEffect(() => {
    setloading(true);
    getStudentiList();
  }, []);

  // Calculate start and end of month, blank boxes for layout
  const startOfMonth = currentDate.clone().startOf("month");
  const monthLastDay = currentDate.clone().endOf("month").date();
  const blankBoxes = startOfMonth.day() === 0 ? 6 : startOfMonth.day() - 1;

  return (
    <React.Fragment>
      <div className="calender-container">
        <div className="fb-center mb-32">
          <span className="month-date">{currentDate.format("MMMM YYYY")}</span>
          <div className="f-center gap-3">
            <div
              className="h-10 w-10 pointer f-center"
              onClick={() => handleMonth("PREV")}
            >
              <img src={icons?.previousImg} className="fit-image" />
            </div>
            <div
              className="h-10 w-10 pointer f-center"
              onClick={() => handleMonth("NEXT")}
            >
              <img src={icons?.NextImg} className="fit-image" />
            </div>
          </div>
        </div>

        {/* Render Headings */}
        <div className="head-block">
          {headBar.map((day, index) => (
            <span key={index}>{day}</span>
          ))}
        </div>

        {/* Render Calendar Days */}
        <div className="body-block">
          {/* Blank boxes for alignment */}
          {Array.from({ length: blankBoxes }).map((_, index) => (
            <span key={index} className="blank-boxe" />
          ))}
          {/* Days of the month */}
          {Array.from({ length: monthLastDay }).map((_, index) => {
            const renderDay = index + 1;

            const newDate = moment(
              `${renderDay}-${currentDate.format("MM-YYYY")}`,
              "DD-MM-YYYY"
            );
            const isActive = selectedDate?.isSame(newDate, "day");

            const isToday = moment().isSame(newDate, "day");

            const earliestMeeting = scheduleList
              .map((meeting) => moment(meeting.date, "YYYY-MM-DD"))
              .sort((a, b) => a - b);

            const isScheduled = earliestMeeting.some((meetingDay) => {
              const oneYearLater = meetingDay.clone().add(1, "year");
              return (
                moment(newDate).isSameOrAfter(meetingDay, "day") &&
                moment(newDate).isBefore(oneYearLater, "day") &&
                newDate.day() === meetingDay.day()
              );
            });
            return (
              <span
                key={index}
                className={`${!isActive && isToday ? "today-date" : ""} ${
                  isActive ? "same-date" : ""
                } ${
                  isScheduled
                    ? isActive
                      ? "scheduled-lesson-active"
                      : isToday
                      ? "today-date"
                      : "scheduled-lesson"
                    : ""
                }`}
                onClick={() => {
                  if (isScheduled) setSelectedDate(newDate);
                  setSelectedDate(newDate);
                }}
              >
                <span>{renderDay}</span>
              </span>
            );
          })}
        </div>
        {date && (
          <div className="last-div">
            <div className="left-div">
              <p>Date</p>
            </div>
            <div className="right-div">
              <p>{selectedDate?.format("dddd, MMMM D, YYYY")}</p>
            </div>
          </div>
        )}
        {reschedule && (
          <div className="reschedule-div brave-scroll">
            {rescheduleList?.map((ele, index) => {
              const { startTime, endTime, studentId, date } = ele;

              const meetingStartTime = moment(date, "DD-MM-YYYY");

              const isPastMeeting = meetingStartTime
                .startOf("day")
                .isSame(moment().startOf("day"))
                ? false
                : meetingStartTime.isBefore(moment());

              return (
                <div className="meting-div" key={index}>
                  <h3 className="meting-title">
                    {isPastMeeting
                      ? "Past Schedule"
                      : meetingStartTime
                          .startOf("day")
                          .isSame(moment().startOf("day"))
                      ? "Today Schedule"
                      : "Upcoming Schedule"}
                  </h3>
                  <div className="meting-card">
                    <p className="meting-pra">
                      Your lesson with -{" "}
                      <span>
                        {studentId?.firstName} {studentId?.lastName}
                      </span>
                    </p>
                    {leftTime && (
                      <div className="time-left-div">Starts in 30 minutes</div>
                    )}
                  </div>
                  <div className="time-text">{`${moment(date).format(
                    "dddd Do, MMMM"
                  )} ${startTime} - ${endTime}`}</div>
                  <div className="btn-s">
                    <Button
                      btnStyle="og-1 h-37"
                      btnText="Join meeting"
                      disabled={isPastMeeting || loading}
                      loading={loading}
                      onClick={() => {
                        if (getActiveStudent?.skillId) {
                          navigate("/user/skill-assignments/details", {
                            state: {
                              id: getActiveStudent?._id,
                              skillId: getActiveStudent?.skillId,
                              studentId: getActiveStudent?.studentId,
                              isOnline: true,
                            },
                          });
                        }
                      }}
                    />
                    <Button
                      btnStyle="og-w h-37"
                      btnText="Reschedule"
                      textClass="text-16-400 font-gilroy-m"
                      disabled={isPastMeeting ? false : true}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {sheduleList?.length > 0 && (
          <div className="shedule-list brave-scroll mt-10">
            {sheduleList?.map((item, index) => (
              <div key={index}>
                <hr className="event-hr" />
                <div className="d-flex flex-column gap-1 pointer">
                  <div className="text-16-400 color-1a1a font-gilroy-m">
                    <div>
                      <span>Lesson with - </span>
                      <span className="font-gilroy-bold">{item.title}</span>
                    </div>
                  </div>
                  <div className="text-16-400 color-5151 fa-center gap-3">
                    <div>{item.date}</div>
                    <div>{item.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <div className="input-error">{error}</div>}
    </React.Fragment>
  );
};

export default Calendar;
