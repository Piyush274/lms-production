import { icons } from "@/utils/constants";
import "./Navbar.scss";
import { Button } from "@/components";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNotification } from "@/store/globalSlice";
import { useNavigate } from "react-router-dom";

const Navbar = ({ isResponsive, setShow, show, data, isNotification }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.global);
  const { profileData } = reduxData || {};
  const { role } = profileData || {};
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setloading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);

  const getNotificationList = async () => {
    setloading(true);
    const res = await dispatch(getNotification());
    if (res.status === 200) {
      setNotifications(res?.data?.response || []);
    }
    setloading(false);
  };

  const handleNotificationClick = (notification) => {
    const {
      redirect_url,
      redirect_id,
      studentId,
      firstName,
      lastName,
      assignedId,
    } = notification || {};
    if (redirect_url === "chat") {
      if (role === "student") {
        setShowNotification(false);
        navigate(`/user/chat`, { state: { redirect_id } });
      } else if (role === "teacher") {
        setShowNotification(false);
        navigate(`/teacher/chat`, { state: { redirect_id } });
      }
    } else if (redirect_url === "skills/create-skill") {
      setShowNotification(false);
      navigate("/teacher/skills/create-skill", {
        state: {
          id: redirect_id,
          studentId: studentId,
          sSkill: true,
          firstName: firstName,
          lastName: lastName,
          assignedId: assignedId,
        },
      });
    } else if (redirect_url === "studentList") {
      setShowNotification(false);
      navigate("/teacher/studentList");
    }
  };

  useEffect(() => {
    if (showNotification) {
      const fetchNotifications = async () => {
        await getNotificationList();
      };
      fetchNotifications();
    }
  }, [showNotification]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotification(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div id="navbar-container">
      {!show && (
        <div
          className={`pointer me-20 ${
            isResponsive ? "h-30 w-30" : "h-37 w-37"
          }`}
          onClick={() => {
            setShow(true);
          }}
        >
          <img src={icons.menuBar} alt="menuBar" className="fit-image" />
        </div>
      )}
      <div className="navbar-main">
        <div className="page-name-div">
          {data?.name && <h3 className="user-name">{data?.name}</h3>}
          {data?.description && (
            <p className="page-pra"> {data?.description}</p>
          )}
        </div>
        <div className="end-div">
          {isNotification && (
            <div
              className="notification-div pointer"
              onClick={() => setShowNotification(true)}
            >
              <img src={icons?.notificationImg} alt="img" loading="lazy" />
              {showNotification && (
                <div className="notification-rel" ref={notificationRef}>
                  <div className="notification-header">
                    <p className="notification-title">Notifications</p>
                    <div
                      className="pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowNotification(false);
                      }}
                    >
                      <img
                        src={icons?.closeBgImg}
                        alt="close-img"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="notification-list brave-scroll">
                    {loading ? (
                      <>
                        <div>Loading...</div>
                      </>
                    ) : (
                      <>
                        {notifications.map((notification, index) => {
                          const updatedAt = new Date(notification.updatedAt);
                          const options = {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          };
                          const formattedDate = updatedAt.toLocaleDateString(
                            "en-US",
                            options
                          );

                          return (
                            <div
                              key={index}
                              className={`notification-item ${
                                notification.read ? "read" : "unread"
                              } pointer`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleNotificationClick(notification);
                              }}
                            >
                              <p className="message-title">
                                {notification.message}
                                <span className="ms-10 text-12-400">
                                  ({formattedDate})
                                </span>
                              </p>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="btn-div">
            <Button
              btnStyle="org-btn-s"
              btnText="Need Help?"
              textClass="text-16-400 font-gilroy-m"
            />
          </div>
        </div>
      </div>
      {/* <div className="search-container">
                <span className="h-24 w-24 d-flex">
                    <img
                        src={icons.search}
                        alt="search"
                        className="fit-image"
                    />
                </span>
                <input type="text" placeholder="Search" />
            </div> */}
      {/* <div className="right-end-block">
                <div
                    className={`pointer ${
                        isResponsive ? "h-30 w-30" : "h-37 w-37"
                    }`}>
                    <img
                        src={icons.message}
                        alt="message"
                        className="fit-image"
                    />
                </div>
                <div
                    className={`pointer ${
                        isResponsive ? "h-30 w-30" : "h-37 w-37"
                    }`}>
                    <img
                        src={icons.notification}
                        alt="notification"
                        className="fit-image"
                    />
                </div>
                <div className="hp-100 sp-border" />
                <div
                    className={`pointer ${
                        isResponsive ? "h-30 w-30" : "h-37 w-37"
                    }`}>
                    <img
                        src={icons.avatar}
                        alt="avatar"
                        className="fit-image"
                    />
                </div>
                <div>
                    <div className="text-16-500 color-1923">Jay Hargudson</div>
                    <div className="text-12-400 color-7f95">Admin</div>
                </div>
                <div className="h-24 w-24 pointer">
                    <img
                        src={icons.downDark}
                        alt="more"
                        className="fit-image"
                    />
                </div>
            </div> */}
    </div>
  );
};

export default Navbar;
