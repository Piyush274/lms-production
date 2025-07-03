import { icons } from "@/utils/constants";
import "./AccountSettings.scss";
import { getInitialsVal } from "@/utils/helpers";
import { AdminResetPopup, Button } from "@/components";
import Progress from "@/components/layouts/Progress";
import React, { useState } from "react";
import EditProfilePopUp from "./EditProfilePopUp";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, setShowAdminresetPopup } from "@/store/globalSlice";
import { useNavigate } from "react-router-dom";

const AccountSettings = () => {
  const navigate = useNavigate()
  const reduxData = useSelector((state) => state.global);
  const { profileData, showAdminresetPopup } = reduxData || {};

  const [showLevel, setShowLevel] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const numbers = Array.from({ length: 42 }, (_, index) => index + 2);
  const numbersOne = Array.from({ length: 42 }, (_, index) => index + 1);
  const dispatch = useDispatch();

  const completeList = [
    {
      title: "Complete one lesson",
      description: "Completed",
    },
    {
      title: "Join a lesson",
      description: "Completed",
    },
    {
      title: "Complete one lesson",
      description: "Completed",
    },
  ];
  return (
    <section className="account-setting-container">
      <div className="account-card">
        {!showLevel ? (
          <React.Fragment>
            <div className="details-div">
              <div>
                <div className="profile-div">
                  <div className="img-div">
                    {profileData?.profileImage ? (
                      <img
                        src={profileData?.profileImage}
                        alt="user-img"
                        loading="lazy"
                      />
                    ) : (
                      <React.Fragment>
                        <img
                          src={icons?.bgDarkImg}
                          alt="bg-img"
                          loading="lazy"
                        />
                        <p className="user-name">
                          {getInitialsVal(
                            `${profileData?.firstName} ${profileData?.lastName}`
                          )}
                        </p>
                      </React.Fragment>
                    )}
                  </div>
                  <h4 className="user-name-1">
                    {`${profileData?.firstName} ${profileData?.lastName}`}
                  </h4>
                  <p className="user-email">{profileData?.email}</p>
                  <div className="plan-div"></div>
                </div>
                <div className="btn-div">
                  <h5 className="package-text">{profileData?.selectedPlan?.title|| ""}</h5>
                  <h5 className="package-pra pointer"
                  onClick={()=>navigate("/user/billing")}
                  >Upgrade Plan</h5>
                </div>
              </div>
              <div className="right-btn">
                <Button
                  btnText="Edit Profile"
                  btnStyle="og-1 h-43"
                  onClick={() => {
                    setIsEdit(true);
                  }}
                />
                <Button
                  textClass="font-gilroy-m"
                  btnText="Reset Password"
                  btnStyle="org-btn-1 h-43"
                  onClick={() => {
                    dispatch(setShowAdminresetPopup(true));
                  }}
                />
              </div>
            </div>
            <div className="level-div">
              <div className="level-top">
                <p className="level-text"> Account Level</p>
                <p
                  className="level-pra pointer"
                  onClick={() => {
                    setShowLevel(true);
                  }}
                >
                  {" "}
                  View history
                </p>
              </div>
              <div className="div-p">
                {numbers.map((number, index) => (
                  <div className="main-div" key={number}>
                    <div className={`${index === 0 ? "polygon" : "polygon-g"}`}>
                      <div className="polygon-ab">{number}</div>
                    </div>
                    {index < numbers.length - 1 && (
                      <div className="arrow-div">
                        <img
                          src={icons?.arrowLeftImg}
                          className="arrow"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-16">
                <Progress now="20" />
              </div>
              <p className="level-text-g">
                Complete the following goals to level up:
              </p>
              <p className="level-text-s"> Learn two songs</p>
              <div className="goals-div">
                <p className="goals-text">Create five goals</p>
                <div className="point-div">
                  <img src={icons?.dotIcons} alt="dot-icons" loading="lazy" />
                  <p className="point-text">2/5</p>
                </div>
              </div>
              <div className="Complete-div">
                <p className="Complete-texts">Complete one lesson</p>
                <div className="Completes-div">
                  <img src={icons?.dotIcons} alt="dot-icons" loading="lazy" />
                  <p className="Complete-text">Completed</p>
                </div>
              </div>
            </div>
          </React.Fragment>
        ) : (
          <div className="level-u-box">
            <Button
              textClass="text-16-400 font-gilroy-m"
              btnText="Back"
              btnStyle="btn-l"
              leftIcon={icons.backicon}
              onClick={() => setShowLevel(false)}
            />
            <div className="level-a">
              <div className="level-b">
                <img
                  src={icons?.polygonsImg}
                  alt="polygon-img"
                  loading="lazy"
                />
                <p className="level-ab">2</p>
              </div>
              <div className="left-div">
                <p className="left-text">Account Level</p>
                <p className="left-pra">Level 2</p>
              </div>
            </div>
            <h5 className="history-text">History</h5>
            <div className="history-l">
              {numbersOne.map((number, index) => (
                <div className="main-div" key={number}>
                  {index === 0 && (
                    <div className="div-img">
                      <img
                        src={icons?.completedLevelImg}
                        alt="complete-img"
                        loading="lazy"
                      />
                      <div className="polygon-number">{number}</div>
                    </div>
                    // ) : (
                    //     <div
                    //         className={`${
                    //             index === 0
                    //                 ? "polygonO"
                    //                 : index === 1
                    //                 ? "polygonH"
                    //                 : "polygon-gh"
                    //         }`}>
                    //         <div className="polygon-abh">
                    //             {number}
                    //         </div>
                    //     </div>
                    // )
                  )}
                  {index === 1 && (
                    <div className="div-img">
                      <img
                        src={icons?.currentLevelImg}
                        alt="complete-img"
                        loading="lazy"
                      />
                      <div className="complete-number">{number}</div>
                    </div>
                  )}
                  {!(index === 0 || index === 1) && (
                    <div className="div-img">
                      <img
                        src={icons?.upCompleteLevelImg}
                        alt="complete-img"
                        loading="lazy"
                      />
                      <div className="complete-number">{number}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-20">
              {completeList?.map((ele, index) => {
                const { description, title } = ele;
                return (
                  <div className="CompleteL-div" key={index}>
                    <p className="CompleteL-texts">{title}</p>
                    <div className="CompletesL-div">
                      <img
                        src={icons?.dotIcons}
                        alt="dot-icons"
                        loading="lazy"
                      />
                      <p className="CompleteL-text">{description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {isEdit && (
        <EditProfilePopUp
          data={profileData}
          onHide={() => {
            setIsEdit(false);
          }}
        />
      )}

      {showAdminresetPopup && (
        <AdminResetPopup
          onHide={() => {
            dispatch(setShowAdminresetPopup(false));
          }}
          handleSuccess={async () => {
            await dispatch(getProfile());
            dispatch(setShowAdminresetPopup(false));
          }}
        />
      )}
    </section>
  );
};

export default AccountSettings;
