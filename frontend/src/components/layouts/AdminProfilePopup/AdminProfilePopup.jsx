import { Button, Modal, TextInput } from "@/components";
import { updateProfileData } from "@/store/globalSlice";
import { icons } from "@/utils/constants";
import { Formik } from "formik";
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import "./AdminProfilePopup.scss";
import { getInitialsVal } from "@/utils/helpers";

const AdminProfilePopup = ({ handleSuccess, onHide }) => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.global);
  const { adminProfileData } = reduxData || {};
  const [loading, setloading] = useState(false);
  const {
    role,
    email,
    phoneNumber,
    profileImage,
    lastName,
    name,
    firstName,
    location,
  } = adminProfileData || {};

  const initialValues = {
    firstName: firstName || "",
    profileImage: profileImage || null,
    email: email || "",
    phoneNumber: phoneNumber || "",
    lastName: lastName || "",
    location: location?.name || "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Number or special character is not allowed.")
      .required("First name is required."),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required."),
    profileImage: Yup.mixed()
      .required("Profile image is required.")
      .test(
        "fileType",
        "Invalid file type. Only .jpeg, .jpg, .png are allowed.",
        (value) => {
          if (value && value instanceof File) {
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
            return allowedTypes.includes(value.type);
          }
          return true;
        }
      ),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Phone number should be 10 digits")
      .required("Phone number  is required."),
    lastName: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Number or special character is not allowed.")
      .required("Last name is required."),
  });

  const handleSave = async (values, { resetForm }) => {
    setloading(true);
    const { location, ...payload } = values;
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const res = await dispatch(updateProfileData(formData));
    if (res?.status === 200) {
      handleSuccess();
      resetForm();
    }
    setloading(false);
  };

  return (
    <Modal onHide={onHide} isCloseOutside={true} size="lg">
      <div className="edit-teacher-container">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          {(props) => {
            const {
              values,
              touched,
              errors,
              handleChange,
              handleSubmit,
              handleBlur,
              setFieldError,
              dirty,
            } = props;
            const {
              name,
              profileImage,
              email,
              phoneNumber,
              lastName,
              firstName,
              location,
            } = values;

            const handleInputChange = (e) => {
              const { id, value } = e.target;
              if (!touched[id]) {
                touched[id] = true;
              }
              if (value === "") {
                setFieldError(id, "");
              }

              handleChange(e);
            };

            const handleProfileImg = (event) => {
              const file = event.target.files[0];
              if (file) {
                const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
                if (!allowedTypes.includes(file.type)) {
                  setFieldError("profileImage", "Invalid file type.");
                  event.target.value = null;
                  return;
                }
                props.setFieldValue("profileImage", file);
              }
            };

            return (
              <form className="profile-card">
                <div className="userImg">
                  {!adminProfileData?.profileImage && !profileImage ? (
                    <React.Fragment>
                      <img src={icons?.bgDarkImg} alt="bg-img" loading="lazy" />
                      <p className="user-a">
                        {getInitialsVal(`${firstName} ${lastName}`)}
                      </p>
                    </React.Fragment>
                  ) : (
                    <img
                      src={
                        typeof profileImage === "string"
                          ? profileImage
                          : profileImage instanceof Blob ||
                            profileImage instanceof File
                          ? URL.createObjectURL(profileImage)
                          : icons?.UserProfileImg
                      }
                      alt="user-img"
                      className="image-div"
                      loading="lazy"
                      width={150}
                      height={150}
                    />
                  )}
                </div>
                {errors?.profileImage && (
                  <p className="input-error">{errors?.profileImage}</p>
                )}
                <label className="div-profile pointer">
                  Change Profile Picture
                  <input
                    id="profileImage"
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    onChange={handleProfileImg}
                    className="hidden-file-input"
                  />
                </label>
                <Row className="mb-3 mt-20 row-gap-3">
                  <Col md={12}>
                    <TextInput
                      id="firstName"
                      placeholder="Enter your first name"
                      className="text-18 mb-3"
                      onChange={handleInputChange}
                      value={firstName}
                      error={errors?.firstName}
                      onBlur={handleBlur}
                    />
                  </Col>
                  <Col md={12}>
                    <TextInput
                      id="lastName"
                      placeholder="Enter your last name"
                      className="text-18 mb-3"
                      onChange={handleInputChange}
                      value={lastName}
                      error={errors?.lastName}
                      onBlur={handleBlur}
                    />
                  </Col>
                  <Col md={12}>
                    <TextInput
                      id="email"
                      placeholder="Enter your email"
                      className="text-18 mb-3"
                      onChange={handleInputChange}
                      value={email}
                      error={errors?.email}
                      onBlur={handleBlur}
                      disabled={true}
                    />
                  </Col>
                  {role === "teacher" && (
                    <Col>
                      <TextInput
                        id="location"
                        placeholder="Enter your location"
                        className="text-18 mb-3"
                        onChange={handleInputChange}
                        value={location}
                        error={errors?.location}
                        onBlur={handleBlur}
                        disabled={true}
                      />
                    </Col>
                  )}
                  <Col md={12}>
                    <TextInput
                      id="phoneNumber"
                      placeholder="Enter your phone number"
                      className="text-18 mb-3"
                      onChange={handleInputChange}
                      value={phoneNumber}
                      error={errors?.phoneNumber}
                      onBlur={handleBlur}
                    />
                  </Col>
                </Row>
                <div className="btn-div">
                  <Button
                    btnText="Save"
                    className="h-43"
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={loading || !dirty}
                  />
                  <Button
                    btnText="Cancel"
                    btnStyle="PDO"
                    className="h-43"
                    onClick={onHide}
                  />
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};

export default AdminProfilePopup;
