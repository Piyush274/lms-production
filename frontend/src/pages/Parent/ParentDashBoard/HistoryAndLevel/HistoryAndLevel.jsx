import { icons } from "@/utils/constants";
import "./HistoryAndLevel.scss";
import { Button } from "@/components";
import React, { useState } from "react";
import moment from "moment";
const HistoryAndLevel = ({HistroyList}) => {
    const [changeCard, setChangeCard] = useState(1);
    return (
        <div className="history-level-container">
            <div className="row gy-4">
                <div className="col-xxl-7 col-lg-6">
                    <div className="history-left-card">
                        <h6 className="history-title">History</h6>
                        {/* <ul>
                            <li>
                                <div className="top-div">
                                    <img
                                        src={icons?.completedIcons}
                                        alt="true-icons"
                                        loading="lazy"
                                    />
                                    <p>Completed a task “Memorize 1 song”</p>
                                </div>
                                <div className="text-div">
                                    <img
                                        src={icons?.dotIcons}
                                        alt="true-icons"
                                        loading="lazy"
                                    />
                                    <p>8/09/2024</p>
                                    <img
                                        src={icons?.dotIcons}
                                        alt="true-icons"
                                        loading="lazy"
                                    />
                                    <p>1:30 PM</p>
                                </div>
                            </li>
                            <li>
                                <div className="top-div">
                                    <img
                                        src={icons?.completedIcons}
                                        alt="true-icons"
                                        loading="lazy"
                                    />
                                    <p>Completed a task “Circle of Fifths”</p>
                                </div>
                                <div className="text-div">
                                    <img
                                        src={icons?.dotIcons}
                                        alt="true-icons"
                                        loading="lazy"
                                    />
                                    <p>8/09/2024</p>
                                    <img
                                        src={icons?.dotIcons}
                                        alt="true-icons"
                                        loading="lazy"
                                    />
                                    <p>1:30 PM</p>
                                </div>
                            </li>
                            <li>
                                <div className="top-div">
                                    <img
                                        src={icons?.completedIcons}
                                        alt="true-icons"
                                        loading="lazy"
                                    />
                                    <p>Completed a task “Memorize 1 song”</p>
                                </div>
                                <div className="text-div">
                                    <img
                                        src={icons?.dotIcons}
                                        alt="true-icons"
                                        loading="lazy"
                                    />
                                    <p>8/09/2024</p>
                                    <img
                                        src={icons?.dotIcons}
                                        alt="true-icons"
                                        loading="lazy"
                                    />
                                    <p>1:30 PM</p>
                                </div>
                            </li>
                           
                                <React.Fragment>
                                    <li>
                                        <div className="top-div">
                                            <img
                                                src={icons?.completedIcons}
                                                alt="true-icons"
                                                loading="lazy"
                                            />
                                            <p>
                                                Completed a task “Memorize 1
                                                song”
                                            </p>
                                        </div>
                                        <div className="text-div">
                                            <img
                                                src={icons?.dotIcons}
                                                alt="true-icons"
                                                loading="lazy"
                                            />
                                            <p>8/09/2024</p>
                                            <img
                                                src={icons?.dotIcons}
                                                alt="true-icons"
                                                loading="lazy"
                                            />
                                            <p>1:30 PM</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="top-div">
                                            <img
                                                src={icons?.completedIcons}
                                                alt="true-icons"
                                                loading="lazy"
                                            />
                                            <p>
                                                Completed a task “Memorize 1
                                                song”
                                            </p>
                                        </div>
                                        <div className="text-div">
                                            <img
                                                src={icons?.dotIcons}
                                                alt="true-icons"
                                                loading="lazy"
                                            />
                                            <p>8/09/2024</p>
                                            <img
                                                src={icons?.dotIcons}
                                                alt="true-icons"
                                                loading="lazy"
                                            />
                                            <p>1:30 PM</p>
                                        </div>
                                    </li>
                                </React.Fragment>
                           
                        </ul> */}

{HistroyList?.length > 0 ? (
              <ul>
                {HistroyList?.map((ele, index) => {
                  const {  createdAt,status ,title} = ele;
                  const statusPending =  status ==='submitted'?'in progress':status
                  return (
                    <li key={index}>
                      <div className="top-div">
                        <img
                          src={icons?.completedIcons}
                          alt="true-icons"
                          loading="lazy"
                        />
                        <p>{`${statusPending.charAt(0).toUpperCase() + statusPending.slice(1)} a task "${title}"`}</p>

                      </div>
                      <div className="text-div">
                        <img
                          src={icons?.dotIcons}
                          alt="true-icons"
                          loading="lazy"
                        />
                        <p> {moment(createdAt).format("MM/DD/YY")}</p>

                        <img
                          src={icons?.dotIcons}
                          alt="true-icons"
                          loading="lazy"
                        />
                        <p> {moment(createdAt).format("h:mm A")}</p>
                      </div>
                    </li>
                  );
                })}
           
              </ul>
            ) : (
              <div className="f-center h-not">Not found data</div>
            )}
                    </div>
                </div>
                <div className="col-xxl-5 col-lg-6">
                    {changeCard === 1 ? (
                        <div
                            className={`history-right `}>
                            <div className="level-img">
                                <img
                                    src={icons?.levelIcons}
                                    alt="right-icons"
                                    loading="lazy"
                                />
                            </div>
                            <div>
                                <p className="level-title">Level Up</p>
                                <p className="level-pra">
                                    Complete tasks to increase your practice pad
                                    and account level!
                                </p>
                                <div className="level-btn">
                                    <Button
                                        btnStyle="b-w-37"
                                        btnText="Go to tasks"
                                        onClick={() => {
                                            setChangeCard(2);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="history-right">
                            <div className="level-img-div">
                                <img
                                    src={icons?.countIcons}
                                    alt="right-icons"
                                    loading="lazy"
                                />
                                <Button
                                    btnText="See more"
                                    btnStyle="b-w h-34"
                                />
                            </div>{" "}
                            <p className="level-title">
                                Complete goals to level up
                            </p>
                            <div className="hr-line" />
                            <p className="level-song">Learn two songs</p>
                            <div className="complete-div">
                                <p>Complete 5 skills</p>
                                <div className="skill-div">
                                    <img
                                        src={icons?.dotIcons}
                                        alt="true-icons"
                                        loading="lazy"
                                    />
                                    <p>2/5</p>
                                </div>
                            </div>
                            <div className="complete-div-2">
                                <p>Complete one lesson</p>
                                <div className="skill-div-1">
                                    <img
                                        src={icons?.dotIcons}
                                        alt="true-icons"
                                        loading="lazy"
                                    />
                                    <p>Completed</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryAndLevel;
