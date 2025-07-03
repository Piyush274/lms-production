// import React, { useEffect } from "react";
// import CryptoJS from "crypto-js";
// import "./ZoomMeeting.scss";

// const ZoomMeeting = ({
//   meetingId = 123456789,
//   userName,
//   userEmail,
//   password,
// }) => {
//   const generateSignature = (meetingId, role) => {
//     const sdkKey = "UZqA8sPhQJSqKO9YzEG0mA";
//     const sdkSecret = "3NDUVABm5kXPp8B2azgpSOgX6pvoLqHhVKYi";
//     const timestamp = new Date().getTime() - 30000;
//     const message = `${sdkKey}${meetingId}${timestamp}${role}`;
//     const hash = CryptoJS.HmacSHA256(message, sdkSecret).toString(CryptoJS.enc.Base64);
//     return `v1.${timestamp}.${meetingId}.${role}.${hash}`;
//   };

//   useEffect(() => {
//     const loadZoomSdk = () => {
//       try {
//         console.log("Loading Zoom SDK...");
//         const script = document.createElement("script");
//         script.src = "https://source.zoom.us/2.10.1/zoom-meeting-2.10.1.min.js";

//         script.onload = () => {
//           console.log("Zoom SDK loaded successfully");

//           if (window.ZoomMtg) {
//             initZoom();
//           } else {
//             console.error("ZoomMtg is not available");
//           }
//         };

//         script.onerror = () => {
//           console.error("Error loading Zoom SDK");
//         };

//         document.body.appendChild(script);
//       } catch (error) {
//         console.error("Error loading Zoom SDK:", error);
//       }
//     };

//     const initZoom = () => {
//       console.log("Initializing Zoom with Meeting ID:", meetingId);
//       const signature = generateSignature(meetingId, 0);
//       console.log("Generated signature:", signature);

//       if (window.ZoomMtg) {
//         ZoomMtg.setZoomJSLib("https://source.zoom.us/lib", "/av");
//         ZoomMtg.preLoadWasm();
//         ZoomMtg.prepareJssdk();

//         ZoomMtg.init({
//           leaveUrl: "http://localhost:5173/teacher/dashboard",
//           isSupportAV: true,
//           success: () => {
//             console.log("Attempting to join the meeting...");
//             console.log(ZoomMtg.join,"JOIN MTG")

//             ZoomMtg.join({
//               signature: signature,
//               sdkKey:"_a0hF0e7TziAB59mtm-F4w",
//               meetingNumber: meetingId,
//               userName: userName,
//               userEmail: userEmail,
//               success: (res) => {
//                 console.log("Meeting joined successfully", res);
//               },
//               error: (err) => {
//                 console.error("Error joining the meeting", err);
//               },
//             });
//           },
//           error: (err) => {
//             console.error("Error initializing Zoom SDK", err);
//           },
//         });
//       } else {
//         console.error("ZoomMtg is not available after SDK load");
//       }
//     };

//     loadZoomSdk();
//   }, [meetingId, userName, userEmail, password]);

//   return (
//     <>
//       <div
//         id="zmmtg-root"
//         style={{
//           width: "100%",
//           height: "100vh",
//           backgroundColor: "black",
//           position: "relative",
//           border: "4px solid blue",
//         }}
//       />
//     </>
//   );
// };

// export default ZoomMeeting;

// import React, { useState } from "react";
// import uitoolkit from "@zoom/videosdk-ui-toolkit";
// import "./ZoomMeeting.scss";  // Create your custom CSS if needed

// function ZoomMeeting() {
//   const [userName, setUserName] = useState("");
//   const [meetingId, setMeetingId] = useState("");
//   const [isJoining, setIsJoining] = useState(false);
//   const [sessionContainer, setSessionContainer] = useState(null);

//   const authEndpoint = "http://localhost:3001/create-jwt"; // Node.js backend endpoint

//   // Function to get JWT token from the backend
//   const getVideoSDKJWT = async () => {
//     if (!userName || !meetingId) {
//       alert("Please enter a meeting ID and name");
//       return;
//     }

//     console.log(meetingId,"meetingId")

//     setIsJoining(true);

//     try {
//       const response = await fetch(authEndpoint, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ sessionName: meetingId, role: 1 }),
//       });

//       console.log(response,"response")
//       const data = await response.json();

