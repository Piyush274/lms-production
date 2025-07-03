import { icons } from "@/utils/constants";
import "./Inbox.scss";
// import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllGroup,
  getUserList,
  handleCreateGroup,
  setGroupId,
  setIsUserActive,
  setSelectedChatData,
  setShowChatGroupPopup,
  showSuccess,
} from "@/store/globalSlice";
import { Button } from "@/components";
import { getDataFromLocalStorage, getInitials } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Inbox = () => {
  const location = useLocation();
  const { redirect_id } = location.state || {};
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.global);
  const { isUserActive } = reduxData || {};

  const [isLoadingStudent, setIsLoadingStudent] = useState(false);
  const [studentsList, setStudentsList] = useState([]);

  //   const [isActive, setIsActive] = useState(null);

  const role = getDataFromLocalStorage("role");

  const userId = getDataFromLocalStorage("userId");

  const fetchStudentList = async () => {
    setIsLoadingStudent(true);

    const res = await dispatch(getUserList(userId));

    if (res?.status === 200) {
      setStudentsList(res?.data?.response);
    }
    setIsLoadingStudent(false);
  };

  useEffect(() => {
    fetchStudentList();
  }, []);

  const handleDirectUserChatRoom = async (value) => {
    try {
      const payload = {
        members: [value.user_id],
        type: "direct",
      };
      const res = await dispatch(handleCreateGroup(payload));
      if (res?.status === 200) {
        dispatch(setGroupId(res?.data?.response?._id));
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  const handleManageSideBarList = (ele, index) => {
    dispatch(setIsUserActive(index));
    dispatch(setSelectedChatData(ele));
    ele.group_type === "group"
      ? dispatch(setGroupId(ele._id))
      : handleDirectUserChatRoom(ele);
  };

  useEffect(() => {
    if (redirect_id) {
      const matchedStudent = studentsList.find(
        (student) => student._id === redirect_id
      );
      if (matchedStudent) {
        const index = studentsList.indexOf(matchedStudent);
        handleManageSideBarList(matchedStudent, index);
      }
    }
  }, [redirect_id, studentsList]);

  return (
    <section className="inbox-container">
      <div className="fb-center flex-nowrap gap-3 p-24">
        <div className="inbox-title">Inbox</div>

        {role !== "student" && (
          <>
            <Button
              btnText="Create group"
              btnStyle="PDO"
              className="h-31 px-10 py-4"
              textClass="text-15-400 font-gilroy-sb"
              leftIcon={icons.addRed}
              onClick={() => dispatch(setShowChatGroupPopup(true))}
            />
          </>
        )}
      </div>
      {studentsList?.map((ele, index) => {
        const { profileImage, groupName, description, active } = ele;
        return (
          <div
            className={`user-div pointer ${
              isUserActive === index ? "active-d" : ""
            }`}
            key={index}
            onClick={() => {
              handleManageSideBarList(ele, index);
            }}
          >
            <div className="user-img">
              <div className="w-49 h-49 f-center br-50 bg-bebe">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={{ groupName }}
                    className="fit-image br-50"
                  />
                ) : (
                  <div className="f-center text-16-400 color-003e font-gilroy">
                    {getInitials(groupName)}
                  </div>
                )}
              </div>
              <div>
                <h6 className="user-text">{groupName}</h6>
                {description && <h6 className="user-pra">{description}</h6>}
              </div>
            </div>
            {active && (
              <img src={icons?.onlineImg} alt="active-icons" loading="lazy" />
            )}
          </div>
        );
      })}
    </section>
  );
};

export default Inbox;
