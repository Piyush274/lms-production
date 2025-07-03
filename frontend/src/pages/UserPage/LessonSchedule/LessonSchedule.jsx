import LessonCalender from "@/components/layouts/LessoneCalender";
import LessonCalenderTable from "@/components/layouts/LessonCalenderTable";
import "./LessonSchedule.scss";
import { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { handelStudentSchedule } from "@/store/globalSlice";
import { lightenHexColor } from "@/utils/helpers";

const LessonSchedule = () => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(moment());
  const [eventList, SetEventList] = useState([]);
  const [scheduleData, setscheduleData] = useState(null);

  const fetchLessonSchedule = async () => {
    const res = await dispatch(handelStudentSchedule({}));
    if (res?.status === 200) {
      SetEventList(
        res?.data?.response.map((ele) => {
          const startDate = moment(
            `${ele.date}T${moment(ele.startTime, "hh:mm A").format("HH:mm")}`
          );
          const endDate = moment(
            `${ele.date}T${moment(ele.endTime, "hh:mm A").format("HH:mm")}`
          );
          return {
            ...ele,
            id: ele._id,
            title: ele?.lessonId?.title,
            start: startDate.toDate(),
            end: endDate.toDate(),
            bgColor: lightenHexColor(ele?.lessonId?.colorCode, 0.6),
            date: moment(ele?.date).format("YYYY-MM-DD"),
            day: ele?.day,
            divColor: ele?.lessonId?.colorCode,
            type: ele?.lessonId?.type,
          };
        })
      );
    }
  };

  useEffect(() => {
    fetchLessonSchedule();
  }, []);

  return (
    <section className="lesson-schedule-container">
      <div className="row gy-4">
        <div className="col-xxl-9">
          <div className="calender-w">
            <LessonCalender data={eventList} scheduleData={scheduleData} />
          </div>
        </div>
        <div className="col-xxl-3">
          <LessonCalenderTable
            setSelectedDate={setSelectedDate}
            selectedDate={selectedDate}
            TeacherSchedule={eventList}
            setscheduleData={setscheduleData}
          />
        </div>
      </div>
    </section>
  );
};

export default LessonSchedule;