//       if (data.signature) {
//         joinSession(data.signature);
//       }
//     } catch (error) {
//       console.error("Error getting JWT:", error);
//       setIsJoining(false);
//     }
//   };

//   // Function to join the Zoom session with JWT
//   const joinSession = (signature) => {
//     const config = {
//       videoSDKJWT: signature,
//       sessionName: meetingId,
//       userName: userName,
//       sessionPasscode: "123", // Passcode, if any
//       features: ["video", "audio", "settings", "users", "chat", "share"],
//       options: { init: {}, audio: {}, video: {}, share: {} },
//     };

//     if (sessionContainer) {
//       uitoolkit.joinSession(sessionContainer, config);
//       sessionContainer && uitoolkit.onSessionClosed(sessionClosed);
//     }
//   };

//   // Function to handle session close event
//   const sessionClosed = () => {
//     console.log("session closed");
//     sessionContainer && uitoolkit.closeSession(sessionContainer);
//     setIsJoining(false);
//   };

//   return (
//     <div className="ZoomMeeting">
//       <h1>Zoom Video SDK with React</h1>

//       {!isJoining ? (
//         <div>
//           <input
//             type="text"
//             placeholder="Enter your name"
//             value={userName}
//             onChange={(e) => setUserName(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Enter Meeting ID"
//             value={meetingId}
//             onChange={(e) => setMeetingId(e.target.value)}
//           />
//           <button onClick={getVideoSDKJWT}>Join Meeting</button>
//         </div>
//       ) : (
//         <p>Joining the meeting...</p>
//       )}

//       <div
//         id="sessionContainer"
//         ref={(el) => setSessionContainer(el)}
//         style={{ width: "100%", height: "500px" }}
//       ></div>
//     </div>
//   );
// }

// export default ZoomMeeting;

// IMP
// import React, { useEffect } from "react";
// import ZoomMtgEmbedded from "@zoom/meetingsdk/embedded";
// import { ZoomMtg } from "@zoom/meetingsdk";

// const ZoomMeeting = ({
//   meetingNumber,
//   userName,
//   userEmail,
//   passWord,
//   sdkKey,
//   signature,
//   role,
// }) => {
//   console.log("🚀 Meeting Number:", meetingNumber);
//   console.log("🔑 Signature:", signature);
//   console.log("👤 passWord:", passWord);

//   ZoomMtg.preLoadWasm();
//   ZoomMtg.prepareWebSDK();

//   console.log(meetingNumber, "meetingNumber");
//   useEffect(() => {
//     const client = ZoomMtgEmbedded.createClient();

//     let meetingSDKElement = document.getElementById("zoomMeetingContainer");

//     client
//       .init({
//         debug: true,
//         zoomAppRoot: meetingSDKElement,
//         language: "en-US",
//         customize: {
//           video: {
//             isResizable: true,
//             viewSizes: { default: { width: 800, height: 600 } },
//           },
//           chat: { popUp: true },
//         },
//       })
//       .then(() => {

//         client
//           .join({
//             sdkKey: sdkKey,
//             signature: signature,
//             meetingNumber: meetingNumber,
//             password: passWord,
//             userName: userName,
//             userEmail: userEmail,
//             role: role,
//           })
//           .then(() => {
//             console.log("Joined meeting successfully");
//           })
//           .catch((err) => {
//             console.error("Error joining meeting", err);
//           });
//       })
//       .catch((err) => console.error("Error initializing Zoom SDK", err));
//   }, [meetingNumber, userName, userEmail, passWord, sdkKey, signature, role]);

//   return (
//     <div
//       id="zoomMeetingContainer"
//       style={{ width: "100%", height: "500px" }}
//     ></div>
//   );
// };

// export default ZoomMeeting;

// import React, { useEffect } from "react";
// import { ZoomMtg } from "@zoom/meetingsdk";

// const ZoomMeeting = ({
//   meetingNumber,
//   userName,
//   userEmail,
//   passWord,
//   sdkKey,
//   signature,
//   role,
// }) => {
//   console.log("🚀 Meeting Number:", meetingNumber);
//   console.log("🔑 Signature:", signature);
//   console.log("👤 passWord:", passWord);

//   const leaveUrl = "http://localhost:5173"; // Define leave URL

//   ZoomMtg.preLoadWasm();
//   ZoomMtg.prepareWebSDK();

