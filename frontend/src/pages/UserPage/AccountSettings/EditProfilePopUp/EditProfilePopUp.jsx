import { Button, Modal, TextInput } from "@/components";
import "./EditProfilePopUp.scss";
import { icons } from "@/utils/constants";
import { Formik } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  handelUpdateStudentProfile,
  showSuccess,
  getProfile,
} from "@/store/globalSlice";
import { getInitialsVal } from "@/utils/helpers";

const EditProfilePopUp = ({ onHide, data }) => {
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleSave = async (value, { resetForm }) => {
    setLoading(true);
    const res = await dispatch(handelUpdateStudentProfile(value));
    if (res.status === 200) {
      resetForm();
      onHide();
      await dispatch(getProfile());
      dispatch(showSuccess(res?.data?.message));
    }
    setLoading(false);
  };

  const initialValues = {
    firstName: data?.firstName || "",
    lastName: data?.lastName || "",
    profileImage:  data?.profileImage|| null,
    email: data?.email || "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Number or Special character  is not allowed.")
      .required("First name is required."),
    lastName: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Number or Special character  is not allowed.")
      .required("Last name is required."),
    email: Yup.string()
      .test("isValidEmail", "Email is not valid.", function (value) {
        if (value) {
          return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value);
        }
        return true;
      })
      .required("Email is required."),
    // profileImage: Yup.mixed()
    //   .required("Profile image is required")
    //   .test("fileType", "Only image files are allowed", (value) => {
    //     return (
    //       value &&
    //       ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(
    //         value.type
    //       )
    //     );
    //   }),
    profileImage: Yup.mixed()
      .required("Profile image is required")
      .test("fileType", "Only image files are allowed", (value) => {
        if ( typeof value === "string") {
          return true;
        }
        return (
          value &&
          ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(
            value.type
          )
        );
      }),
  });
  return (
    <Modal onHide={onHide} size="lg">
      <div className="edit-profile-container">
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
              setFieldValue,
              setFieldError,
              dirty,
            } = props;
            const { firstName, lastName, profileImage, email } = values;

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

            const handleProfileImg = (e) => {
              const { id, files } = e.target;
              setFieldValue(id, files?.[0]);
            };
        
            return (
              <form className="profile-card">
          
                <div className="userImg">
                {
                !data?.profileImage && !profileImage ?(
                  <React.Fragment>
                        <img
                          src={icons?.bgDarkImg}
                          alt="bg-img"
                          loading="lazy"
                        />
                        <p className="user-a">
                          {getInitialsVal(
                            `${data?.firstName} ${data?.lastName}`
                          )}
                        </p>
                      </React.Fragment>
                ) :
                  <img
                    src={
                      typeof profileImage === "string"
                        ? profileImage
                        : profileImage instanceof Blob ||
                          profileImage instanceof File
                        ? URL.createObjectURL(profileImage)
                        : ''
                    }
                    alt="user-img"
                    className="image-div"
                    loading="lazy"
                    width={150}
                    height={150}
                  />
              }
                </div>
                  {errors?.profileImage && (
                    <p className="input-error mb-5">{errors?.profileImage}</p>
                  )}
                <label className="div-profile pointer">
                  Change Profile Picture
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImg}
                    className="hidden-file-input"
                  />
                </label>
                <div className="user-name">
                  <TextInput
                    id="firstName"
                    placeholder="Enter your first name"
                    className="text-18"
                    onChange={handleInputChange}
                    value={firstName}
                    error={errors?.firstName}
                    onBlur={handleBlur}
                    // disabled={true}
                  />
                </div>
                <div className="user-name">
                  <TextInput
                    id="lastName"
                    placeholder="Enter your last name"
                    className="text-18"
                    onChange={handleInputChange}
                    value={lastName}
                    error={errors?.lastName}
                    onBlur={handleBlur}
                    // disabled={true}
                  />
                </div>
                <div className="user-email">
                  <TextInput
                    handelEdit={() => {
                      setEdit((prev) => {
                        return !prev;
                      });
                    }}
                    edit={edit}
                    isEdit={true}
                    id="email"
                    className="text-18"
                    placeholder="Enter your email"
                    onChange={handleInputChange}
                    value={email}
                    error={errors?.email}
                    onBlur={handleBlur}
                    disabled={!edit}
                  />
                </div>
                <div className="btn-div">
                  <Button
                    btnText="Save"
                    btnStyle="og h-43"
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={loading || !dirty}
                  />
                  <Button
                    btnText="Cancel"
                    btnStyle="org-btn h-43"
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

export default EditProfilePopUp;
