import "./SelectedStudentDashboard.scss";
import { Col, Row } from "react-bootstrap";

const SelectedStudentDashboard = () => {
  const studentdetails = [
    {
      title: "Performances",
      value: 135,
    },
    {
      title: "Active Skills",
      value: 20,
    },
    {
      title: "Completed Skills",
      value: 5,
    },
  ];

  return (
    <div id="selectedstudentdashboard-container">
      <div className="d-flex flex-column gap-2">
        <div className="text-20-400 color-1a1a font-gilroy-sb">
          Alexander Dave
        </div>
        <div className="text-16-400 color-5151 font-gilroy-m">
          Student since: Wednesday Jan 5, 2022
        </div>
        <div className="text-16-400 color-5151 d-flex gap-3">
          <span className="font-gilroy-m">Last PracticePad Interaction: </span>
          <span>Monday Sept 05, 2022</span>
          <span>1:00PM</span>
        </div>
        <div className="mt-16">
          <Row className="row-gap-3">
            {studentdetails.map((student, index) => {
              const { title, value } = student || {};
              return (
                <Col key={index}>
                  <div className="cardBlock p-20 d-flex flex-column">
                    <div className="fb-center flex-nowrap mb-10 gap-3 flex-grow-1">
                      <div className="text-18-400 color-1a1a font-gilroy-m">
                        {title}
                      </div>
                      <div className="btnBlock text-16-400 color-5151 font-gilroy-m flex-nowrap ps-10 pe-10 pt-5 pb-5 pointer">
                        See details
                      </div>
                    </div>
                    <div className="text-48-400 color-1a1a font-gilroy-sb mb-10 ">
                      {value}
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default SelectedStudentDashboard;
