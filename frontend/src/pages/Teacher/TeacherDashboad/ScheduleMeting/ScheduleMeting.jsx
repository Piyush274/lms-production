import "./ScheduleMeting.scss";
import Calendar from "@/components/layouts/Calendar/Calendar";
import TeacherCalendar from "./TeacherCalendar";
import { useEffect, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";

const ScheduleMeting = () => {
  const reduxData = useSelector((state) => state.global);
  const { scheduleList } = reduxData || {};

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const listVal = () => {
    if (!scheduleList?.length > 0) return;
    const line = scheduleList
      ?.filter((ele) => {
        return (
          moment().day(ele.day).format("dddd") ===
          moment(selectedDate).format("dddd")
        );
      })
      .map((ele) => {
        return {
          ...ele,
          date: selectedDate,
        };
      });
    setSelectedSchedule(line);
  };

  useEffect(() => {
    listVal();
  }, [selectedDate]);

  return (
    <section className="schedule-meting-container">
      <div className="row gy-4">
        <div className="col-xxl-12">
          <div className="calender-top">
            <div className="calender-te">
              <TeacherCalendar
                rescheduleList={selectedSchedule}
                reschedule={true}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScheduleMeting;
