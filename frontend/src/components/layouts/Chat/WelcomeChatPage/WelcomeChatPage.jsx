import { useSelector } from "react-redux";
import "./WelcomeChatPage.scss";
import { getInitials, titleCaseString } from "@/utils/helpers";

const WelcomeChatPage = () => {
  const reduxData = useSelector((state) => state.global);
  const { profileData } = reduxData || {};
  const { lastName, firstName, profileImage } = profileData || {};

  return (
    <div id="welcomechatpage-container">
      <div className="message-container  justify-content-center align-items-center">
        <h1 className="text-40-600 p-0 mb-20">Welcome to Real Brave Chat</h1>
        <div className="main-img">
          {profileImage ? (
            <>
              <img src={profileImage} className="user-re" />
              <svg className="circle" width="60" height="60">
                <circle
                  cx="30"
                  cy="30"
                  r="28"
                  stroke="#FE5C38"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="164"
                  strokeDashoffset="40"
                />
              </svg>
            </>
          ) : (
            <div className="w-56 h-56 f-center br-50 bg-bebe">
              <div className="f-center text-16-400 color-003e font-gilroy">
                {getInitials(firstName || lastName)}
              </div>
            </div>
          )}
        </div>
        <h4 className="mt-10">
          {titleCaseString(firstName)} {titleCaseString(lastName)}
        </h4>
      </div>
    </div>
  );
};

export default WelcomeChatPage;
