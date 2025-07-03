import moment from "moment";
import { Modal, Form, Button as BootstrapButton } from "react-bootstrap";
import { useState } from "react";

const AddEventForm = ({
  showEventModal,
  setShowEventModal,
  handleEventChange,
  newEvent,
  handleEventSubmit,
  instructors,
}) => {
  // Demo student list
  const studentList = [
    "Alice Johnson",
    "Ava Smith",
    "Amelia Brown",
    "Aiden Clark",
    "Anthony Davis",
    "Andrew Wilson",
    "Ariana Lee",
    "Alex Martinez",
    "Aaron Walker",
    "Abigail Hall",
    "Bob Smith",
    "Charlie Brown",
    "David Lee",
    "Eva Green",
    "Fiona White",
    "George Black",
    "Hannah Blue",
  ];
  const [studentSuggestions, setStudentSuggestions] = useState([]);
  const [showStudentSuggestions, setShowStudentSuggestions] = useState(false);
  const [hoveredSuggestion, setHoveredSuggestion] = useState(-1);

  const handleStudentInputChange = (e) => {
    const value = e.target.value;
    handleEventChange({ target: { name: "student", value } });
    if (value.length > 0) {
      const filtered = studentList.filter((student) =>
        student.toLowerCase().includes(value.toLowerCase())
      );
      setStudentSuggestions(filtered);
      setShowStudentSuggestions(true);
    } else {
      setStudentSuggestions([]);
      setShowStudentSuggestions(false);
    }
  };

  const handleStudentSuggestionClick = (student) => {
    handleEventChange({ target: { name: "student", value: student } });
    setStudentSuggestions([]);
    setShowStudentSuggestions(false);
    setHoveredSuggestion(-1);
  };

  return (
    <div>
      {" "}
      <Modal show={showEventModal} onHide={() => setShowEventModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Event Title */}
            <Form.Group style={{ marginBottom: 20 }}>
              <Form.Label style={{ fontWeight: 500, fontSize: 15, marginBottom: 6 }}>Event Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newEvent.title}
                onChange={handleEventChange}
                style={{
                  border: "1px solid #dfe1e5",
                  borderRadius: "24px",
                  padding: "10px 16px",
                  fontSize: "16px",
                }}
              />
            </Form.Group>
            {/* Student Autocomplete */}
            <Form.Group style={{ marginBottom: 20 }}>
              <Form.Label style={{ fontWeight: 500, fontSize: 15, marginBottom: 6 }}>Student</Form.Label>
              <div style={{ position: "relative" }}>
                <Form.Control
                  type="text"
                  name="student"
                  autoComplete="off"
                  value={newEvent.student || ""}
                  onChange={handleStudentInputChange}
                  onFocus={() => {
                    if ((newEvent.student || "").length > 0 && studentSuggestions.length > 0) setShowStudentSuggestions(true);
                  }}
                  onBlur={() => setTimeout(() => setShowStudentSuggestions(false), 100)}
                  placeholder="Type to search student..."
                  style={{
                    border: "1px solid #dfe1e5",
                    borderRadius: "24px",
                    padding: "10px 16px",
                    fontSize: "16px",
                  }}
                />
                {showStudentSuggestions && studentSuggestions.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      zIndex: 10,
                      background: "#fff",
                      border: "1px solid #dfe1e5",
                      borderRadius: "16px",
                      boxShadow: "0 4px 16px rgba(60,64,67,.15)",
                      width: "100%",
                      marginTop: "4px",
                      overflow: "hidden",
                    }}
                  >
                    {studentSuggestions.map((student, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "10px 18px",
                          cursor: "pointer",
                          background: hoveredSuggestion === idx ? "#f1f3f4" : "#fff",
                          borderBottom:
                            idx !== studentSuggestions.length - 1
                              ? "1px solid #e0e0e0"
                              : "none",
                          fontSize: "16px",
                        }}
                        onMouseDown={() => handleStudentSuggestionClick(student)}
                        onMouseEnter={() => setHoveredSuggestion(idx)}
                        onMouseLeave={() => setHoveredSuggestion(-1)}
                      >
                        {student}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Form.Group>
            {/* Branch Dropdown (placeholder) */}
            <Form.Group style={{ marginBottom: 20 }}>
              <Form.Label style={{ fontWeight: 500, fontSize: 15, marginBottom: 6 }}>Branch</Form.Label>
              <Form.Control
                as="select"
                name="branch"
                value={newEvent.branch || ""}
                onChange={handleEventChange}
                style={{
                  border: "1px solid #dfe1e5",
                  borderRadius: "24px",
                  padding: "10px 16px",
                  fontSize: "16px",
                }}
              >
                <option value="">Select Branch</option>
                {/* Add branch options here */}
              </Form.Control>
            </Form.Group>
            {/* Instrument Dropdown */}
            <Form.Group style={{ marginBottom: 20 }}>
              <Form.Label style={{ fontWeight: 500, fontSize: 15, marginBottom: 6 }}>Instrument</Form.Label>
              <Form.Control
                as="select"
                name="resource"
                value={newEvent.resource}
                onChange={handleEventChange}
                style={{
                  border: "1px solid #dfe1e5",
                  borderRadius: "24px",
                  padding: "10px 16px",
                  fontSize: "16px",
                }}
              >
                <option value="keyboard">Keyboard</option>
                <option value="guitar">Guitar</option>
                <option value="piano">Piano</option>
                <option value="ukelele">Ukelele</option>
              </Form.Control>
            </Form.Group>
            {/* Teacher Dropdown */}
            <Form.Group controlId="resourceId" style={{ marginBottom: 20 }}>
              <Form.Label style={{ fontWeight: 500, fontSize: 15, marginBottom: 6 }}>Teacher</Form.Label>
              <Form.Control
                as="select"
                name="resourceId"
                value={newEvent.resourceId}
                onChange={handleEventChange}
                style={{
                  border: "1px solid #dfe1e5",
                  borderRadius: "24px",
                  padding: "10px 16px",
                  fontSize: "16px",
                }}
              >
                <option value="">Select Teacher</option>
                {instructors.map((instructor) => (
                  <option
                    key={instructor.resourceId}
                    value={instructor.resourceId}
                  >
                    {instructor.resourceTitle}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            {/* Date and Time */}
            <Form.Group style={{ marginBottom: 20 }}>
              <Form.Label style={{ fontWeight: 500, fontSize: 15, marginBottom: 6 }}>Date and Time</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  type="datetime-local"
                  name="start"
                  value={moment(newEvent.start).format("YYYY-MM-DDTHH:mm")}
                  onChange={handleEventChange}
                  style={{
                    border: "1px solid #dfe1e5",
                    borderRadius: "24px",
                    padding: "10px 16px",
                    fontSize: "16px",
                  }}
                />
                <span className="align-self-center">to</span>
                <Form.Control
                  type="datetime-local"
                  name="end"
                  value={moment(newEvent.end).format("YYYY-MM-DDTHH:mm")}
                  onChange={handleEventChange}
                  style={{
                    border: "1px solid #dfe1e5",
                    borderRadius: "24px",
                    padding: "10px 16px",
                    fontSize: "16px",
                  }}
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <BootstrapButton
            variant="secondary"
            onClick={() => setShowEventModal(false)}
          >
            Close
          </BootstrapButton>
          <BootstrapButton variant="primary" onClick={handleEventSubmit}>
            Save Event
          </BootstrapButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddEventForm;
