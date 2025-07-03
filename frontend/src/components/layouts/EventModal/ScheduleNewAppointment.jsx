import { Button, CheckBox } from "@/components";
import { setShowNewShedule } from "@/store/globalSlice";
import { icons } from "@/utils/constants";
import { useDispatch } from "react-redux";

const appointments = [
  {
    id: 1,
    startTime: "3:00",
    endTime: "3:30",
    date: "Thursday, October 10, 2024",
    studentName: "Alexander Dave 12345",
    lessonDetails: "Keyboard lesson - Manhattan (M) Joshua Lombardi",
    duration: "30 mins",
    borderClass: "borderLineBlue",
  },
  {
    id: 2,
    startTime: "3:00",
    endTime: "3:30",
    date: "Thursday, October 10, 2024",
    studentName: "Alexander Dave 12345",
    lessonDetails: "Keyboard lesson - Manhattan (M) Joshua Lombardi",
    duration: "30 mins",
    borderClass: "borderLineSky",
  },
];

const ScheduleNewAppointment = () => {
  const dispatch = useDispatch();
  return (
    <div>
      <div className="fb-center flex-nowrap gap-3 mb-20">
        <div
          className="fa-center flex-nowrap gap-2 bg-e6e6 br-4 ps-10 pe-10 pt-5 pb-5 pointer"
          onClick={() => dispatch(setShowNewShedule(false))}
        >
          <div className="w-12 h-12 f-center">
            <img src={icons.eBack} className="fit-image" alt="" />
          </div>
          <div>Back</div>
        </div>
        <div className="fb-center gap-3 flex-nowrap">
          <div className="fa-center gap-2">
            <div className="btnBlock f-center">Schedule</div>
            <div className="btnBlock f-center">Edit</div>
            <div className="btnBlock f-center">Ban</div>
            <div className="btnBlock f-center">Print</div>
          </div>
          <div className="w-28 h-28 f-center pointer">
            <img src={icons.redDelete} className="fit-image" alt="" />
          </div>
        </div>
      </div>
      <div className="d-flex flex-column gap-2 pointer">
        <div className="fa-center gap-2">
          <div className="text-20-400 color-1a1a font-gilroy-m">
            Alexander Dave 12345
          </div>
        </div>
        <div className="fa-center gap-2">
          <div className="w-17 h-17 pointer f-center">
            <img src={icons.eCall} className="fit-image" alt="" />
          </div>
          <div className="text-16-400 color-5151 font-gilroy-m">
            +1234567890
          </div>
        </div>
        <div className="fa-center gap-2">
          <div className="w-17 h-17 pointer f-center">
            <img src={icons.eMail} className="fit-image" alt="" />
          </div>
          <div className="text-16-400 color-5151 font-gilroy-m">
            example@gmail.com
          </div>
        </div>
      </div>
      <hr className="event-hr" />
      <div className="d-flex flex-column gap-1 pointer">
        <div className="text-16-400 color-aoao font-gilroy-m mb-">
          Notes about this appointment
        </div>
        <div className="text-16-400 color-1a1a font-gilroy-m">No notes</div>
      </div>
      <hr className="event-hr" />
      <div className="d-flex flex-column gap-1 pointer">
        <div className="text-16-400 color-aoao font-gilroy-m mb-">
          Intake Forms
        </div>
        <div className="text-16-400 color-1a1a font-gilroy-m">
          No Intake Forms
        </div>
      </div>
      <hr className="event-hr" />
      <div className="d-flex flex-column gap-2 pointer">
        <div className="fa-center gap-3">
          <div className="text-16-400 color-1a1a font-gilroy-m mb-">
            Upcoming Appointments
          </div>
          <div className="w-35 h-23 text-16-400 font-gilroy-m color-aoao br-10 bg-e9e9 f-center">
            20
          </div>
        </div>
        <div className="fa-center gap-2 flex-nowrap">
          <div className="f-center">
            <CheckBox />
          </div>
          <div className="text-14-400 color-5151 font-gilroy-m">
            Show 3 canceled appointments.
          </div>
        </div>
      </div>
      <hr className="event-hr" />
      <div className="fb-center flex-nowrap gap-3 mb-20">
        <div className="fa-center gap-2 flex-nowrap">
          <div className="f-center">
            <CheckBox />
          </div>
          <div className="text-14-400 color-5151 font-gilroy-m">Select all</div>
        </div>
        <div className="fb-center flex-nowrap gap-2">
          <Button
            btnText="Reschedule selected"
            className="h-34 text-14-400"
            btnStyle={false ? "PD" : "PDD"}
          />
          <Button
            btnText="Cancel selected"
            className="h-34 text-14-400"
            btnStyle={false ? "PDO" : "PDDD"}
          />
        </div>
      </div>
      <div className="appBlock brave-scroll">
        {appointments?.map((appointment) => {
          const {
            startTime,
            endTime,
            date,
            studentName,
            lessonDetails,
            duration,
            borderClass,
          } = appointment || {};
          return (
            <div key={appointment?.id} className="appointmentBlock mb-20">
              <div className="d-flex justify-content-between flex-nowrap gap-3">
                <div className="d-flex gap-3">
                  <div className="mt-4">
                    <CheckBox />
                  </div>
                  <div className="d-flex align-items-center flex-column">
                    <div className="text-16-400 color-5151 font-gilroy-m">
                      {startTime}
                    </div>
                    <div className="lineBlock"></div>
                    <div className="text-16-400 color-5151 font-gilroy-m">
                      {endTime}
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className={borderClass}></div>
                    <div className="ps-14 flex-grow-1 d-flex flex-column gap-1">
                      <div className="text-16-400 color-5151 font-gilroy-m">
                        {date}
                      </div>
                      <div className="fa-center gap-2">
                        <div className="w-17 h-17 pointer f-center">
                          <img
                            src={icons.eStudent}
                            className="fit-image"
                            alt=""
                          />
                        </div>
                        <div className="text-16-400 color-1a1a font-gilroy-m">
                          {studentName}
                        </div>
                      </div>
                      <div className="text-16-400 color-5151 font-gilroy-m">
                        {lessonDetails}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-14-400 color-aoao text-nowrap">
                  {duration}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleNewAppointment;
