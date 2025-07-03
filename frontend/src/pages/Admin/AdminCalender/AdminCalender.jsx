import "./AdminCalender.scss";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import {
  Button,
  EventModal,
  FilterContent,
  LessonCalenderTable,
} from "@/components";
import { icons } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, momentLocalizer } from "react-big-calendar";
import {
  getLessonSchedule,
  handelGetTeacherList,
  handleGetLocation,
  setShowEvenModal,
} from "@/store/globalSlice";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AddEventForm from "./AddEventForm";
import { lightenHexColor } from "@/utils/helpers";

// Set up localizer for react-big-calendar using moment.js
const localizer = momentLocalizer(moment);

const AdminCalender = ({ show }) => {
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const filterRef = useRef(null);
  const reduxData = useSelector((state) => state.global);
  const { showEvenModal, locationList } = reduxData || {};

  // Calendar and UI state
  const [date, setDate] = useState(moment()); // Current calendar date
  const [view, setView] = useState("day"); // Calendar view (day/week/month)
  const [events, setEvents] = useState([]); // All calendar events
  const [showDropdown, setShowDropdown] = useState(false); // View dropdown
  const [filterDropdown, setfilterDropdown] = useState(false); // Filter dropdown
  const [filterList, setFilterList] = useState({
    instructors: [],
    locations: [],
  });
  const [showInstructors, setShowInstructors] = useState(true);
  const [showLocations, setShowLocations] = useState(false);

  // Modal state and handlers for adding events
  const [showEventModal, setShowEventModal] = useState(false); // Show/hide AddEventForm
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: moment().format("YYYY-MM-DDTHH:mm"),
    end: moment().add(1, "hours").format("YYYY-MM-DDTHH:mm"),
    resource: "keyboard",
    resourceId: "",
  });

  // Handle changes in AddEventForm fields
  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  // Add new event to calendar with yellow background
  const handleEventSubmit = () => {
    const startDate = moment(newEvent.start, "YYYY-MM-DDTHH:mm").toDate();
    const endDate = moment(newEvent.end, "YYYY-MM-DDTHH:mm").toDate();
    const newEventWithDate = {
      ...newEvent,
      start: startDate,
      end: endDate,
      resourceId: newEvent.resourceId,
      bgColor: '#ffe066',
    };
    setEvents([...events, newEventWithDate]);
    setShowEventModal(false);
    setNewEvent({
      title: "",
      start: moment().format("YYYY-MM-DDTHH:mm"),
      end: moment().add(1, "hours").format("YYYY-MM-DDTHH:mm"),
      resource: "keyboard",
      resourceId: "",
    });
  };

  // Lists for teachers and locations
  const [teacherList, setTeacherList] = useState([]);
  const [locationTeList, setLocationTeList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Change calendar view (day/week/month)
  const handleViewChange = (newView) => {
    setView(newView);
    setShowDropdown(false);
  };

  // Custom wrapper for date cells to allow event creation
  const CustomDateCellWrapper = ({ children }) => {
    return (
      <div
        className="ms-10 me-10"
        onClick={() => dispatch(setShowEvenModal(true))}
      >
        {children}
      </div>
    );
  };

  // Custom header for calendar days
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setfilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, filterRef]);

  // Fetch lesson events and teacher/location lists from backend
  const fetchLessonDetails = async () => {
    // setLoading(true);
    const res = await dispatch(getLessonSchedule());
    if (res?.status === 200) {
      // Flattening teachers and mapping them
      const allTeachers = [];
      const seenTeacherIds = new Set();
      res?.data?.response?.forEach((ele) => {
        ele?.teachers?.forEach((teacher) => {
          if (teacher?._id && !seenTeacherIds.has(teacher?._id)) {
            seenTeacherIds.add(teacher?._id);
            allTeachers.push({
              resourceId: teacher?._id,
              resourceTitle: `${teacher?.firstName} ${teacher?.lastName}`,
            });
          }
        });
      });

      // Map lesson events
      const lessonEvents = res?.data?.response?.map((ele) => {
        const startDate = moment(
          `${ele.date}T${moment(ele.startTime, "hh:mm A").format("HH:mm")}`
        );
        const endDate = moment(
          `${ele.date}T${moment(ele.endTime, "hh:mm A").format("HH:mm")}`
        );

        return {
          id: ele._id,
          title: ele?.lessonId?.title,
          start: startDate.toDate(),
          end: endDate.toDate(),
          bgColor: lightenHexColor(ele?.lessonId?.colorCode, 0.6),
          date: moment(ele?.date).format("YYYY-MM-DD"),
          day: ele?.day,
          divColor: ele?.lessonId?.colorCode,
          resourceId: ele?.teachers?.map((teacher) => teacher?._id),
          type: ele?.lessonId?.type,
        };
      });

      setEvents(lessonEvents);
      const uniqueTeacherIds = [
        ...new Set(lessonEvents.flatMap((event) => event.resourceId)),
      ];
      const filteredTeachers = allTeachers.filter((teacher) =>
        uniqueTeacherIds.includes(teacher.resourceId)
      );

      setTeacherList(filteredTeachers);
      setLoading(false);
    }
    setLoading(false);
  };

  // Fetch teacher list for filter dropdown
  const featchTearcherList = async () => {
    const res = await dispatch(handelGetTeacherList());
    if (res?.status === 200) {
      setLocationTeList(
        res?.data?.response?.map((ele) => {
          return {
            name: `${ele?.firstName} ${ele?.lastName}`,
            id: ele?._id,
          };
        }) || {}
      );
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchLessonDetails();
    featchTearcherList();
  }, []); //

  // Fetch locations for filter dropdown
  const getLocationAPI = async () => {
    dispatch(handleGetLocation());
  };

  useEffect(() => {
    getLocationAPI();
  }, []);

  // Handle filter submit for instructors/locations
  const handleSubmit = async () => {
    // setLoading(true);
    const location =
      filterList?.locations?.length > 0 ? filterList?.locations : "";
    const instructors =
      filterList?.instructors?.length > 0 ? filterList?.instructors : "";

    const isTrue =
      filterList?.instructors?.length === locationTeList?.length &&
      filterList?.locations?.length === locationList?.length;

    const payload = {
      locations: isTrue ? [] : location,
      instructors: isTrue ? [] : instructors,
    };
    const res = await dispatch(getLessonSchedule(payload));
    if (res?.status === 200) {
      // Flattening teachers and mapping them
      const allTeachers = [];
      const seenTeacherIds = new Set();

      res?.data?.response?.forEach((ele) => {
        ele?.teachers?.forEach((teacher) => {
          if (teacher?._id && !seenTeacherIds.has(teacher?._id)) {
            seenTeacherIds.add(teacher?._id);
            allTeachers.push({
              resourceId: teacher?._id,
              resourceTitle: `${teacher?.firstName} ${teacher?.lastName}`,
            });
          }
        });
      });

      // Map lesson events
      const lessonEvents = res?.data?.response?.map((ele) => {
        const startDate = moment(
          `${ele.date}T${moment(ele.startTime, "hh:mm A").format("HH:mm")}`
        );
        const endDate = moment(
          `${ele.date}T${moment(ele.endTime, "hh:mm A").format("HH:mm")}`
        );

        return {
          id: ele._id,
          title: ele?.lessonId?.title,
          start: startDate.toDate(),
          end: endDate.toDate(),
          bgColor: lightenHexColor(ele?.lessonId?.colorCode, 0.6),
          date: moment(ele?.date).format("YYYY-MM-DD"),
          day: ele?.day,
          divColor: ele?.lessonId?.colorCode,
          resourceId: ele?.teachers?.map((teacher) => teacher?._id),
        };
      });

      setEvents(lessonEvents || []);
      const uniqueTeacherIds = [
        ...new Set(lessonEvents.flatMap((event) => event.resourceId)),
      ];
      const filteredTeachers = allTeachers.filter((teacher) =>
        uniqueTeacherIds.includes(teacher.resourceId)
      );

      setTeacherList(filteredTeachers || []);
      setLoading(false);
    }
    setfilterDropdown(false);
    setLoading(false);
  };

  // Custom event rendering in calendar
  const [selectedEvent, setSelectedEvent] = useState(null);
  const Event = ({ event }) => {
    const handleEventClick = () => {
      // Find teacher name from teacherList
      let teacherName = '-';
      if (event.resourceId && teacherList && teacherList.length > 0) {
        const found = teacherList.find(t => t.resourceId === event.resourceId || (Array.isArray(event.resourceId) && event.resourceId.includes(t.resourceId)));
        if (found) teacherName = found.resourceTitle;
      }
      const mappedEvent = {
        title: event.title,
        date: event.date || (event.start ? moment(event.start).format('dddd, MMMM Do') : '-'),
        time: event.start && event.end ? `${moment(event.start).format('hh:mm A')} - ${moment(event.end).format('hh:mm A')}` : '-',
        recurrence: event.recurrence || '-',
        description: event.description || '-',
        instructor: teacherName,
        student: event.student || '-',
        instrument: event.resource || '-',
        isCancelled: event.isCancelled || false,
        joinUrl: event.joinUrl || '#',
        start: event.start,
      };
      setSelectedEvent(mappedEvent);
      dispatch(setShowEvenModal(true));
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
        <p className="mb-0 event-text">{event?.title}</p>
      </div>
    );
  };

  // Style events in calendar (yellow for new, custom for fetched)
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
        border: `1px solid  ${event?.divColor || '#ffe066'}`,
      },
    };
  };

  // Main render
  return (
    <div id="admincalender-container">
      {/* Event modal for viewing/editing events */}
      {showEvenModal && (
        <EventModal 
          event={selectedEvent} 
          teacherList={teacherList}
          onDelete={() => {
            if (selectedEvent) {
              setEvents(events.filter(e => {
                // Match by title, start, and student for uniqueness
                return !(
                  e.title === selectedEvent.title &&
                  e.start && selectedEvent.start && new Date(e.start).getTime() === new Date(selectedEvent.start).getTime() &&
                  e.student === selectedEvent.student
                );
              }));
              setSelectedEvent(null);
              dispatch(setShowEvenModal(false));
            }
          }}
          onHide={() => dispatch(setShowEvenModal(false))}
        />
      )}
      {/* Modal for adding new events */}
      <AddEventForm
        showEventModal={showEventModal}
        setShowEventModal={setShowEventModal}
        handleEventChange={handleEventChange}
        newEvent={newEvent}
        handleEventSubmit={handleEventSubmit}
        instructors={teacherList}
      />
      <div className="mainBlock">
        <div className={show ? "calenderBlock" : "calenderBlock active"}>
          {/* Main calendar component */}
          <Calendar
            popup={true}
            step={15}
            timeslots={4}
            date={date}
            defaultDate={moment()}
            localizer={localizer}
            events={events}
            resourceIdAccessor="resourceId"
            resources={teacherList}
            resourceTitleAccessor="resourceTitle"
            startAccessor="start"
            endAccessor="end"
            views={["month", "week", "day"]}
            view={view}
            style={{ height: "750px" }}
            defaultView="day"
            onSelectEvent={() => {}}
            onNavigate={() => {}}
            components={{
              eventWrapper: CustomDateCellWrapper,
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

                const gotoToday = () => {
                  setDate(moment());
                  toolbar.onNavigate("TODAY");
                };

                const year = moment(tDate).format("YYYY");
                const month = moment(tDate).format("MMMM");

                return (
                  <div className="rbc-toolbar fb-center gap-3 wp-100 mb-20 mt-3 position-relative">
                    <div className="fa-center gap-5">
                      <div>
                        <Button
                          btnStyle="PDO"
                          btnText="Today"
                          onClick={() => gotoToday()}
                          className="h-44"
                        />
                      </div>
                      <div className="fb-center gap-4">
                        <div
                          className="h-32 w-32 pointer"
                          onClick={() => goToBack()}
                        >
                          <img
                            src={icons?.leftArrow}
                            alt=""
                            className="fit-image"
                          />
                        </div>
                        <div className="text-18-400 color-1a1a font-gilroy-sb">
                          {month} {year}
                        </div>
                        <div
                          className="h-32 w-32 pointer"
                          onClick={() => goToNext()}
                        >
                          <img
                            src={icons?.rightArrow}
                            alt=""
                            className="fit-image"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="fa-center gap-3">
                      <div className="position-relative" ref={dropdownRef}>
                        <Button
                          btnStyle="PDO"
                          btnText={view.charAt(0).toUpperCase() + view.slice(1)}
                          onClick={() => setShowDropdown(!showDropdown)}
                          className="h-44"
                          rightIcon={icons?.arrowDown}
                          rightIconClass="h-16 w-16"
                        />
                        {showDropdown && (
                          <div className="custom-dropdown">
                            <div
                              className="dropdown-item"
                              onClick={() => handleViewChange("day")}
                            >
                              Day
                            </div>
                            <div
                              className="dropdown-item"
                              onClick={() => handleViewChange("month")}
                            >
                              Month
                            </div>
                            <div
                              className="dropdown-item"
                              onClick={() => handleViewChange("week")}
                            >
                              Week
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="" ref={filterRef}>
                        <Button
                          btnStyle="PDO"
                          btnText="Filter"
                          onClick={() => setfilterDropdown(!filterDropdown)}
                          className="h-44"
                          rightIcon={icons?.filter}
                        />
                        {filterDropdown && (
                          <FilterContent
                            loading={loading}
                            teacherList={locationTeList}
                            data={locationList}
                            filterList={filterList}
                            showLocations={showLocations}
                            setShowLocations={setShowLocations}
                            setFilterList={setFilterList}
                            showInstructors={showInstructors}
                            setShowInstructors={setShowInstructors}
                            handleSubmit={handleSubmit}
                            onHide={() => {
                              setfilterDropdown(false),
                                setFilterList({
                                  locations: [],
                                  instructors: [],
                                });
                            }}
                            featchTearcherList={fetchLessonDetails}
                            setfilterDropdown={setfilterDropdown}
                          />
                        )}
                      </div>
                      <div>
                        <Button
                          btnStyle="PDO"
                          btnText="Add Event"
                          onClick={() => setShowEventModal(true)}
                          className="h-44"
                        />
                      </div>
                    </div>
                  </div>
                );
              },
            }}
            eventPropGetter={eventStyleGetter}
          />
        </div>
        {/* Mini calendar table on the side */}
        <div className="mini-Calender">
          <LessonCalenderTable events={events} />
        </div>
      </div>
    </div>
  );
};

export default AdminCalender;
