import React, { useRef, useState } from "react";
import Slider from "react-slick";
import { icons } from "@/utils/constants";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./AdminDashboard.scss";
import StudentrepoTable from "./StudentrepoTable";
import VibecheckTable from "./VibecheckTable";
import ContactlogTable from "./ContactlogTable";
import SortTable from "./SortTable";
import MultiTable from "./MultiTable";
import QtermTable from "./QtermTable";
import SpreadsheetTable from "./SpreadsheetTable";
import Terminations from "./TerminationTable";
import LogTable from "./LogTable";
import AcbalanceTable from "./AcbalanceTable";

const AdminDashboard = ({ show }) => {
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const cadsdata = [
    {
      title: "Student Report",
      img: icons.studentReport,
      component: <StudentrepoTable />,
    },
    { title: "Vibe Check", img: icons.Vibe, component: <VibecheckTable /> },
    {
      title: "Contact Logs",
      img: icons.contactLog,
      component: <ContactlogTable />,
    },
    {
      title: "Spreadsheet links",
      img: icons.Spreadsheet,
      component: <SpreadsheetTable />,
    },
    { title: "Sorts", img: icons.Sort, component: <SortTable /> },
    { title: "Q Terms Call", img: icons.Qterm, component: <QtermTable /> },
    { title: "Terminations", img: icons.Terminal, component: <Terminations /> },
    { title: "Active Students", img: icons.AcStudent },
    { title: "Suspensions", img: icons.Suspension },
    { title: "Commission Report", img: icons.CommissionReport },
    {
      title: "Account Balances",
      img: icons.AcBalance,
      component: <AcbalanceTable />,
    },
    { title: "Account Issues", img: icons.accountIssue },
    {
      title: "Multi-Month Packages",
      img: icons.multi,
      component: <MultiTable />,
    },
    { title: "Log In Info", img: icons.Log, component: <LogTable /> },
    { title: "Balance Ghosts", img: icons.Ghost },
    { title: "Sick Days", img: icons.Sick },
    { title: "Instructor Vacations", img: icons.Vacation },
    { title: "Instructor Information", img: icons.Info },
    { title: "Sheet127", img: icons.Sheet },
    { title: "Disappearing Students", img: icons.DiStudent },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    centerPadding: "10px",
    centerMode: true,

    responsive: [
      {
        breakpoint: 2560,
        settings: {
          slidesToShow: show ? 6 : 7,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 2000,
        settings: {
          slidesToShow: show ? 5 : 6,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1800,
        settings: {
          slidesToShow: show ? 4 : 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1700,
        settings: {
          slidesToShow: show ? 4 : 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: show ? 3 : 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 900, // Additional breakpoint
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },

      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const goToPrevSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const goToNextSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const handleCardClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <>
      <div className="">
        <div
          className={`dashbordcard-container   ${
            show === true ? "addslider" : ""
          }`}
        >
          <Slider
            ref={sliderRef}
            {...settings}
            className="d-flex align-items-lg-center mainslider"
          >
            {cadsdata.map((card, index) => (
              <div
                key={index}
                className="dashbordcard d-flex  justify-content-start   align-items-center mx-auto"
              >
                <div
                  className={`cards d-flex align-items-center justify-content-start   ${
                    activeIndex === index ? "active" : ""
                  }`}
                  onClick={() => handleCardClick(index)}
                >
                  <div className="icon d-flex align-items-center">
                    <img src={card.img} alt={card.title} />
                  </div>
                  <div className={`title d-flex align-items-center `}>
                    <p className={` ${activeIndex === index ? "activep" : ""}`}>
                      {card.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
          <div
            className={`slider-button d-flex align-items-center   ${
              show === true ? "addbtn-container" : ""
            }`}
          >
            <div
              className="left"
              onClick={goToPrevSlide}
              style={{ cursor: "pointer" }}
            >
              <img src={icons.leftcard} alt="Left" />
            </div>
            <div
              className="right "
              onClick={goToNextSlide}
              style={{ cursor: "pointer" }}
            >
              <img src={icons.rightcard} alt="Right" />
            </div>
            <div
              className={`lineslider ${show === true ? "lin-container" : ""}`}
            ></div>
          </div>
        </div>
      </div>

      <div
        className={`tables-conatiner ${show === true ? "addslider" : ""}`}
        style={{ padding: "0px" }}
      >
        {activeIndex !== null && cadsdata[activeIndex].component}
      </div>
    </>
  );
};

export default AdminDashboard;
