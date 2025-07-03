import { Col, Row } from "react-bootstrap";
import "./StudentStats.scss";
import { icons } from "@/utils/constants";

const StudentStats = ({ data }) => {
  const studentdetails = [
    // {
    //   title: "Total Students",
    //   value: data?.studentCount,
    //   percent: "20%",
    //   status: "incresing",
    // },
    {
      title: "Your PracticePad® Score",
      value: data?.PracticePad,
      percent: "20%",
      status: "incresing",
    },
    {
      title: "Student Performers",
      value: data?.studentPerformance,
      percent: "20%",
      status: "decreasing",
    },
    {
      title: "Flight Risks Students",
      value: data?.flightRisksStudents,
      percent: "20%",
      status: "decreasing",
    },
  ];

  return (
    <div id="studentstats-container">
      <Row className="row-gap-3">
        {studentdetails.map((student, index) => {
          const { title, value, percent, status } = student || {};
          return (
            <Col key={index}>
              <div className="cardBlock p-20 d-flex flex-column hp-100">
                <div className="fb-center flex-nowrap mb-10 gap-3 flex-grow-1">
                  <div className="text-18-400 color-1a1a font-gilroy-m">
                    {title}
                  </div>
                  <div className="btnBlock text-16-400 color-5151 font-gilroy-m flex-nowrap ps-10 pe-10 pt-5 pb-5 pointer">
                    See details
                  </div>
                </div>
                <div className="text-48-400 color-1a1a font-gilroy-sb mb-10 flex-grow-1">
                  {value}
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
                    <div>{percent}</div>
                  </div>
                  <div className="text-16-400 color-aoao">since last month</div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default StudentStats;
