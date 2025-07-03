import moment from "moment";
import "./ScheduleMeting.scss";
import { useEffect, useState } from "react";
import { icons, images } from "@/utils/constants";
import Calendar from "@/components/layouts/Calendar/Calendar";
import { useSelector } from "react-redux";

const ScheduleMeting = ({ data, date, list }) => {
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
        <div className="col-xxl-12 col-md-6">
          <div className="calender-top">
            <div className="calender-te">
              <Calendar
                rescheduleList={selectedSchedule}
                reschedule={true}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </div>
          </div>
        </div>
        <div className="col-xxl-12 col-md-6">
          <div className="schedule-div">
            <h4 className="schedule-title">Statistics</h4>
            <div className="row">
              {scheduleList?.map((ele, index) => {
                const { images, time, title } = ele;
                return (
                  <div className="col-xxl-6" key={index}>
                    <div className={`schedule-card schedule-card-${index + 1}`}>
                      <div className={`schedule-card-${index + 1}`} />
                      <p className="last-title">{title}</p>
                      <div className="schedule-last">
                        <img src={images} alt="icons" loading="lazy" />
                        <p>{time}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScheduleMeting;
