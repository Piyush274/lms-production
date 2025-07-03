import Button from "@/components/inputs/Button";
import "./EventModal.scss";
import { icons } from "@/utils/constants";
import { setShowEvenModal } from "@/store/globalSlice";
import { useDispatch } from "react-redux";
import CryptoJS from "crypto-js";

const ZOOM_SDK_KEY = "UZqA8sPhQJSqKO9YzEG0mA";
const ZOOM_SDK_SECRET = "yUVCTeRNPrjoP7DPbkC66lTedLKdNHjdhZO7";

function generateZoomSignature(meetingNumber, role = 1) {
  const sdkKey = ZOOM_SDK_KEY;
  const sdkSecret = ZOOM_SDK_SECRET;
  const timestamp = new Date().getTime() - 30000;
  const msg = `${sdkKey}${meetingNumber}${timestamp}${role}`;
  const hash = CryptoJS.HmacSHA256(msg, sdkSecret).toString(CryptoJS.enc.Base64);
  const signature = btoa(`${sdkKey}.${meetingNumber}.${timestamp}.${role}.${hash}`);
  return signature.replace(/=+$/, "");
}

const EventModal = ({ event = {}, teacherList = [], onDelete, onHide }) => {
  const dispatch = useDispatch();

  // Fallbacks for missing fields
  const {
    title = "-",
    date = "-",
    time = "-",
    recurrence = "Weekly",
    description = "-",
    instructor = "-",
    student = "-",
    instrument = "-",
    isCancelled = false,
    joinUrl = "#",
  } = event;

  // Generate a random meeting number for demo (in real use, this should come from backend)
  const meetingNumber = event.meetingNumber || Math.floor(100000000 + Math.random() * 900000000);
  const userName = student !== "-" ? student : "Guest";
  const userEmail = "demo@example.com";
  const password = "";

  const handleJoinZoom = () => {
    const signature = generateZoomSignature(meetingNumber, 1);
    // Construct Zoom join URL for Web SDK (for demo, redirect to Zoom join page)
    // In real use, you would use the Zoom Web SDK to embed/join in-app
    const zoomJoinUrl = `https://zoom.us/wc/join/${meetingNumber}?prefer=1&un=${encodeURIComponent(userName)}`;
    window.open(zoomJoinUrl, "_blank");
  };

  return (
    <div id="eventmodal-container" className="brave-scroll">
      <div className="event-modal-container" style={{ paddingBottom: 0 }}>
        {/* Modal Header: colored square and event title */}
        <div className="fb-center flex-nowrap gap-5" style={{ justifyContent: 'space-between' }}>
          <div className="fa-center gap-3 flex-nowrap">
            <span style={{ width: 18, height: 18, background: '#c6e16e', borderRadius: 4, display: 'inline-block' }}></span>
            <span className="text-18-400 color-1a1a font-gilroy-sb">
              {title}
            </span>
          </div>
          <div className="fa-center gap-3">
            <div
              className="w-28 h-28 pointer"
              onClick={onHide || (() => dispatch(setShowEvenModal(false)))}
            >
              <img src={icons.eventClose} className="fit-image" alt="" />
            </div>
          </div>
        </div>
        <hr className="event-hr" />
        {/* Date, time, recurrence */}
        <div className="fb-center flex-nowrap mb-4" style={{ justifyContent: 'flex-start', gap: 12 }}>
          <div className="text-16-400 color-1a1a font-gilroy-m">
            {date}
          </div>
          <div className="text-14-400 color-fe5c font-gilroy-m bg-3826 br-20 ps-10 pe-10">
            Weekly
          </div>
        </div>
        <div className="text-16-400 color-1a1a font-gilroy-m mb-2">
          {time}
        </div>
        {/* <hr className="event-hr" /> */}
        {/* Description */}
        {/* <div className="d-flex flex-column gap-1 mb-3">
          <div className="text-16-400 color-aoao font-gilroy-m mb-1">
            <span style={{ marginRight: 6 }}>
              <img src={icons.eDescription || icons.eStudent} alt="desc" style={{ width: 16, height: 16, verticalAlign: 'middle' }} />
            </span>
            {description}
          </div>
        </div> */}
        <hr className="event-hr" />
        {/* Instrument */}
        <div className="d-flex flex-column gap-2 mb-3">
          <div className="fa-center gap-2 mb-1">
            <span>
              <img src={icons.eStudent} alt="instrument" style={{ width: 18, height: 18, verticalAlign: 'middle' }} />
            </span>
            <span className="text-16-400 color-1a1a font-gilroy-m">{instrument}</span>
          </div>
          <div className="text-14-400 color-5151 font-gilroy-m" style={{ marginLeft: 28 }}>Instrument</div>
        </div>
        {/* Instructor and Student */}
        <div className="d-flex flex-column gap-2 mb-3">
          <div className="fa-center gap-2 mb-1">
            <span>
              <img src={icons.eStudent} alt="instructor" style={{ width: 18, height: 18, verticalAlign: 'middle' }} />
            </span>
            <span className="text-16-400 color-1a1a font-gilroy-m">{instructor}</span>
          </div>
          <div className="text-14-400 color-5151 font-gilroy-m" style={{ marginLeft: 28 }}>Instructor</div>
          <div className="fa-center gap-2 mb-1">
            <span>
              <img src={icons.eStudent} alt="student" style={{ width: 18, height: 18, verticalAlign: 'middle' }} />
            </span>
            <span className="text-16-400 color-1a1a font-gilroy-m">{student}</span>
          </div>
          <div className="text-14-400 color-5151 font-gilroy-m" style={{ marginLeft: 28 }}>Student</div>
        </div>
        <hr className="event-hr" />
        {/* Join Video Meeting Button */}
        <div className="mb-3">
          <Button
            btnText="Join Video Meeting"
            className="h-44 text-16-400"
            btnStyle="PDO"
            onClick={handleJoinZoom}
          />
        </div>
        {/* Cancelled Lesson Button */}
        <div style={{ marginTop: 12, marginBottom: 0 }}>
          <Button
            btnText="Cancelled Lesson"
            className="h-44 text-16-400"
            style={{ background: '#e57373', color: '#fff', border: 'none', marginBottom: 0 }}
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default EventModal;
