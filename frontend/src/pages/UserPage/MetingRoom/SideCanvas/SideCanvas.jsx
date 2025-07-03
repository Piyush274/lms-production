import { icons, images } from "@/utils/constants";
import "./SideCanvas.scss";
import { Offcanvas } from "react-bootstrap";
import FileUpload from "@/components/inputs/FileUpload";
import { Button } from "@/components";
import ReactPlayer from "react-player";
import { useState } from "react";

const SideCanvas = ({ show, setShow }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [storeFile, setStoreFile] = useState("");

    const supportList = [
        {
            images: icons?.fileDocsIcons,
            docsName: "Manual.docx",
            date: "08/09/24",
            time: "9:02 AM",
        },
        {
            images: icons?.fileDocsIcons,
            docsName: "Manual.docx",
            date: "08/09/24",
            time: "9:02 AM",
        },
        {
            images: icons?.fileDocsIcons,
            docsName: "Manual.docx",
            date: "08/09/24",
            time: "9:02 AM",
        },
    ];
    const TutorialList = [
        {
            images: icons?.fileVideoIcons,
            docsName: "Manual.docx",
            date: "08/09/24",
            time: "9:02 AM",
        },
        {
            images: icons?.fileVideoIcons,
            docsName: "Manual.docx",
            date: "08/09/24",
            time: "9:02 AM",
        },
        {
            images: icons?.fileVideoIcons,
            docsName: "Manual.docx",
            date: "08/09/24",
            time: "9:02 AM",
        },
        {
            images: icons?.fileVideoIcons,
            docsName: "Manual.docx",
            date: "08/09/24",
            time: "9:02 AM",
        },
        {
            images: icons?.fileVideoIcons,
            docsName: "Manual.docx",
            date: "08/09/24",
            time: "9:02 AM",
        },
    ];
    const personalTutorialsList = [
        {
            images: icons?.fileVideoIcons,
            docsName: "Manual.docx",
            date: "08/09/24",
            time: "9:02 AM",
        },
        {
            images: icons?.fileVideoIcons,
            docsName: "Manual.docx",
            date: "08/09/24",
            time: "9:02 AM",
        },
        {
            images: icons?.fileVideoIcons,
            docsName: "Manual.docx",
            date: "08/09/24",
            time: "9:02 AM",
        },
    ];
    const noteList = [
        {
            title: "Try to master the common notes first",
        },
        {
            title: "After you master the common notes, you can then watch the personal tutorials",
        },
        {
            title: "Good luck!",
        },
    ];
    const handlePlayClick = () => {
        setIsPlaying(true);
    };
    return (
        <div>
            {show && (
                <Offcanvas
                    show={show}
                    onHide={() => {
                        setShow(false);
                    }}
                    responsive="xl">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title className="title-slide">
                            Skill
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <div id="meeting-sidebar-container">
                            <div className="skill-card">
                                <h2 className="skill-title">Skill details</h2>
                                {/* /* <RattingInput /> */}
                                <div className="d-flex gap-1">
                                    {["1", "2", "3", "4", "5"].map(
                                        (ele, oindex) => {
                                            return (
                                                <div
                                                    key={oindex}
                                                    className="rating-img">
                                                    <img
                                                        src={
                                                            icons?.starLightImg
                                                        }
                                                        alt="rating-icons"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                                <div className="title-div">
                                    <h4 className="title-text">Title:</h4>
                                    <p className="title-pra">New Skill</p>
                                </div>
                                <div className="instrument-div">
                                    <h4 className="instrument-text">
                                        Instrument :
                                    </h4>
                                    <p className="instrument-pra">Guitar</p>
                                </div>
                                <div className="category-div">
                                    <h4 className="category-text">
                                        Category :
                                    </h4>
                                    <p className="category-pra">-</p>
                                </div>
                                <div className="description-div">
                                    <h4 className="description-text">
                                        Description :
                                    </h4>
                                    <p className="description-pra">-</p>
                                </div>
                                <h2 className="skill-percentage">0%</h2>
                            </div>
                            <div className="student-card">
                                <h2 className="student-title">
                                    Student Response Videos
                                </h2>
                                <p className="video-pra">
                                    Record a video for the instructor to grade
                                    or upload a file
                                </p>
                                <div className="input-v">
                                    <FileUpload setStoreFile={setStoreFile} />
                                </div>
                                <div className="btn-video">
                                    <Button
                                        rightIcon={icons?.micImg}
                                        textClass="font-gilroy-sb text-16-400"
                                        btnText="Record Video"
                                    />
                                </div>
                            </div>
                            <div className="supporting-document-card">
                                <h3 className="support-title">
                                    Supporting Documents
                                </h3>
                                {supportList.map((ele, index) => {
                                    const { images, date, docsName, time } =
                                        ele;
                                    return (
                                        <div
                                            key={index}
                                            className="fb-center border-b-l">
                                            <div className="docs-main-div">
                                                <div className="docs-div">
                                                    <img
                                                        src={images}
                                                        alt="docs-icons"
                                                        loading="lazy"
                                                    />
                                                    <p className="docs-text">
                                                        {docsName}
                                                    </p>
                                                </div>
                                                <div className="docs-time">
                                                    <p className="date-text">
                                                        {date}
                                                    </p>

                                                    <div className="time-div">
                                                        <img
                                                            src={
                                                                icons?.bgDarkImg
                                                            }
                                                            alt="docs-icons"
                                                            loading="lazy"
                                                        />
                                                        <p className="time-text">
                                                            {time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                textClass="font-gilroy-m"
                                                btnText="Open"
                                                btnStyle="org-btn-2"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="tutorial-card">
                                <h3 className="tutorial-title">
                                    Tutorial Videos
                                </h3>
                                {TutorialList?.map((ele, index) => {
                                    const { images, date, docsName, time } =
                                        ele;
                                    return (
                                        <div
                                            key={index}
                                            className="fb-center border-b-l">
                                            <div className="docs-main-div">
                                                <div className="docs-div">
                                                    <img
                                                        src={images}
                                                        alt="docs-icons"
                                                        loading="lazy"
                                                    />
                                                    <p className="docs-text">
                                                        {docsName}
                                                    </p>
                                                </div>
                                                <div className="docs-time">
                                                    <p className="date-text">
                                                        {date}
                                                    </p>

                                                    <div className="time-div">
                                                        <img
                                                            src={
                                                                icons?.bgDarkImg
                                                            }
                                                            alt="docs-icons"
                                                            loading="lazy"
                                                        />
                                                        <p className="time-text">
                                                            {time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                textClass="font-gilroy-m"
                                                btnText="Open"
                                                btnStyle="org-btn-2"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="personal-card">
                                <h3 className="personal-title">
                                    Personal Tutorials
                                </h3>
                                <div className="personal-label">
                                    <img
                                        src={icons?.informationImg}
                                        alt="information-img"
                                        loading="lazy"
                                    />
                                    <h2 className="personal-la">
                                        This videos were sent to you personally
                                        from the instructor.
                                    </h2>
                                </div>
                                {personalTutorialsList?.map((ele, index) => {
                                    const { images, date, docsName, time } =
                                        ele;
                                    return (
                                        <div
                                            key={index}
                                            className="fb-center border-b-l">
                                            <div className="docs-main-div">
                                                <div className="docs-div">
                                                    <img
                                                        src={images}
                                                        alt="docs-icons"
                                                        loading="lazy"
                                                    />
                                                    <p className="docs-text">
                                                        {docsName}
                                                    </p>
                                                </div>
                                                <div className="docs-time">
                                                    <p className="date-text">
                                                        {date}
                                                    </p>

                                                    <div className="time-div">
                                                        <img
                                                            src={
                                                                icons?.bgDarkImg
                                                            }
                                                            alt="docs-icons"
                                                            loading="lazy"
                                                        />
                                                        <p className="time-text">
                                                            {time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                textClass="font-gilroy-m"
                                                btnText="Open"
                                                btnStyle="org-btn-2"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="external-card">
                                <h3 className="external-title">
                                    External Videos (Youtube)
                                </h3>
                                <div className="external-div">
                                    <div className="external-img">
                                        <ReactPlayer
                                            light={
                                                isPlaying ? (
                                                    ""
                                                ) : (
                                                    <img
                                                        src={images?.youtubeImg}
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
                                            <div className="external-play-btn-bg">
                                                <div
                                                    className="external-play-btn pointer"
                                                    onClick={handlePlayClick}>
                                                    <img
                                                        src={
                                                            icons?.youtubeLightImg
                                                        }
                                                        alt="play-icons"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="external-time">
                                        <p className="external-text">
                                            08/09/24
                                        </p>

                                        <div className="external-div-inner">
                                            <img
                                                src={icons?.bgDarkImg}
                                                alt="docs-icons"
                                                loading="lazy"
                                            />
                                            <p className="external-text">
                                                9:02 AM
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="note-card">
                                <h3 className="note-title">Notes</h3>
                                {noteList?.map((ele, index) => {
                                    const { title } = ele;
                                    return (
                                        <div
                                            key={index}
                                            className="d-flex align-items-center d-img">
                                            <img
                                                src={icons?.dragDropImg}
                                                alt="img"
                                                loading="lazy"
                                            />
                                            <p className="title-note-text">
                                                {title}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Offcanvas.Body>
                </Offcanvas>
            )}
        </div>
    );
};

export default SideCanvas;
