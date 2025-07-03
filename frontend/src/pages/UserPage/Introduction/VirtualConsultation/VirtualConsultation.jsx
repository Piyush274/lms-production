import "./VirtualConsultation.scss";
import moment from "moment";
import { useEffect, useState } from "react";
import TimePicker from "@/components/layouts/TimePicker";
import { Button } from "@/components";
import Calendar from "@/components/layouts/Calendar/Calendar";
import {
  getProfile,
  handelAddConsultation,
  setVirtualOpen,
} from "@/store/globalSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { generateRandomColor } from "@/utils/helpers";

const VirtualConsultation = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateError, setSelectedDateError] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedTimeError, setSelectedTimeError] = useState("");

  const [isLoding, setIsLoading] = useState(false);
  const disaptch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!selectedDate) {
      setSelectedDateError("select date is required");
      return;
    }
    if (!selectedTime) {
      setSelectedTimeError("select time is required");
      return;
    }
    setIsLoading(true);
    const selectedDate2 = moment(selectedTime, "hh:mm A");
    const endDate = selectedDate2.clone().add(30, "minute").format("hh:mm A");

    const selectedDay = moment(selectedDate, "YYYY-MM-DD");
    const dayName = selectedDay.format("dddd");
    const payload = {
      date: moment(selectedDate).format("YYYY-MM-DD"),
      startTime: moment(selectedTime).format("hh:mm A"),
      endTime: endDate,
      day: dayName,
      title: "test lesson",
      colorCode: generateRandomColor(),
    };
    payload
    const res = await disaptch(handelAddConsultation(payload));
    if (res?.status === 201) {
      disaptch(setVirtualOpen(true));
      await disaptch(getProfile());
      navigate("/user/dashboard");
    }
    setSelectedDateError("");
    setSelectedTimeError("");
    setIsLoading(false);
  };

  useEffect(() => {
    if (!selectedDate) return;
    setSelectedDateError("");
  }, [selectedDate]);

  useEffect(() => {
    if (!selectedTime) return;
    setSelectedTimeError("");
  }, [selectedTime]);
  return (
    <section className="virtual-consultation-container">
      <h1 className="virtual-consultation-title">Virtual Consultation</h1>
      <p className="virtual-consultation-pra">
        Let’s schedule a time and date that works for you
      </p>
      <div className="main-div">
        <div className="row justify-content-center gy-5">
          <div className="col-lg-6">
            <div className="calender-div">
              <Calendar
                error={selectedDateError}
                setSelectedDate={setSelectedDate}
                selectedDate={selectedDate}
                date={true}
              />
            </div>
          </div>
          <div className="col-lg-6">
            <TimePicker
              setSelectedTime={setSelectedTime}
              selectedTime={selectedTime}
              error={selectedTimeError}
            />
          </div>
        </div>
      </div>
      <div className="virtual-btn">
        <Button
          textClass="text-17-400 font-gilroy-bold"
          btnStyle="og"
          btnText="Schedule Virtual Consultation "
          onClick={() => handleSubmit()}
          loading={isLoding}
          disabled={isLoding}
        />
      </div>
    </section>
  );
};

export default VirtualConsultation;
