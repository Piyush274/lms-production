import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Chart from "react-apexcharts"; // Import ApexCharts
import "./ChatAndScore.scss";
import { icons } from "@/utils/constants";
import { AvatarGroup } from "@/components";

const ChatAndScore = ({ data }) => {
  const isStudent = true;
  const status = "increasing"; //"decreasing"
  const [selectedTab, setSelectedTab] = useState("signups");

  const avatars = [
    { src: "https://randomuser.me/api/portraits/men/1.jpg" },
    { src: "https://randomuser.me/api/portraits/women/2.jpg" },
    { src: "https://randomuser.me/api/portraits/men/3.jpg" },
    { src: "https://randomuser.me/api/portraits/women/4.jpg" },
    { src: "https://randomuser.me/api/portraits/men/5.jpg" },
    { src: "https://randomuser.me/api/portraits/men/1.jpg" },
    { src: "https://randomuser.me/api/portraits/women/2.jpg" },
    { src: "https://randomuser.me/api/portraits/men/3.jpg" },
    { src: "https://randomuser.me/api/portraits/women/4.jpg" },
    { src: "https://randomuser.me/api/portraits/men/5.jpg" },
  ];
  const categories = data?.yearlySignupData?.map((item) => item?.month);

  const signupCounts = data?.yearlySignupData?.map(
    (item) => item?.signupStudentCounts
  );
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
      show: false,
      categories: categories,
      // categories: [
      //   "Jan",
      //   "Feb",
      //   "Mar",
      //   "Apr",
      //   "May",
      //   "Jun",
      //   "Jul",
      //   "Aug",
      //   "Sep",
      //   "Oct",
      //   "Nov",
      //   "Dec",
      // ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: isStudent ? true : false,
      },
    },
    yaxis: { show: false },
    grid: { show: false },
  };
  const chartSeries = [
    {
      name: "Signups",
      // data: [100, 50, 10, 100, 20, 200, 100, 300, 100, 100, 100, 500],
      data: signupCounts,
    },
  ];

  return (
    <div id="chatandscore-container">
      <Row className="row-gap-3">
        <Col xxl={6}>
          <div className="cardBlock px-20 pb-0 pt-20 d-flex flex-column gap-2">
            <div className="fb-center flex-nowrap">
              <div className="fa-center gap-2">
                {isStudent ? (
                  <>
                    <div
                      className={`text-18-400 pointer ${
                        selectedTab === "signups"
                          ? "font-gilroy-m color-1a1a bb2-003e"
                          : "color-aoao"
                      }`}
                      onClick={() => setSelectedTab("signups")}
                    >
                      Sign ups
                    </div>
                    <div
                      className={`text-18-400 pointer ${
                        selectedTab === "terminations"
                          ? "font-gilroy-m color-1a1a bb2-003e"
                          : "color-aoao"
                      }`}
                      onClick={() => setSelectedTab("terminations")}
                    >
                      Terminations
                    </div>
                  </>
                ) : (
                  <>
                    <div className="fa-center gap-2 flex-nowrap">
                      <div className="w-23 h-23 f-center">
                        <img src={icons.menuRed} alt="" className="fit-image" />
                      </div>
                      <div className="text-18-400 color-1a1a font-gilroy-m">
                        Your PracticePad® Score
                      </div>
                    </div>
                  </>
                )}
              </div>
              {isStudent ? (
                <>
                  <div className="btnBlock text-16-400 color-5151 font-gilroy-m flex-nowrap ps-10 pe-10 pt-5 pb-5 pointer">
                    This Year
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 f-center pointer">
                    <img src={icons.infoRed} alt="" className="fit-image" />
                  </div>
                </>
              )}
            </div>
            <div className="fa-center flex-nowrap gap-3">
              <div className="text-24-400 color-1a1a font-gilroy-sb">
                {selectedTab === "terminations"
                  ? data?.terminations
                  : data?.sign_ups}
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
                      src={
                        status === "increasing" ? icons.upGreen : icons.downred
                      }
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
                height={`${isStudent ? "90%" : "70%"}`}
              />
            </div>
          </div>
        </Col>
        {isStudent && (
          <Col className="d-flex flex-column gap-4">
            <div className="cardBlock p-20 d-flex flex-column gap-2 flex-grow-1 justify-content-center">
              <div className="text-18-400 color-1a1a font-gilroy-m">
                Total Students
              </div>
              <div className="fa-center gap-3">
                <div className="text-24-400 color-1a1a font-gilroy-sb">
                  {data?.studentCount}
                </div>
                <div className="w-20 h-20 f-center pointer">
                  <img src={icons.infoRed} alt="" className="fit-image" />
                </div>
              </div>
            </div>
            {/* <div className="cardBlock p-20 d-flex flex-column hp-100">
              <div className="fb-center flex-nowrap mb-10 gap-3 flex-grow-1">
                <div className="text-18-400 color-1a1a font-gilroy-m">
                  {"Total Students"}
                </div>
                <div className="btnBlock text-16-400 color-5151 font-gilroy-m flex-nowrap ps-10 pe-10 pt-5 pb-5 pointer">
                  See details
                </div>
              </div>
              <div className="text-48-400 color-1a1a font-gilroy-sb mb-10 flex-grow-1">
                {data?.studentCount || 0}
              </div>
              <div className="fa-center flex-nowrap gap-2 flex-grow-1">
                <div
                  className={`fa-center flex-nowrap gap-2 br-30 ${
                    status === "incresing"
                      ? "bg-2a2e color-a12a"
                      : "bg-152e color-1515"
                  } text-16-400 ps-10 pe-10 pt-3 pb-3`}
                >
                  <div className="w-20 h-20 f-center">
                    <img
                      src={
                        status === "incresing" ? icons.upGreen : icons.downred
                      }
                      alt=""
                      className="fit-image"
                    />
                  </div>
                  <div>{"20%"}</div>
                </div>
                <div className="text-16-400 color-aoao">since last month</div>
              </div>
            </div> */}
            <div className="p-20 notificationBlock flex-grow-1 fb-center flex-nowrap">
              <div className="text-18-400 color-ffff font-gilroy-sb">
                You have new messages
              </div>
              <div className="w-40 h-40 f-center pointer">
                <img src={icons.ArrowDownRight} className="fit-image" alt="" />
              </div>
            </div>
          </Col>
        )}
        <Col xxl={isStudent ? "" : 6}>
          <div
            className={`cardBlock p-20 ${
              isStudent ? "d-flex flex-column" : "f-center flex-nowrap gap-3"
            }`}
          >
            <div
              className={`d-flex flex-column gap-3 ${
                !isStudent && "justify-content-center"
              }`}
            >
              <div className="text-18-400 color-1a1a font-gilroy-sb">
                Upcoming Show
              </div>
              <div>
                <span className="text-16-400 color-5151 font-gilroy-m">
                  Location :
                </span>
                <span className="text-16-400 color-1a1a font-gilroy-m">
                  {" "}
                  Gramercy Tavern, New York
                </span>
              </div>
              <div className="text-16-400 color-fe5c font-gilroy-m pointer">
                View on map
              </div>
            </div>
            <hr className={`hr ${!isStudent && "hp-100"}`} />
            <div
              className={`d-flex flex-column gap-3 ${
                !isStudent && "justify-content-center"
              }`}
            >
              <div className="text-16-400 color-5151 font-gilroy-m ">
                Students who signed up:
              </div>
              <div className="ps-10 flex-grow-1">
                <AvatarGroup avatars={avatars} maxVisible={6} size={30} />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ChatAndScore;
