import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Promptalert } from "./components";
import { AppRoutes } from "./routes/AppRoute";
import AuthRoute from "./routes/AuthRoute";
import {
  resetAllState,
  setAddNotification,
  setAuthData,
  setVirtualOpen,
} from "./store/globalSlice";
import { getDataFromLocalStorage } from "./utils/helpers";
import VirtualPopUp from "./pages/UserPage/Introduction/VirtualConsultation/VirtualPopUp";
import { onMessage } from "firebase/messaging";
import { generateToken, messaging } from "./config/fireBase";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxData = useSelector((state) => state.global);
  const { authData, virtualOpen } = reduxData || {};
  const [show, setShow] = useState(true);
  const isAuth = getDataFromLocalStorage("token");
  const userRole = getDataFromLocalStorage("role");
  const [token, setToken] = useState("");

  const handleLogout = () => {
    dispatch(setAuthData({ ...authData, time: new Date().toLocaleString() }));
    localStorage.removeItem("authData");
    dispatch(resetAllState());
    navigate("/login");
  };

  useEffect(() => {
    const requestPermission = async () => {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await generateToken();
        if (token) {
          setToken(token);
        }
      }
    };
    requestPermission();
  }, []);

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      const notificationTitle = payload.data.title;
      const notificationOptions = {
        body: payload.data.body,
      };
      new Notification(notificationTitle, notificationOptions);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          // console.log(
          //   "Service Worker registered with scope:",
          //   registration.scope
          // );
        })
        .catch((error) => {
          // console.error("Service Worker registration failed:", error);
        });
    });
  }

  return (
    <div>
      {virtualOpen && (
        <VirtualPopUp
          onHide={() => {
            dispatch(setVirtualOpen(false));
          }}
        />
      )}
      <Promptalert />
      {isAuth ? (
        <AppRoutes
          userRole={userRole}
          show={show}
          setShow={setShow}
          handleLogout={handleLogout}
        />
      ) : (
        <AuthRoute />
      )}
    </div>
  );
};

export default App;
