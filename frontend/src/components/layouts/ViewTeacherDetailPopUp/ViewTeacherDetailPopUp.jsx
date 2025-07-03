import Button from "@/components/inputs/Button";
import {
  setShowUserEditPopup,
  setUserEditData,
  setViewTeacherDetails,
  setViewTeacherDetailsPopUp,
} from "@/store/globalSlice";
import { icons } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../Modal";
import "./ViewTeacherDetailPopUp.scss";
const ViewTeacherDetailPopUp = ({ onHide }) => {
  const reduxData = useSelector((state) => state.global);
  const { viewTeacherDetails } = reduxData || {};
  const dispatch = useDispatch();
  const { firstName, lastName, email, phoneNumber, location, isActive } =
    viewTeacherDetails;

  return (
    <Modal
      title={`View details`}
      width="600px"
      onHide={onHide}
      isCloseOutside={true}
    >
      <div className="view-teacher-details-container mt-15">
        <div className="cardBlock">
          {firstName && (
            <div className="block">
              <div className="label text-18-400 color-5151 font-gilroy-m">
                Name
              </div>
              <div className="value text-18-400 color-1a1a font-gilroy-m fa-center gap-3">
                {firstName}
              </div>
            </div>
          )}
          {lastName && (
            <div className="block">
              <div className="label text-18-400 color-5151 font-gilroy-m">
                lastName
              </div>
              <div className="value text-18-400 color-1a1a font-gilroy-m fa-center gap-3">
                {lastName}
              </div>
            </div>
          )}

          {email && (
            <div className="block">
              <div className="label text-18-400 color-5151 font-gilroy-m">
                email
              </div>
              <div className="value text-18-400 color-1a1a font-gilroy-m fa-center gap-3">
                {email}
              </div>
            </div>
          )}
          {phoneNumber && (
            <div className="block">
              <div className="label text-18-400 color-5151 font-gilroy-m">
                Phone Number
              </div>
              <div className="value text-18-400 color-1a1a font-gilroy-m fa-center gap-3 ">
                {phoneNumber}
              </div>
            </div>
          )}
          {location && (
            <div className="block">
              <div className="label text-18-400 color-5151 font-gilroy-m">
                Location
              </div>
              <div className="value text-18-400 color-1a1a font-gilroy-m fa-center gap-3">
                {location?.name}
              </div>
            </div>
          )}

          {isActive && (
            <div className="block">
              <div className="label text-18-400 color-5151 font-gilroy-m">
                Active
              </div>
              <div className="value text-18-400 color-1a1a font-gilroy-m fa-center gap-3">
                <div
                  className={`f-center gap-2 flex-nowrap ${
                    isActive === true ? "yesBox" : "noBox"
                  }`}
                >
                  <div className="w-20 h-20 f-center">
                    <img
                      src={isActive === true ? icons.gRight : icons.rCancel}
                      alt=""
                      className="fit-image"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="btn-div">
          <Button btnStyle="PDO" btnText="Cancel" onClick={onHide} />
          <Button
            btnText="Edit"
            btnStyle="og-e"
            className="ps-30 pe-30"
            onClick={() => {
              dispatch(setViewTeacherDetails({}));
              dispatch(setViewTeacherDetailsPopUp(false));

              setTimeout(() => {
                dispatch(setShowUserEditPopup(true));
                dispatch(setUserEditData(viewTeacherDetails));
              }, 200);
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ViewTeacherDetailPopUp;
