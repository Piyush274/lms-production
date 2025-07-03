import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useEffect, useRef, useState } from "react";
import "./Layout.scss";

const Layout = ({
  children,
  role,
  setShow,
  show,
  data,
  handleLogout,
  isNotification,
  
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navbarRef = useRef(null);
  const [navbarHeight, setNavbarHeight] = useState(0);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);

  useEffect(() => {
    if (navbarRef?.current) {
      setNavbarHeight(navbarRef?.current?.offsetHeight);
    }
  }, [windowWidth]);

  const isResponsive = windowWidth < 992;
  const isRes = windowWidth < 1395;

  return (
    <div id="layout-container">
      <Sidebar
        isResponsive={isResponsive}
        show={show}
        setShow={setShow}
        role={role}
        handleLogout={handleLogout}
      />
      <div
        className={`right-body-content ${
          isRes && show && !isResponsive ? "isres" : ""
        }`}
      >
        <div className="navBlock" ref={navbarRef}>
          <Navbar
            isResponsive={isResponsive}
            setShow={setShow}
            show={show}
            data={data}
            isNotification={isNotification}
            
          />
        </div>
        <div
          className="content brave-scroll"
          style={{ height: `calc(100dvh - ${navbarHeight}px)` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