//   useEffect(() => {
//     document.getElementById("zmmtg-root").style.display = "block";

//     ZoomMtg.init({
//       leaveUrl: leaveUrl,
//       patchJsMedia: true,
//       leaveOnPageUnload: true,
//       success: (success) => {
//         console.log("Zoom SDK Initialized", success);

//         ZoomMtg.join({
//           signature: signature,
//           sdkKey: sdkKey,
//           meetingNumber: meetingNumber,
//           passWord: passWord,
//           userName: userName,
//           userEmail: userEmail,
//           success: (success) => {
//             console.log("Joined meeting successfully", success);
//           },
//           error: (error) => {
//             console.error("Error joining meeting", error);
//           },
//         });
//       },
//       error: (error) => {
//         console.error("Error initializing Zoom SDK", error);
//       },
//     });
//   }, [meetingNumber, userName, userEmail, passWord, sdkKey, signature, role]); // Add dependencies

//   return (
//     <div id="zmmtg-root" style={{ width: "250px", height: "250px" }}></div>
//   );
// };

// export default ZoomMeeting;

// export default ZoomMeeting;

// UI TOOL KIT
import uitoolkit from "@zoom/videosdk-ui-toolkit";
import "@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css";
import "./ZoomMeeting.scss";
import { method } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import {
  handelUpdateSkillActionVC,
  setIsMeetingStarted,
} from "@/store/globalSlice";
import { Button } from "@/components";

function ZoomMeeting({
  userName = "test",
  role,
  teacherID = "teacher-110",
  studentID = "stu-008",
  assignedId = "lkxcjxlzkjcxzlkcjzxljck",
  skill = "guitar",
}) {
  const sessionKey = `session-${skill}-${teacherID}-${studentID}`;
  const baseURL = import.meta.env.VITE_API_URL_ZOOM;

  let sessionContainer = null;

  const authEndpoint = `${baseURL}/create-meet`;

  const config = {
    videoSDKJWT: "",
    sessionName: sessionKey,
    userName: JSON.stringify(userName),
    sessionPasscode: "123",
    features: ["video", "audio", "settings", "users", "chat", "share"],
    options: {
      init: {},
      audio: {},
      video: {
        startVideo: true,
        receiveVideo: true,
      },
      share: {},
    },
    virtualBackground: {
      allowVirtualBackground: true,
      allowVirtualBackgroundUpload: true,
      virtualBackgrounds: [
        "https://images.unsplash.com/photo-1715490187538-30a365fa05bd?q=80&w=1945&auto=format&fit=crop",
      ],
    },
  };

  function getVideoSDKJWT() {
    sessionContainer = document.getElementById("sessionContainer");
    document.getElementById("join-flow").style.display = "none";
    document.getElementById("zoomBlock").style.display = "none";

    fetch(authEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionName: config.sessionName,
        role: 1,
        userIdentity: userName,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.signature) {
          config.videoSDKJWT = data.signature;
          const payload = {
            assignedId: assignedId,
            meetId: sessionKey,
          };
          await dispatch(handelUpdateSkillActionVC(payload));
          joinSession();
        } else {
          // console.log(data);
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  }

  function joinSession() {
    if (sessionContainer) {
      uitoolkit.joinSession(sessionContainer, config);
      sessionContainer && uitoolkit.onSessionClosed(sessionClosed);

      uitoolkit.on("video-active-change", (payload) => {
        if (payload.videoActive) {
          uitoolkit.subscribeVideo(payload.userId); // 🔹 Ensure video is subscribed
        } else {
          console.warn(`User ${payload.userId} turned OFF video`);
        }
      });
      uitoolkit.on("*", (event, payload) => {
        console.log("Received Event:", event, payload);
      });
    }
  }

  const sessionClosed = () => {
    sessionContainer && uitoolkit.closeSession(sessionContainer);
    document.getElementById("join-flow").style.display = "block";
    document.getElementById("zoomBlock").style.display = "block";
  };

  return (
    <div
      className="App"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div id="join-flow">
        <div>
          <Button
            btnText="Join Meeting as"
            btnStyle="PDO"
            onClick={getVideoSDKJWT}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          id="sessionContainer"
          style={{ width: "100%", height: "100%" }}
        ></div>
      </div>
    </div>
  );
}

export default ZoomMeeting;
