import { Button, Modal, Roundedloader } from "@/components";
import { handelGetStudentProfile } from "@/store/globalSlice";
import { icons } from "@/utils/constants";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./ViewStudentProfile.scss";
import moment from "moment";
import { calculateAge } from "@/utils/helpers";

const ViewStudentProfile = ({ onHide, data }) => {
  const { viewProfileId } = data;
  const [profileList, setProfileList] = useState([]);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    location,
    age,
    relation,
    isActive,
    date_of_birth,
    selectedPlan,
    createdAt,
    studentParent,
  } = profileList;

  const { parentId } = studentParent?.[0] || {};

  const fetchGetProfileList = async () => {
    setLoading(true);
    const res = await dispatch(handelGetStudentProfile(viewProfileId));
    if (res?.status === 200) {
      setProfileList(res?.data?.response || {});
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGetProfileList();
  }, []);

  const ageCount = calculateAge(date_of_birth);
  return (
    <Modal
      title={`View profile`}
      width="600px"
      onHide={onHide}
      isCloseOutside={true}
    >
      <div className="view-student-profile-container mt-15">
        {loading ? (
          <div className="d-flex justify-content-center pt-70 pb-70">
            <Roundedloader size="md" />
          </div>
        ) : (
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
                  Name
                </div>
                <div className="value text-18-400 color-1a1a font-gilroy-m fa-center gap-3">
                  {lastName}
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

            {/* {email && (
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
            )} */}
            {location && (
              <div className="block">
                <div className="label text-18-400 color-5151 font-gilroy-m">
                  Location
                </div>
                <div className="value text-18-400 color-1a1a font-gilroy-m fa-center gap-3">
                  {location?.name || "name"}
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
            {/* {parentId?.email && (
              <div className="block">
                <div className="label text-18-400 color-5151 font-gilroy-m">
                  Parent email
                </div>
                <div className="value text-18-400 color-1a1a font-gilroy-m fa-center gap-3">
                  {parentId?.email}
                </div>
              </div>
            )} */}
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

            {/* {parentId?.phoneNumber && (
              <div className="block">
                <div className="label text-18-400 color-5151 font-gilroy-m">
                  Parent number
                </div>
                <div className="value text-18-400 color-1a1a font-gilroy-m fa-center gap-3">
                  {parentId?.phoneNumber}
                </div>
              </div>
            )} */}
            {createdAt && (
              <div className="block">
                <div className="label text-18-400 color-5151 font-gilroy-m">
                  Account created
                </div>
                <div className="value text-18-400 color-1a1a font-gilroy-m fa-center gap-3">
                  {moment(createdAt).format("YYYY-MM-DD")}
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
        )}
        <div className="btn-div">
          <Button btnStyle="PDO" btnText="Cancel" onClick={onHide} />
        </div>
      </div>
      {!loading && profileList?.length === 0 && (
        <div className="text-center pt-70 pb-70">No data found</div>
      )}
    </Modal>
  );
};

export default ViewStudentProfile;
