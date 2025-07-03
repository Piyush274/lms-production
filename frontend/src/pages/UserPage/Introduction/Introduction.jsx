import React, { useEffect, useState } from "react";
import "./Introduction.scss";
import IntroductionPopUp from "./IntroductionPopUp";
import { icons, images } from "@/utils/constants";
import ReactPlayer from "react-player";
import { Button } from "@/components";
import VirtualConsultation from "./VirtualConsultation";

const Introduction = () => {
    const [isIntroduction, setIsIntroduction] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isChange, setIsChange] = useState(false);

    const handlePlayClick = () => {
        setIsPlaying(true);
    };

    useEffect(() => {
        setIsPlaying(isPlaying);
    }, [isPlaying]);

    return (
        <div className="introduction-container">
            {!isChange ? (
                <React.Fragment>
                    <h1 className="introduction-title">Introduction</h1>
                    <p className="introduction-pra">
                        It is a long established fact that a reader will be
                        distracted by the readable content.
                    </p>
                    <div className="video-div">
                        <div className="vide-img">
                            <ReactPlayer
                                light={
                                    isPlaying ? (
                                        ""
                                    ) : (
                                        <img
                                            src={images?.introductionImg}
                                            alt="Thumbnail"
                                        />
                                    )
                                }
                                className="player-width-height"
                                // width="100%"
                                // height="470px"
                                url="https://youtu.be/UV0mhY2Dxr0?si=KSlsWCErIx9N1JRC"
                                // controls={false}
                                playing={isPlaying}
                                playsinline="true"
                                onClickPreview={() => {
                                    setIsPlaying(true);
                                }}
                                onPause={() => setIsPlaying(false)}
                            />
                            {!isPlaying && (
                                <div
                                    className="play-btn pointer"
                                    onClick={handlePlayClick}>
                                    <img
                                        src={icons?.playBtnImg}
                                        alt="play-icons"
                                        loading="lazy"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="btn-introduction">
                        <Button
                            textClass="text-17-400 font-gilroy-bold"
                            btnStyle="og"
                            btnText="I’m Ready"
                            onClick={() => {
                                setIsChange(true);
                            }}
                        />
                    </div>
                </React.Fragment>
            ) : (
                <VirtualConsultation />
            )}

            {isIntroduction && (
                <IntroductionPopUp
                    onHide={() => {
                        setIsIntroduction(false);
                    }}
                    isClose={() => {
                        setIsIntroduction(false);
                    }}
                />
            )}
        </div>
    );
};

export default Introduction;
