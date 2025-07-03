import "./TeacherAccountSetting.scss";
import { icons } from "@/utils/constants";
import { getInitialsVal, titleCaseString } from "@/utils/helpers";
import { AdminProfilePopup, AdminResetPopup, Button } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import {
  getProfile,
  setAdminProfileData,
  setShowAdminProfile,
  setShowAdminresetPopup,
} from "@/store/globalSlice";

const TeacherAccountSetting = () => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.global);
  const { showAdminProfile, showAdminresetPopup, profileData } =
    reduxData || {};
  const { email, name, lastName, profileImage ,firstName,location} = profileData || {};

  return (
    <div id="teacheraccountsetting-container">
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
      {showAdminProfile && (
        <AdminProfilePopup
          onHide={() => {
            dispatch(setAdminProfileData({}));
            dispatch(setShowAdminProfile(false));
          }}
          handleSuccess={async () => {
            await dispatch(getProfile());
            dispatch(setAdminProfileData({}));
            dispatch(setShowAdminProfile(false));
          }}
        />
      )}
      <div className="account-card">
        <>
          <div className="details-div">
            <div>
              <div className="profile-div">
                <div className="img-div">
                  <img
                    src={profileImage || icons?.bgDarkImg}
                    alt=""
                    loading="lazy"
                    className="br-100"
                  />
                  {!profileImage && (
                    <p className="user-name">
                      {getInitialsVal(`${firstName} ${lastName}`
                      )}
                    </p>
                  )}
                </div>
                <h4 className="user-name-1">
                  {titleCaseString(firstName)} {titleCaseString(lastName)}
                </h4>
                <div className="text-16-400 color-1a1a font-gilroy-m">
                location :    {location?.name}
                </div>
                <p className="user-email">{email}</p>
                <div className="text-18-400 color-5151 font-gilroy-m mt-10">
                  Double Package.
                </div>
              </div>
            </div>
            <div className="right-btn mt-20">
              <Button
                btnText="Edit Profile"
                btnStyle="og-1 h-43"
                onClick={() => {
                  dispatch(setAdminProfileData(profileData));
                  dispatch(setShowAdminProfile(true));
                }}
                // disabled={!name || !lastName}
              />
              <Button
                btnText="Reset Password"
                btnStyle="org-btn-1 h-43"
                onClick={() => {
                  dispatch(setShowAdminresetPopup(true));
                }}
                // disabled={!name || !lastName}
              />
            </div>
            {/* {showAdminresetPopup && (
          <div className="text-18-400 color-a12a mt-20">
            A link to reset your password has been sent to your email :{" "}
            {email}
          </div>
        )} */}
          </div>
        </>
      </div>
    </div>
  );
};

export default TeacherAccountSetting;
