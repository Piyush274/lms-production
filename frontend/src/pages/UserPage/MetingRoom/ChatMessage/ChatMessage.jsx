import React from "react";
import "./ChatMessage.scss";
import { Offcanvas } from "react-bootstrap";
import { icons } from "@/utils/constants";
import ChatSearchInput from "@/components/inputs/ChatSearchInput";

const ChatMessage = ({ setShowChat, showChat, setShow }) => {
    return (
        <div className="chat-w">
            {" "}
            {showChat && (
                <Offcanvas
                    show={showChat}
                    onHide={() => {
                        setShowChat(false);
                    }}
                    placement="end"
                    name="end"
                    responsive="xl">
                    {/* <Offcanvas.Header closeButton>
                        <Offcanvas.Title className="title-slide">
                            Chat
                        </Offcanvas.Title>
                    </Offcanvas.Header> */}
                    <Offcanvas.Body>
                        <div id="chat-sidebar-container">
                            <div className="chat-card">
                                <div className="top-div">
                                    <p className="message-text">
                                        In call messages
                                    </p>
                                    <div
                                        className="pointer"
                                        onClick={() => {
                                            setShowChat(false);
                                            if (window.innerWidth >= 1200) {
                                                setShow(true);
                                            } else {
                                                setShow(false);
                                            }
                                        }}>
                                        <img
                                            src={icons?.eventClose}
                                            alt="close-img"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                                <div className="end-div">
                                    <div className="chat-box  brave-scroll">
                                        <div className="user-top-c">
                                            <div className="user-panel-c">
                                                <div className="text-div-c">
                                                    Hi Alexander, How are you
                                                    doing today, Don’t forget
                                                    about our lesson scheduled
                                                    for Monday. Do let me know
                                                    if you won’t be able to make
                                                    it
                                                </div>
                                                <p className="user-message-text-c">
                                                    9:02 AM
                                                </p>
                                            </div>
                                        </div>
                                        <div className="message-panel-c">
                                            <div className="other-user-d-c"></div>
                                            <div className="other-user-message-div-c">
                                                <div className="other-user-message-c">
                                                    I’ll be available, thanks
                                                    Charlie.
                                                    <div className="other-user-img-c">
                                                        <img
                                                            src={
                                                                icons?.userADImg
                                                            }
                                                            alt="user-img"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="other-user-message-time-c">
                                                    <p className="other-user-message-texts-c">
                                                        Alexander Dave
                                                    </p>
                                                    <div className="other-user-message-div-c">
                                                        <img
                                                            src={
                                                                icons?.dotIcons
                                                            }
                                                            alt="dot-icons"
                                                            loading="lazy"
                                                        />
                                                        <p className="other-user-message-text-c">
                                                            9:02 AM
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="chat-send-div">
                                        <ChatSearchInput />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Offcanvas.Body>
                </Offcanvas>
            )}
        </div>
    );
};

export default ChatMessage;
