import Button from "@/components/inputs/Button";
import {
  setShowUserEditPopup,
  setUserEditData,
  setViewStudentDetails,
  setViewStudentDetailsPopUp,
} from "@/store/globalSlice";
import { icons } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../Modal";
import "./ViewStudentDetailsPopUp.scss";
import moment from "moment";
import { calculateAge } from "@/utils/helpers";
const ViewStudentDetailsPopUp = ({ onHide }) => {
  const reduxData = useSelector((state) => state.global);
  const { viewStudentDetails } = reduxData || {};
  const dispatch = useDispatch();

  const {
    firstName,
    lastName,
    date_of_birth,
    email,
    phoneNumber,
    location,
    age,
    selectedPlan,
    studentParents,
    relation,
    isActive,
  } = viewStudentDetails;

  const { parentId } = studentParents || [];
  const ageCount = calculateAge(date_of_birth);

  return (
    <Modal
      title={`View details`}
      width="600px"
      onHide={onHide}
      isCloseOutside={true}
    >
      <div className="view-student-details-container mt-15">
        <div className="cardBlock">
          {firstName && (
            <div className="block">
              <div className="label text-18-400 color-5151 font-gilroy-m">
                First name
              </div>
              <div className="value text-18-400 color-1a1a font-gilroy-m fa-center gap-3">
                {firstName}
              </div>
            </div>
          )}

          {lastName && (
            <div className="block">
              <div className="label text-18-400 color-5151 font-gilroy-m">
                Last name
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
          {date_of_birth && (
            <div className="block">
              <div className="label text-18-400 color-5151 font-gilroy-m">
                Date of birth
              </div>
              <div className="value text-18-400 color-1a1a font-gilroy-m fa-center gap-3">
                {moment(date_of_birth).format("YYYY-MM-DD")}{" "}
                {ageCount > 0 && (
                  <span className="text-15-500 color-aoao">
                    ( {ageCount} year )
                  </span>
                )}
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
          {selectedPlan && (
            <div className="block">
              <div className="label text-18-400 color-5151 font-gilroy-m">
                Selected plan
              </div>
              <div className="value text-18-400 color-1a1a font-gilroy-m fa-center gap-3">
                {selectedPlan?.title}
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
          {age && (
            <div className="block">
              <div className="label text-18-400 color-5151 font-gilroy-m">
                Student Age
              </div>
              <div className="value text-18-400 color-1a1a font-gilroy-m fa-center gap-3">
                {age}
              </div>
            </div>
          )}
          {parentId?.firstName && (
            <div className="block">
              <div className="label text-18-400 color-5151 font-gilroy-m">
                Parent first name
              </div>
              <div className="value text-18-400 color-1a1a font-gilroy-m fa-center gap-3">
                {parentId?.firstName}
              </div>
            </div>
          )}
          {parentId?.lastName && (
            <div className="block">
              <div className="label text-18-400 color-5151 font-gilroy-m">
                Parent last name
              </div>
              <div className="value text-18-400 color-1a1a font-gilroy-m fa-center gap-3">
                {parentId?.lastName}
              </div>
            </div>
          )}
          {parentId?.email && (
            <div className="block">
              <div className="label text-18-400 color-5151 font-gilroy-m">
                Parent email
              </div>
              <div className="value text-18-400 color-1a1a font-gilroy-m fa-center gap-3">
                {parentId?.email}
              </div>
            </div>
          )}
          {parentId?.phoneNumber && (
            <div className="block">
              <div className="label text-18-400 color-5151 font-gilroy-m">
                Parent number
              </div>
              <div className="value text-18-400 color-1a1a font-gilroy-m fa-center gap-3">
                {parentId?.phoneNumber}
              </div>
            </div>
          )}
          {relation && (
            <div className="block">
              <div className="label text-18-400 color-5151 font-gilroy-m">
                Relation
              </div>
              <div className="value text-18-400 color-1a1a font-gilroy-m fa-center gap-3">
                {relation}
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
              dispatch(setViewStudentDetails({}));
              dispatch(setViewStudentDetailsPopUp(false));

              setTimeout(() => {
                dispatch(setUserEditData(viewStudentDetails));
                dispatch(setShowUserEditPopup(true));
              }, 200);
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ViewStudentDetailsPopUp;
