import moment from "moment";
import "./TimePicker.scss";
import React from "react";

const TimePicker = ({ setSelectedTime, selectedTime, error }) => {
  const handleTimeClick = (time) => {
    const newTime = moment(time, "hh:mm A");
    setSelectedTime(newTime);
  };

  const getAvailableTimes = () => {
    const times = [];
    let currentTime = moment().startOf("day");

    for (let i = 0; i < 48; i++) {
      times.push(currentTime.format("hh:mm A"));
      currentTime = currentTime.add(30, "minute");
    }

    return times;
  };
  return (
    <React.Fragment>
      <section className="time-picker-container">
        <div className="time-main-div">
          <div className="top-div">
            <p className="time-select">Pick a time</p>
            <div className="row div-gap brave-scroll">
              {getAvailableTimes().map((time, index) => (
                <div className="col-sm-3 col-4" key={index}>
                  <div
                    className={`time-box ${
                      selectedTime && selectedTime.format("hh:mm A") === time
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleTimeClick(time)}
                  >
                    {time}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="last-div">
            <div className="last-inner-div">
              <div className="left-div">
                <p>Time</p>
              </div>
              <div className="right-div">
                <p>{selectedTime?.format("hh:mm A")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {error && <div className="input-error">{error}</div>}
    </React.Fragment>
  );
};

export default TimePicker;
