import Button from "@/components/inputs/Button";
import { useState } from "react";
import { icons } from "utils/constants";
import Modal from "../Modal";
import "./UnFollowConfirmation.scss";

const UnFollowConfirmation = ({ onHide, title, onDelete }) => {
  const [unFollowLoader, setUnFollowLoader] = useState(false);

  const handleUnFollow = () => {
    setUnFollowLoader(true);
    onDelete();
    setTimeout(() => {
      setUnFollowLoader(false);
    }, 1500);
  };

  return (
    <div id="unfollowconfirmation-container">
      <Modal
        title={`Un Follow ${title}`}
        width="600px"
        onHide={onHide}
        isCloseOutside={true}
      >
        <div className="ps-26 pe-26 pt-26 mb-10">
          <div className="h-74 mb-26">
            <img
              src={icons.UnFollow}
              alt="deleteFrame"
              className="fit-image"
            />
          </div>
          <div className={`text-center text-18-600  mb-10`}>
            UnFollow Confirmation!
          </div>
          <div className={`text-center text-16-400  mb-26`}>
            Are you sure you want to Un-Follow <br />
            this {title}
          </div>
          <div className="f-center gap-3">
            <Button
              btnStyle="PDO"
              btnText="Cancel"
              className="ps-45 pe-45"
              onClick={onHide}
            />
            <Button
              className="ps-45 pe-45"
              btnText={`Confirm`}
              loading={unFollowLoader}
              onClick={handleUnFollow}
              disabled={unFollowLoader}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UnFollowConfirmation;
