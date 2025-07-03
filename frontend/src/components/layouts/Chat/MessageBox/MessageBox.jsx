/* inline-disable */

import { icons } from "@/utils/constants";
import "./MessageBox.scss";
import { useDispatch, useSelector } from "react-redux";
import WelcomeChatPage from "../WelcomeChatPage";
import ChatWindow from "../ChatWindow";
import Button from "@/components/inputs/Button";
import { getDataFromLocalStorage } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { fetchAllMessages } from "@/store/globalSlice";
import { FastField } from "formik";

const MessageBox = ({ isResponsive, setShow }) => {
  const reduxData = useSelector((state) => state.global);
  const { isUserActive, selectedChatData, groupId } = reduxData || {};
  const dispatch = useDispatch();
  const isGroup = true;

  const role = getDataFromLocalStorage("role");

  return (
    <>
      {isUserActive != null ? (
        <div className="message-container">
          <div className="fb-center  user-div gap-3">
            <div className="text-22-400 font-gilroy-sb color-1a1a">
              Chat With {""}
              {selectedChatData.type !== "group"
                ? selectedChatData?.groupName
                : selectedChatData?.description}
            </div>
            {isResponsive && (
              <div className="fa-center gap-3">
                <span
                  className="d-flex b-757f pointer rounded-circle p-5"
                  onClick={() => {
                    setShow(true);
                  }}
                >
                  <img
                    src={icons.chats}
                    alt="chats"
                    className="h-18 w-18 rounded-circle"
                  />
                </span>
              </div>
            )}
            {isGroup &&
              role !== "student" &&
              selectedChatData.type === "group" && (
                <Button
                  btnText="Delete group"
                  btnStyle="PDF"
                  className="h-37 px-10 py-4"
                  textClass="text-17-400 font-gilroy-m"
                />
              )}
          </div>
          <ChatWindow />
        </div>
      ) : (
        <WelcomeChatPage />
      )}
    </>
  );
};

export default MessageBox;
