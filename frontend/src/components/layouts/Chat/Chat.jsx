import { useEffect, useState } from "react";
import "./Chat.scss";
import Inbox from "./Inbox";
import MessageBox from "./MessageBox";
import Sidebar from "./Sidebar";
import { icons } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { CreateChatGroup } from "@/components";
import { fetchAllGroup, setShowChatGroupPopup } from "@/store/globalSlice";

const Chat = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [show, setShow] = useState(false);
  const { showChatGroupPopup } = useSelector((state) => state.global);

  const dispatch = useDispatch();
  const inboxList = [
    {
      images: icons?.userIImg,
      name: "Charlie Ray",
      id: "01",
    },
    {
      images: icons?.userTwoImg,
      name: "Mr. Smith",
      active: true,
      id: "02",
    },
    {
      images: icons?.userIImg,
      name: "Charlie Ray",
      id: "03",
    },
    {
      images: icons?.gImg,
      name: "Guitar Group chat",
      description: "Charlie Ray, Mr Smith, Samu...",
      type: "group",
      id: "04",
    },
    {
      images: icons?.pImg,
      name: "Piano Group chat",
      description: " Charlie Ray, Mr Smith, Samu...",
      type: "group",
      id: "05",
    },
  ];

  // Fetch the students list

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // fetchAllGroup
  const isResponsive = windowWidth < 990;

  return (
    <>
      <section className="chat-container">
        {isResponsive && show && (
          <Sidebar
            show={show}
            setShow={setShow}
            isResponsive={isResponsive}
            inboxList={inboxList}
          />
        )}
        <div className="row gy-4">
          <div className="col-xxl-8 col-md-12">
            <MessageBox setShow={setShow} isResponsive={isResponsive} />
          </div>
          <div className="col-xxl-4 col-md-12">
            {!isResponsive && <Inbox />}
          </div>
        </div>
      </section>

      {showChatGroupPopup && (
        <CreateChatGroup
          onHide={() => dispatch(setShowChatGroupPopup(false))}
          handleSuccess={() => dispatch(setShowChatGroupPopup(false))}
        />
      )}
    </>
  );
};

export default Chat;
