import React, { useState } from "react";

const initialEvents = [];
const demoStudents = [
  "Alice Johnson",
  "Bob Smith",
  "Charlie Brown",
  "David Lee",
  "Eva Green",
];

const inputStyle = {
  border: "1px solid #dfe1e5",
  borderRadius: "24px",
  padding: "10px 16px",
  fontSize: "16px",
  width: "100%",
};
const labelStyle = {
  fontWeight: 500,
  fontSize: 15,
  marginBottom: 6,
  display: "block",
};
const groupStyle = {
  marginBottom: 20,
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: 24,
  background: '#fff',
  borderRadius: 12,
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(60,64,67,.08)'
};
const thStyle = {
  background: '#f7f7f7',
  fontWeight: 600,
  fontSize: 15,
  padding: '12px 16px',
  borderBottom: '1px solid #eee',
  textAlign: 'left',
};
const tdStyle = {
  padding: '12px 16px',
  borderBottom: '1px solid #f0f0f0',
  fontSize: 15,
  background: '#fff',
};

const Performance = () => {
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState(initialEvents);
  const [activeEventIdx, setActiveEventIdx] = useState(null);
  const [form, setForm] = useState({
    name: "",
    branch: "",
    location: "",
    datetime: "",
  });
  const [assigned, setAssigned] = useState({}); // {eventIdx: [studentNames]}

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    setEvents([
      ...events,
      { ...form, students: [] },
    ]);
    setForm({ name: "", branch: "", location: "", datetime: "" });
    setShowModal(false);
  };

  const handleAssign = (student, checked) => {
    if (activeEventIdx === null) return;
    setEvents((prev) =>
      prev.map((ev, idx) =>
        idx === activeEventIdx
          ? {
              ...ev,
              students: checked
                ? [...(ev.students || []), student]
                : (ev.students || []).filter((s) => s !== student),
            }
          : ev
      )
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Performance Events</h2>
      <button onClick={() => setShowModal(true)} style={{ marginBottom: 16, borderRadius: 24, padding: '10px 24px', background: '#007bff', color: '#fff', border: 'none', fontSize: 16 }}>
        Add Performance
      </button>
      {/* Modal for adding event */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{ background: "#fff", padding: 32, borderRadius: 16, minWidth: 380, boxShadow: '0 4px 24px rgba(60,64,67,.15)' }}>
            <h3 style={{ marginBottom: 24 }}>Add Performance Event</h3>
            <form onSubmit={e => { e.preventDefault(); handleCreate(); }}>
              <div style={groupStyle}>
                <label style={labelStyle}>Live event name</label>
                <input name="name" value={form.name} onChange={handleInput} style={inputStyle} />
              </div>
              <div style={groupStyle}>
                <label style={labelStyle}>Live event branch</label>
                <input name="branch" value={form.branch} onChange={handleInput} style={inputStyle} />
              </div>
              <div style={groupStyle}>
                <label style={labelStyle}>Live event location</label>
                <input name="location" value={form.location} onChange={handleInput} style={inputStyle} />
              </div>
              <div style={groupStyle}>
                <label style={labelStyle}>Live event date and time</label>
                <input type="datetime-local" name="datetime" value={form.datetime} onChange={handleInput} style={inputStyle} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ borderRadius: 24, padding: '8px 24px', border: '1px solid #dfe1e5', background: '#fff', color: '#333', fontSize: 15 }}>Cancel</button>
                <button type="submit" disabled={!form.name || !form.datetime} style={{ borderRadius: 24, padding: '8px 24px', border: 'none', background: '#007bff', color: '#fff', fontSize: 15 }}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Event Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {events.map((ev, idx) => (
          <button
            key={idx}
            style={{
              padding: "8px 16px",
              borderRadius: 4,
              border: activeEventIdx === idx ? "2px solid #007bff" : "1px solid #ccc",
              background: activeEventIdx === idx ? "#e6f0ff" : "#fff",
              cursor: "pointer",
            }}
            onClick={() => setActiveEventIdx(idx)}
          >
            {ev.name || `Event ${idx + 1}`}
          </button>
        ))}
      </div>
      {/* Assign students to event */}
      {activeEventIdx !== null && events[activeEventIdx] && (
        <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 24, maxWidth: 600, background: '#fafbfc' }}>
          <h3>Assign Students to: {events[activeEventIdx].name}</h3>
          <div style={{ marginBottom: 12 }}>
            <b>Branch:</b> {events[activeEventIdx].branch}<br />
            <b>Location:</b> {events[activeEventIdx].location}<br />
            <b>Date/Time:</b> {events[activeEventIdx].datetime}
          </div>
          <div style={{ marginBottom: 24 }}>
            {demoStudents.map((student) => (
              <div key={student} style={{ marginBottom: 8 }}>
                <label>
                  <input
                    type="checkbox"
                    checked={events[activeEventIdx].students?.includes(student) || false}
                    onChange={e => handleAssign(student, e.target.checked)}
                  />
                  {" "}{student}
                </label>
              </div>
            ))}
          </div>
          {/* Student Table */}
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Profile</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Activity</th>
              </tr>
            </thead>
            <tbody>
              {(events[activeEventIdx].students || []).map((student, idx) => (
                <tr key={student}>
                  <td style={tdStyle}>
                    <input type="checkbox" checked readOnly />
                  </td>
                  <td style={tdStyle}>{student}</td>
                  <td style={tdStyle}>
                    <span style={{ color: '#4caf50', fontWeight: 600, fontSize: 18 }}>✔</span>
                  </td>
                </tr>
              ))}
              {(!events[activeEventIdx].students || events[activeEventIdx].students.length === 0) && (
                <tr>
                  <td style={tdStyle} colSpan={3} align="center">No students assigned yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Performance; 