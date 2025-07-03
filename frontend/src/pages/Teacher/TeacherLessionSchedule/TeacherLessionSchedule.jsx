import { useEffect, useState } from "react";
import "./TeacherLessionSchedule.scss";
import moment from "moment";
import { LessonCalenderTable } from "@/components";
import LessonCalender from "@/components/layouts/LessoneCalender";
import { handelTecherSchedule } from "@/store/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { lightenHexColor } from "@/utils/helpers";

const TeacherLessionSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [TeacherSchedule, setTeacherSchedule] = useState([]);
  const reduxData = useSelector((state) => state.global);
  const { profileData } = reduxData || {};
  const dispatch = useDispatch();
  const [scheduleData, setscheduleData] = useState(null);

  const featchSchedule = async () => {
    const res = await dispatch(handelTecherSchedule(profileData?._id));
    if (res?.status === 200) {
      setTeacherSchedule(
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
    if (!profileData?._id) return;
    featchSchedule();
  }, [profileData]);

  return (
    <section id="teacherlessionschedule-container">
      <div className="row gy-4">
        <div className="col-xxl-9">
          <div className="calender-w">
            <LessonCalender
              data={TeacherSchedule}
              scheduleData={scheduleData}
            />
          </div>
        </div>
        <div className="col-xxl-3">
          <LessonCalenderTable
            setSelectedDate={setSelectedDate}
            selectedDate={selectedDate}
            TeacherSchedule={TeacherSchedule}
            setscheduleData={setscheduleData}
          />
        </div>
      </div>
    </section>
  );
};

export default TeacherLessionSchedule;
