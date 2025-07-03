import { useState, useEffect, useRef } from "react";
import "./ChatWindow.scss";
import MessageSendInput from "@/components/inputs/MessageSendInput";
import { Button, Roundedloader } from "@/components";
import { icons } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMessages, setSelectedFile } from "@/store/globalSlice";
import { getDataFromLocalStorage } from "@/utils/helpers";

import io from "socket.io-client";

const ChatWindow = () => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.global);
  const { selectedFile, groupId } = reduxData || {};
  const [inputValue, setInputValue] = useState("");

  const [messagesLoader, setMessagesLoader] = useState(false);
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);

  const socket = io.connect(import.meta.env.VITE_SOCKET_URL, {
    reconnection: true,
  });

  const userId = getDataFromLocalStorage("userId");
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleAddMessage = (newMessage) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { ...newMessage, id: prevMessages.length + 1 },
    ]);
  };

  // const handleSend = () => {
  //   if (inputValue.trim() || selectedFile) {
  //     handleAddMessage({
  //       type: "sent",
  //       text: inputValue,
  //       file: selectedFile
  //         ? {
  //             name: selectedFile.name,
  //           }
  //         : undefined,
  //       time: new Date().toLocaleTimeString(),
  //     });
  //     setInputValue("");
  //     dispatch(setSelectedFile(null));
  //   }
  // };

  const fetchAllMessagesData = async () => {
    setMessagesLoader(true);
    const res = await dispatch(fetchAllMessages(groupId));
    if (res?.status === 200) {
      setMessages(res?.data?.response);
      setMessagesLoader(false);
    }
    setMessagesLoader(false);
  };

  const triggerEvent = (event, data) => {
    socket.emit(event, JSON.stringify(data));
  };

  useEffect(() => {
    if (groupId) {
      fetchAllMessagesData();
      if (socket) {
        setTimeout(() => {
          triggerEvent("JOIN ROOM", { group_id: groupId });
        }, 1000);
      }
    }
    return () => {
      triggerEvent("LEAVE ROOM", { group_id: groupId });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  const handleSend = async () => {
    const payload = {
      group_id: groupId,
      user_id: getDataFromLocalStorage("userId"),
      message_type: "text",
      message: inputValue,
    };

    triggerEvent("SEND MESSAGE", payload);
    setInputValue("");
    // triggerEvent("SIDEBAR", { userId: receiverId });
  };

  const handleReceiveMessage = (msgObject) => {
    // Construct the data object
    const data = {
      file: null,
      msg_type: msgObject?.message_type,
      sender: msgObject?.senderName || "",
      senderId: msgObject?.senderId,
      text: msgObject?.message,
      time: msgObject?.createdAt,
    };

    // Update the state with the new message
    setMessages((prevMessages) => [...prevMessages, data]);
  };

  useEffect(() => {
    if (socket) {
      socket.on("RECEIVER", (data) => {
        const { type, payload, sidebar } = data;
        switch (type) {
          case "RECEIVE MESSAGE":
            handleReceiveMessage(payload);

            break;
          // case "SIDEBAR":
          //   dispatch(setChatSidebar(sidebar));
          //   break;
          // case "TYPING":
          //   setIsType(payload.isTyping);
          //   break;
          default:
            break;
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const handleFileUpload = (file) => {
    dispatch(setSelectedFile(file));
  };

  // Update message types based on senderId and userId
  const updatedMessages = messages.map((message) => {
    if (message.senderId === userId) {
      return { ...message, type: "sent" };
    } else {
      return { ...message, type: "received" };
    }
  });

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex-grow-1 overflow-auto">
      <div className="message-div">
        {messagesLoader ? (
          <div className="mt-100 mb-100 f-center flex-grow-1 ">
            <Roundedloader type="D" size="md" />
          </div>
        ) : (
          <div className="message-top">
            {updatedMessages?.map((message, index) => (
              <div
                key={index}
                className={
                  message.type === "sent" ? "user-top" : "message-panel"
                }
              >
                {/* Rendering message content */}
                {message.type === "received" && (
                  <div className="other-user-message-div">
                    <div className="other-user-message">
                      {message.text}
                      {/* <div className="other-user-img">
                      <img src={message.avatar} alt="user-img" loading="lazy" />
                    </div> */}
                    </div>
                    <div className="other-user-message-time">
                      <p className="other-user-message-texts">
                        {message.sender}
                      </p>
                      <div className="other-user-message-div">
                        <img
                          src={icons.dotIcons}
                          alt="dot-icons"
                          loading="lazy"
                        />
                        <p className="other-user-message-text">
                          {" "}
                          {formatTime(message.time)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {message.type === "sent" && (
                  <div className="user-panel">
                    {message.text && (
                      <div className="text-div">{message.text}</div>
                    )}
                    {message.file && (
                      <div className="user-file">
                        <div className="file-div">
                          <div className="file-img">
                            <img
                              src={icons.fileDocsIcons}
                              alt="file-docs"
                              loading="lazy"
                            />
                          </div>
                          <h4 className="file-name">{message.file.name}</h4>
                        </div>
                      </div>
                    )}
                    <p className="user-message-text">
                      {formatTime(message.time)}
                    </p>
                  </div>
                )}

                {message.type === "skill" && (
                  <div className="skill-panel">
                    <div className="skill-div">
                      <div className="skill-message-div">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h6 className="skill-title">{message.title}</h6>
                            <p className="skill-pra">{message.category}</p>
                          </div>
                          <div className="star-div">
                            <img
                              src={icons.starOIcons}
                              alt="star-img"
                              loading="lazy"
                            />
                          </div>
                        </div>
                        <div className="fb-center">
                          <h4 className="text-p">{message.progress}</h4>
                          <Button
                            textClass="text-12-400 font-gilroy-sb"
                            btnText="Go to skill"
                            btnStyle="s-o-btn"
                          />
                        </div>
                        <div className="skill-img">
                          <img
                            src={message.avatar}
                            alt="user-img"
                            loading="lazy"
                          />
                        </div>
                      </div>
                      <div className="skill-time">
                        <p className="skill-texts">
                          {message.addedBy} added a new skill
                        </p>
                        <div className="skills-div">
                          <div className="skill-top">
                            <img
                              src={icons.dotIcons}
                              alt="dot-icons"
                              loading="lazy"
                            />
                            <p className="skill-text">{message.time}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {/* Add ref to the end of the message list for scrolling */}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="search-div">
          <MessageSendInput
            placeholder="Message Charlie Roy"
            onClick={handleSend}
            onChange={(e) => setInputValue(e.target.value)}
            onFileUpload={handleFileUpload}
            value={inputValue}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;

// import { useState, useEffect, useRef } from "react";
// import "./ChatWindow.scss";
// import MessageSendInput from "@/components/inputs/MessageSendInput";
// import { Button } from "@/components";
// import { icons } from "@/utils/constants";
// import { useDispatch, useSelector } from "react-redux";
// import { setSelectedFile } from "@/store/globalSlice";

// const ChatWindow = () => {
//   const dispatch = useDispatch();
//   const reduxData = useSelector((state) => state.global);
//   const { selectedFile } = reduxData || {};
//   const [inputValue, setInputValue] = useState("");
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       type: "received",
//       sender: "Charlie Ray",
//       text: "Hi Alexander, How are you doing today? Don’t forget about our lesson scheduled for Monday. Do let me know if you won’t be able to make it",
//       time: "9:02 AM",
//       avatar: icons.userIImg,
//     },
//     {
//       id: 2,
//       type: "sent",
//       text: "I’ll be available, thanks Charlie.",
//       time: "9:02 AM",
//     },
//     {
//       id: 3,
//       type: "sent",
//       text: "I found this manual online, sharing it with you now!",
//       time: "9:02 AM",
//     },
//     {
//       id: 4,
//       type: "sent",
//       file: {
//         name: "Manual.docx",
//       },
//       time: "9:02 AM",
//     },
//     {
//       id: 5,
//       type: "sent",
//       file: {
//         name: "Manual.docx",
//         icon: icons.fileVideoIcons,
//       },
//       time: "9:02 AM",
//     },
//     {
//       id: 6,
//       type: "skill",
//       title: "Tuning",
//       category: "Guitar",
//       progress: "0%",
//       addedBy: "Charlie Ray",
//       time: "9:02 AM",
//       avatar: icons.userIImg,
//     },
//   ]);

//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   const handleAddMessage = (newMessage) => {
//     setMessages((prevMessages) => [
//       ...prevMessages,
//       { ...newMessage, id: prevMessages.length + 1 },
//     ]);
//   };

//   const handleSend = () => {
//     if (inputValue.trim() || selectedFile) {
//       handleAddMessage({
//         type: "sent",
//         text: inputValue,
//         file: selectedFile
//           ? {
//               name: selectedFile.name,
//             }
//           : undefined,
//         time: new Date().toLocaleTimeString(),
//       });
//       setInputValue("");
//       dispatch(setSelectedFile(null));
//     }
//   };

//   const handleFileUpload = (file) => {
//     dispatch(setSelectedFile(file));
//   };

//   return (
//     <div className="flex-grow-1 overflow-auto">
//       <div className="message-div">
//         <div className="message-top">
//           {messages.map((message) => (
//             <div
//               key={message.id}
//               className={message.type === "sent" ? "user-top" : "message-panel"}
//             >
//               {/* Rendering message content */}
//               {message.type === "received" && (
//                 <div className="other-user-message-div">
//                   <div className="other-user-message">
//                     {message.text}
//                     <div className="other-user-img">
//                       <img src={message.avatar} alt="user-img" loading="lazy" />
//                     </div>
//                   </div>
//                   <div className="other-user-message-time">
//                     <p className="other-user-message-texts">{message.sender}</p>
//                     <div className="other-user-message-div">
//                       <img
//                         src={icons.dotIcons}
//                         alt="dot-icons"
//                         loading="lazy"
//                       />
//                       <p className="other-user-message-text">{message.time}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {message.type === "sent" && (
//                 <div className="user-panel">
//                   {message.text && (
//                     <div className="text-div">{message.text}</div>
//                   )}
//                   {message.file && (
//                     <div className="user-file">
//                       <div className="file-div">
//                         <div className="file-img">
//                           <img
//                             src={icons.fileDocsIcons}
//                             alt="file-docs"
//                             loading="lazy"
//                           />
//                         </div>
//                         <h4 className="file-name">{message.file.name}</h4>
//                       </div>
//                     </div>
//                   )}
//                   <p className="user-message-text">{message.time}</p>
//                 </div>
//               )}

//               {message.type === "skill" && (
//                 <div className="skill-panel">
//                   <div className="skill-div">
//                     <div className="skill-message-div">
//                       <div className="d-flex justify-content-between">
//                         <div>
//                           <h6 className="skill-title">{message.title}</h6>
//                           <p className="skill-pra">{message.category}</p>
//                         </div>
//                         <div className="star-div">
//                           <img
//                             src={icons.starOIcons}
//                             alt="star-img"
//                             loading="lazy"
//                           />
//                         </div>
//                       </div>
//                       <div className="fb-center">
//                         <h4 className="text-p">{message.progress}</h4>
//                         <Button
//                           textClass="text-12-400 font-gilroy-sb"
//                           btnText="Go to skill"
//                           btnStyle="s-o-btn"
//                         />
//                       </div>
//                       <div className="skill-img">
//                         <img
//                           src={message.avatar}
//                           alt="user-img"
//                           loading="lazy"
//                         />
//                       </div>
//                     </div>
//                     <div className="skill-time">
//                       <p className="skill-texts">
//                         {message.addedBy} added a new skill
//                       </p>
//                       <div className="skills-div">
//                         <div className="skill-top">
//                           <img
//                             src={icons.dotIcons}
//                             alt="dot-icons"
//                             loading="lazy"
//                           />
//                           <p className="skill-text">{message.time}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//           {/* Add ref to the end of the message list for scrolling */}
//           <div ref={messagesEndRef} />
//         </div>
//         <div className="search-div">
//           <MessageSendInput
//             placeholder="Message Charlie Roy"
//             onClick={handleSend}
//             onChange={(e) => setInputValue(e.target.value)}
//             onFileUpload={handleFileUpload}
//             value={inputValue}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;
