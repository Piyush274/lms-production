import "./ParentAccount.scss";
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

const ParentAccount = () => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.global);
  const { showAdminProfile, showAdminresetPopup, profileData } =
    reduxData || {};
  const { email, name, lastName, profileImage ,firstName} = profileData || {};
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
                      {getInitialsVal(
                            `${firstName} ${lastName}`
                          )}
                    </p>
                  )}
                </div>
                <h4 className="user-name-1">
                  {titleCaseString(firstName)} {titleCaseString(lastName)}
                </h4>
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
                // disabled={!name}
              />
              <Button
                btnText="Reset Password"
                btnStyle="org-btn-1 h-43"
                onClick={() => {
                  dispatch(setShowAdminresetPopup(true));
                }}
                // disabled={true}
              />
            </div>
          </div>

          <div
            className="text-16-400  mt-20 font-gilroy-m"
            style={{ color: "#A0A0A0" }}
          >
            Linked Accounts (Children)
          </div>
          <div
            className="fa-center gap-2 "
            style={{ color: "#A0A0A0", margin: "0px" }}
          >
            <span
              className="text-18-400 font-gilroy-m"
              style={{ color: "#1A1A1A" }}
            >
              Alexander Dave
            </span>
            <span className="mb-10 text-18-400">.</span>
            <span
              className="text-16-400 font-gilroy-m"
              style={{ color: "#515151" }}
            >
              Double Package.
            </span>
          </div>
        </>
      </div>
    </div>
  );
};

export default ParentAccount;
