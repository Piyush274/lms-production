import moment from "moment";
import "./LessonCalenderTable.scss";
import { icons } from "@/utils/constants";
import { useState } from "react";

const LessonCalenderTable = ({
  setSelectedDate,
  selectedDate,
  TeacherSchedule,
  setscheduleData,
}) => {
  const [currentDate, setCurrentDate] = useState(moment());
  const headBar = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const handleMonth = (monthType) => {
    const updatedDate = currentDate
      .clone()
      .add(monthType === "NEXT" ? 1 : -1, "month");
    setCurrentDate(updatedDate);
    setSelectedDate(null);
  };

  const startOfMonth = currentDate.clone().startOf("month");
  const monthLastDay = currentDate.clone().endOf("month").date();
  const blankBoxes = startOfMonth.day() === 0 ? 6 : startOfMonth.day() - 1;

  return (
    <section className="lesson-calender-table-container">
      <div className="top-c">
        <div className="fb-center gap-3 flex-nowrap">
          <div
            className="h-10 w-10 pointer f-center"
            onClick={() => {
              handleMonth("PREV");
            }}
          >
            <img src={icons?.previousImg} className="fit-image mb-8" />
          </div>
          <span className="month-date">{currentDate?.format("MMMM YYYY")}</span>
          <div
            className="h-10 w-10 pointer f-center"
            onClick={() => {
              handleMonth("NEXT");
            }}
          >
            <img src={icons?.NextImg} className="fit-image mb-8" />
          </div>
        </div>
      </div>
      <div className="head-block">
        {headBar.map((day, index) => (
          <span key={index}>{day}</span>
        ))}
      </div>
      <div className="body-block">
        {Array.from(Array(blankBoxes)?.keys())?.map((_, index) => {
          return <span key={index} className="blank-boxe" />;
        })}
        {Array.from(Array(monthLastDay)?.keys())?.map((_, index) => {
          const renderDay = index + 1;
          const newDate = moment(
            `${renderDay}-${currentDate.format("MM-YYYY")}`,
            "DD-MM-YYYY"
          );
          const isActive = selectedDate?.isSame(newDate, "day");

          const isToday = moment().isSame(newDate, "day");

          const earliestMeeting = TeacherSchedule?.map((meeting) =>
            moment(meeting.date, "YYYY-MM-DD")
          ).sort((a, b) => a - b);

          const isScheduled = earliestMeeting?.some((meetingDay) => {
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
                setSelectedDate(newDate);
                if (isScheduled) {
                  setscheduleData(newDate);
                } else {
                  setscheduleData(null);
                }
              }}
            >
              <span>{renderDay}</span>
            </span>
          );
        })}
      </div>
    </section>
  );
};

export default LessonCalenderTable;
