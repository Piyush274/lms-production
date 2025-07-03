import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Chart from "react-apexcharts"; // Import ApexCharts
import "./ParantChatAndScore.scss";
import { icons } from "@/utils/constants";
import { AvatarGroup } from "@/components";

const ParantChatAndScore = ({ Dashboarddata }) => {
  const isStudent = false;
  const status = "increasing"; //"decreasing"

  const chartOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 1,
    },
    colors: [status === "increasing" ? "#5ea12a" : "#fe5c38"],
    xaxis: {
      show: true,
      categories: ["Sep1", "Sep10", "Sep15", "Sep20"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: true,
      },
    },
    yaxis: { show: false },
    grid: { show: true },
  };
  const chartSeries = [
    {
      name: "Signups",
      data: [30, 50, 70, 100],
    },
  ];

  return (
    <div id="parentchatandscore-container">
      <div className="cardBlock px-20 pb-0 pt-20 d-flex flex-column gap-2">
        <div className="fb-center flex-nowrap">
          <div className="fa-center gap-2">
            <div className="fa-center gap-2 flex-nowrap">
              {/* <div className="w-23 h-23 f-center">
                        <img src={icons.menuRed} alt="" className="fit-image" />
                      </div> */}
              <div className="text-18-400 color-1a1a font-gilroy-m">
                Progress Overview
              </div>
            </div>
          </div>

          <div className="btnBlock text-16-400 color-5151 font-gilroy-m flex-nowrap ps-10 pe-10 pt-5 pb-5 pointer">
            This month
          </div>
        </div>
        <div className="fa-center flex-nowrap gap-3">
          <div className="text-36-400 color-1a1a font-gilroy-sb">
            {Dashboarddata.progressOverview}%
          </div>
          <div className="fa-center gap-2 flex-nowrap">
            <div
              className={`fa-center flex-nowrap gap-2 br-30 ${
                status === "increasing"
                  ? "bg-2a2e color-a12a"
                  : "bg-152e color-1515"
              } text-14-400 ps-7 pe-7 pt-3 pb-3`}
            >
              <div className="w-20 h-20 f-center">
                <img
                  src={status === "increasing" ? icons.upGreen : icons.downred}
                  alt=""
                  className="fit-image"
                />
              </div>
              <div>20%</div>
            </div>
            <div className="text-16-400 color-aoao">since last month</div>
          </div>
        </div>
        <div className="flex-grow-1">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="area"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default ParantChatAndScore;
