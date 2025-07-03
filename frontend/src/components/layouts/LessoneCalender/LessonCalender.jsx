import moment from "moment";
import "./LessonCalender.scss";
import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Button from "@/components/inputs/Button";
import { icons } from "@/utils/constants";
import SelectDropDown from "../SelectDropDown";
import MetingPopUp from "../MetingPopUp";

const localizer = momentLocalizer(moment);

const LessonCalender = ({ data, scheduleData }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [date, setDate] = useState(moment());
  const [eventList, setEventList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    value: "2",
    label: "week",
  });
  const [view, setView] = useState("week");

  useEffect(() => {
    if (data && data.length > 0) {
      const generatedEvents = generateWeeklyEvents(data);
      setEventList(generatedEvents);
    }
  }, [data]);

  const generateWeeklyEvents = (data) => {
    const events = [];
    data.forEach((item) => {
      const baseStartDate = moment(item?.date);
      for (let i = 0; i < 52; i++) {
        const eventDate = baseStartDate.clone().add(i, "weeks");
        const startHour = moment(item?.start, "hh:mm A").hour();
        const startMinute = moment(item.start, "hh:mm A").minute();
        const endHour = moment(item.end, "hh:mm A").hour();
        const endMinute = moment(item.end, "hh:mm A").minute();
        events.push({
          ...item,
          title: item?.title || "Lesson",
          date: eventDate.format("YYYY-MM-DD"),
          start: eventDate
            .set({ hour: startHour, minute: startMinute })
            .toDate(),
          end: eventDate.set({ hour: endHour, minute: endMinute }).toDate(),
          bgColor: item?.bgColor || "#acdfad",
          divColor: item?.divColor || "#2faf33",
          day: item?.day,
          type: item?.type,
        });
      }
    });
    return events;
  };

  const Event = ({ event }) => {
    const handleEventClick = () => {
      if (event?.type === "virtual") {
        setSelectedEvent(event);
        setShowModal(true);
      }
    };
    return (
      <div
        className="d-flex align-items-center gap-2"
        onClick={handleEventClick}
      >
        <div
          className="w-3 h-10"
          style={{ backgroundColor: event?.divColor }}
        ></div>
        <p className="mb-0 event-text">{event.title}</p>
      </div>
    );
  };

  useEffect(() => {
    if (data && data.length > 0) {
      const generatedEvents = generateWeeklyEvents(data);
      setEventList(generatedEvents);
    }
    if (scheduleData) {
      const selectedDate = moment(scheduleData);
      const formattedDate = selectedDate.format("YYYY-MM-DD");
      const eventsOnSelectedDate = eventList.filter(
        (event) => event.date === formattedDate
      );
      setDate(selectedDate);
      if (eventsOnSelectedDate.length > 0) {
        setSelectedEvent(eventsOnSelectedDate[0]);
        setShowModal(true);
      }
    }
  }, [data, scheduleData]);

  const handleOptionClick = (option) => {
    if (option && option.label) {
      setSelectedOption(option);
      setView(option.label);
      setIsOpen(false);
    } else {
      setSelectedOption(null);
      setIsOpen(false);
    }
  };

  const optionList = [
    { value: "1", label: "day" },
    { value: "2", label: "week" },
    { value: "3", label: "month" },
  ];

  const eventStyleGetter = (event) => {
    const backgroundColor = event.bgColor || "#ffffff";
    return {
      style: {
        backgroundColor,
        color: "#000",
        padding: "5px 4px",
        overFlow: "hidden",
        borderRadius: "5px",
        display: "block",
        border: `1px solid  ${event?.divColor}`,
      },
    };
  };

  const CalendarHeaderStyled = (event) => {
    const today = new Date();
    const isActive = event?.date?.toDateString() === today.toDateString();
    const dayName = event?.label?.split(" ");
    return (
      <div className="">
        <p className="mb-4 heder-text mt-8">{dayName?.[1]}</p>
        <p
          className={`mb-6 event-text-s  text-align-center ${
            isActive ? "active-d" : ""
          }`}
        >
          {dayName?.[0]}
        </p>
      </div>
    );
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <section className="lesson-calender-container">
      <Calendar
        popup={true}
        step={15}
        timeslots={4}
        date={date}
        defaultDate={moment()}
        views={["month", "week", "day"]}
        view={view}
        defaultView="week"
        localizer={localizer}
        events={eventList}
        startAccessor="start"
        endAccessor="end"
        onNavigate={(date) => setDate(date)}
        style={{ height: "100vh", width: "100%" }}
        // onSelectEvent={handleSelectEvent}
        components={{
          event: Event,
          header: CalendarHeaderStyled,
          toolbar: (toolbar) => {
            const { date: tDate } = toolbar;
            const goToBack = () => {
              setDate(moment(tDate).subtract(1, "months"));
              toolbar.onNavigate("PREV");
            };
            const goToNext = () => {
              setDate(moment(tDate).add(1, "months"));
              toolbar.onNavigate("NEXT");
            };
            const year = moment(tDate).format("YYYY");
            const month = moment(tDate).format("MMMM");
            return (
              <div className="top-header">
                <div className="left">
                  <div className="button-d">
                    <Button
                      btnText="Today"
                      btnStyle="org-btn h-44"
                      onClick={() => {
                        setDate(moment());
                      }}
                    />
                  </div>
                  <div className="left-s">
                    <div className="left-div-img pointer" onClick={goToBack}>
                      <img
                        src={icons?.oLeftIcons}
                        alt="left-img"
                        loading="lazy"
                      />
                    </div>
                    <div className="moth-text">{`${month} ${year}`}</div>
                    <div className="right-div-img pointer" onClick={goToNext}>
                      <img
                        src={icons?.oRightIcons}
                        alt="left-img"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
                <div className="top-m">
                  <SelectDropDown
                    options={optionList}
                    placeholder="week"
                    setIsOpen={setIsOpen}
                    isOpen={isOpen}
                    toggleDropdown={toggleDropdown}
                    handleOptionClick={handleOptionClick}
                    selectedOption={selectedOption}
                  />
                </div>
              </div>
            );
          },
        }}
        eventPropGetter={eventStyleGetter}
      />
      {showModal && (
        <MetingPopUp
          selectedEvent={selectedEvent}
          onClick={() => {
            setSelectedEvent(null);
            setShowModal(false);
          }}
        />
      )}
    </section>
  );
};

export default LessonCalender;
