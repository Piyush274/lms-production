import Button from "@/components/inputs/Button";
import { useState } from "react";
import { icons } from "utils/constants";
import Modal from "../Modal";
import "./UnArchiveConfirmation.scss";

const UnArchiveConfirmation = ({ onHide, title, onDelete }) => {
  const [archiveLoader, setUnArchiveLoader] = useState(false);

  const handleArchive = () => {
    setUnArchiveLoader(true);
    onDelete();
    setTimeout(() => {
      setUnArchiveLoader(false);
    }, 1500);
  };

  return (
    <div id="unarchiveconfirmation-container">
      <Modal
        title={`UnArchive ${title}`}
        width="600px"
        onHide={onHide}
        isCloseOutside={true}
      >
        <div className="ps-26 pe-26 pt-26 mb-10">
          <div className="h-74 mb-26">
            <img
              src={icons.UnArchive}
              alt="deleteFrame"
              className="fit-image"
            />
          </div>
          <div className={`text-center text-18-600  mb-10`}>
            Un Archive Confirmation!
          </div>
          <div className={`text-center text-16-400  mb-26`}>
            Are you sure you want to un archive <br />
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
              loading={archiveLoader}
              onClick={handleArchive}
              disabled={archiveLoader}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UnArchiveConfirmation;
