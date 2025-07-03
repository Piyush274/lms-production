import { icons } from "@/utils/constants";
import { useState } from "react";
import { Offcanvas } from "react-bootstrap";

const Sidebar = ({ show, setShow, isResponsive, inboxList }) => {
    const [activeUserId, setActiveUserId] = useState(1);

    const handleUserClick = (userId) => {
        setActiveUserId(userId);
    };

    return (
        <Offcanvas
            show={show}
            onHide={() => {
                setShow(false);
            }}
            responsive="lg"
            placement="end">
            <Offcanvas.Header closeButton></Offcanvas.Header>
            <Offcanvas.Body>
                <div className="chat-sidebar-block">
                    <div className="fb-center">
                        <div className="text-18-500 color-1923 px-22 py-20 bg-2b05">
                            Chats
                        </div>
                        {isResponsive && (
                            <div
                                className="h-16 w-16 pointer d-flex me-22"
                                onClick={() => {
                                    setShow(false);
                                }}>
                                <img
                                    src={icons.close}
                                    alt="close"
                                    className="fit-image"
                                />
                            </div>
                        )}
                    </div>
                    <div
                        className="flex-grow-1 position-relative"
                        style={{ height: "80%" }}>
                        <div>
                            {inboxList?.map((user, index) => (
                                <div
                                    key={index}
                                    className={`user-div pointer  ${
                                        activeUserId === index
                                            ? "active-d bg-eded"
                                            : ""
                                    }`}
                                    onClick={() => handleUserClick(index)}>
                                    <div className="px-20 py-20 fb-center flex-nowrap">
                                        <div className="user-img fa-center gap-3 flex-nowrap">
                                            <img
                                                src={user?.images}
                                                alt=""
                                                loading="lazy"
                                                className="w-40 h-40"
                                            />
                                            <div>
                                                <h6 className="user-text text-18-400 font-gilroy-m">
                                                    {user.name}
                                                </h6>
                                                {user.description && (
                                                    <h6 className="user-pra text-12-400 font-gilroy-m">
                                                        {user.description}
                                                    </h6>
                                                )}
                                            </div>
                                        </div>
                                        {user?.active && (
                                            <img
                                                src={icons.onlineImg}
                                                alt="active-icon"
                                                loading="lazy"
                                                className="h-5 w-5"
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default Sidebar;
