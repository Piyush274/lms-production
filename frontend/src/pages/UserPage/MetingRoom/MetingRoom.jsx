import { Offcanvas } from "react-bootstrap";
import "./MetingRoom.scss";
import { useEffect, useState } from "react";
import { Button } from "@/components";
import { icons, images } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
// import RattingInput from "@/components/inputs/RattingInput";
import ReactPlayer from "react-player";
import FileUpload from "@/components/inputs/FileUpload";
import SideCanvas from "./SideCanvas";
import VideoCanvas from "./VideoCanvas";
import ChatMessage from "./ChatMessage";

function MetingRoom() {
    const navigate = useNavigate();
    const [show, setShow] = useState(true);
    const [showChat, setShowChat] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    // const [storeFile, setStoreFile] = useState("");

    // const handlePlayClick = () => {
    //     setIsPlaying(true);
    // };

    useEffect(() => {
        setIsPlaying(isPlaying);
    }, [isPlaying]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1200) {
                setShow(false);
            } else {
                setShow(true);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    return (
        <div className="meting-id">
            <div
                className={`${
                    showChat
                        ? "meting-room-chat-container"
                        : "meting-room-container"
                }`}>
                {!showChat ? (
                    <div className="mb-24 d-flex align-items-center gap-2 main-div">
                        {!show && (
                            <div className="menu-div">
                                <img
                                    src={icons?.MenuIcons}
                                    onClick={() => {
                                        setShow(true);
                                    }}
                                />
                            </div>
                        )}
                        <div>
                            <Button
                                textClass="font-gilroy-m"
                                leftIcon={icons?.leftWhiteImg}
                                btnText="Leave meeting"
                                btnStyle="m-btn"
                                onClick={() => {
                                    navigate(-1);
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="skill-div">
                        <div className="container">
                            <h6 className="skill-name"> Skill: Bruno Mars </h6>
                        </div>
                    </div>
                )}
                <div
                    className={`${
                        showChat ? "right-content" : "left-content"
                    }`}>
                    <div className={`d-flex${showChat ? "" : " gap-xl-5"}`}>
                        {!showChat && (
                            <SideCanvas show={show} setShow={setShow} />
                        )}
                        <VideoCanvas
                            show={show}
                            setShow={setShow}
                            setShowChat={setShowChat}
                            showChat={showChat}
                        />
                        <ChatMessage
                            show={show}
                            setShow={setShow}
                            setShowChat={setShowChat}
                            showChat={showChat}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MetingRoom;
