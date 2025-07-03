import Button from "@/components/inputs/Button";
import { icons } from "@/utils/constants";
import { useState } from "react";
import Modal from "../Modal";
import "./ConfirmPopUp.scss";

const ConfirmPopUp = ({ onAdd, title, onHide }) => {
  const [addLoader, setAddLoader] = useState(false);

  const handleAdd = () => {
    setAddLoader(true);
    onAdd();
    setTimeout(() => {
      setAddLoader(false);
    }, 1000);
  };

  return (
    <div id="confirmation-container">
      <Modal
        title={`Add ${title}`}
        width="600px"
        onHide={onHide}
        isCloseOutside={true}
      >
        <div className="ps-26 pe-26 pt-26 mb-10">
          <div className="h-74 mb-26">
            <img
              src={icons.confirmImg}
              alt="deleteFrame"
              className="fit-image"
            />
          </div>
          <div className={`text-center text-18-600  mb-10`}>
            Add Confirmation!
          </div>
          <div className={`text-center text-16-400  mb-26`}>
            Are you sure you want to Add <br />
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
              btnStyle="Co"
              className="ps-45 pe-45"
              btnText={`Confirm`}
              loading={addLoader}
              onClick={handleAdd}
              disabled={addLoader}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ConfirmPopUp;
