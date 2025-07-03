import { Button } from "@/components";
import "./VideoCanvas.scss";
import { icons, images } from "@/utils/constants";
import ReactPlayer from "react-player";
import { useEffect, useState } from "react";

const VideoCanvas = ({ show, setShow, setShowChat, showChat }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPlayingUser, setIsPlayingUser] = useState(false);
    const handlePlayClick = () => {
        setIsPlaying(true);
    };
    useEffect(() => {}, [showChat]);
    return (
        <div
            className="video-canvas-container"
            style={{ height: `${showChat ? "100%" : "100vh"}` }}>
            <div
                className={`${
                    showChat ? "video-canvas-chat" : "video-canvas"
                }`}>
                <div className={`${showChat ? "video-div-chat" : "video-div"}`}>
                    {showChat && (
                        <ReactPlayer
                            light={
                                isPlaying ? (
                                    ""
                                ) : (
                                    <img
                                        src={images?.musicImg}
                                        alt="Thumbnail"
                                    />
                                )
                            }
                            className="react-h-w-chat"
                            width="100%"
                            height="100%"
                            url="https://youtu.be/UV0mhY2Dxr0?si=KSlsWCErIx9N1JRC"
                            playing={isPlaying}
                            playsinline="true"
                            onClickPreview={() => {
                                setIsPlaying(true);
                            }}
                            onPause={() => setIsPlaying(false)}
                        />
                    )}
                    {!showChat && (
                        <ReactPlayer
                            light={
                                isPlaying ? (
                                    ""
                                ) : (
                                    <img
                                        src={images?.musicImg}
                                        alt="Thumbnail"
                                    />
                                )
                            }
                            className="react-h-w"
                            width="100%"
                            height="100%"
                            url="https://youtu.be/UV0mhY2Dxr0?si=KSlsWCErIx9N1JRC"
                            playing={isPlaying}
                            playsinline="true"
                            onClickPreview={() => {
                                setIsPlaying(true);
                            }}
                            onPause={() => setIsPlaying(false)}
                        />
                    )}
                </div>
                <div
                    className={`video-btn-div ${
                        showChat ? "border-r-remove" : " "
                    }`}>
                    <div
                        className="message-round pointer"
                        onClick={() => {
                            setShow(false);
                            setShowChat(true);
                        }}>
                        <img
                            src={
                                showChat
                                    ? icons?.messageWhiteImg
                                    : icons?.messageRoundImg
                            }
                            alt="image-icons"
                            loading="lazy"
                        />
                    </div>
                    <div className="mic-round pointer">
                        <img
                            src={icons?.micRoundImg}
                            alt="image-icons"
                            loading="lazy"
                        />
                    </div>
                    <div className="video-round pointer">
                        <img
                            src={icons?.videoRoundImg}
                            alt="image-icons"
                            loading="lazy"
                        />
                    </div>
                    <div className="preview-round pointer">
                        <img
                            src={icons?.previewRoundImg}
                            alt="image-icons"
                            loading="lazy"
                        />
                    </div>
                    <div className="setting-round pointer">
                        <img
                            src={icons?.settingRoundImg}
                            alt="image-icons"
                            loading="lazy"
                        />
                    </div>
                </div>
                <div className="other-user">
                    <div className="inner-user-div">
                        <ReactPlayer
                            light={
                                isPlayingUser ? (
                                    ""
                                ) : (
                                    <img
                                        src={images?.otherUserImg}
                                        alt="Thumbnail"
                                    />
                                )
                            }
                            className="o-react-h-w"
                            width="100%"
                            height="100%"
                            url="https://youtu.be/UV0mhY2Dxr0?si=KSlsWCErIx9N1JRC"
                            playing={isPlayingUser}
                            playsinline="true"
                            onClickPreview={() => {
                                setIsPlayingUser(true);
                            }}
                            onPause={() => setIsPlayingUser(false)}
                        />
                        <div className="user-name-div">
                            <h6 className="user-name">Alexander Dave (You)</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCanvas;
