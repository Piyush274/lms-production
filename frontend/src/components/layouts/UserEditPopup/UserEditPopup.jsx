/* eslint-disable no-unused-vars */
import Dropdown from "@/components/inputs/Dropdown";
import MultipleDropdown from "@/components/inputs/MultipleDropdown";
import TextInput from "@/components/inputs/TextInput";
import {
  getAllSubscriptionPlan,
  handelGetTeacherList,
  handleGetLocation,
  updateUserStatus,
} from "@/store/globalSlice";
import { Button, Modal } from "components";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import "./UserEditPopup.scss";
import moment from "moment/moment";
import DatePicker from "@/components/inputs/DataPicker";
import { calculateAge } from "@/utils/helpers";

const UserEditPopup = ({ handleSuccess, onHide }) => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.global);
  const { userEditData, locationList } = reduxData || {};
  const [teacherList, setTeacherList] = useState({});
  const [subscriptionPlan, setsubscriptionPlan] = useState([]);
  const {
    role,
    location,
    lastName,
    firstName,
    email,
    phoneNumber,
    age,
    date_of_birth,
    parentNumber,
    relation,
    teachers,
    sortField,
    selectedPlan,
    parentEmail,
    parentFirstName,
    parentLastName,
    studentParents,
  } = userEditData || {};
  const { parentId } = studentParents || [];
  const [teacherState, setTeacherState] = useState([]);

  const [btnLoading, setBtnLoading] = useState(false);
  const isEdit = userEditData._id ? true : false;

  // eslint-disable-next-line no-unused-vars
  const [initialValues, setinitialData] = useState({
    location: location?._id || "",
    lastName: lastName || "",
    firstName: firstName || "",
    email: email || "",
    phoneNumber: phoneNumber || "",
    // age: age || "",
    teachers: teachers?.[0]?.teacherId?._id || "",
    parentFirstName: parentId?.firstName || "",
    parentLastName: parentId?.lastName || "",
    parentEmail: parentId?.email || "",
    parentNumber: parentId?.phoneNumber || "",
    relation: relation || "",
    date_of_birth: date_of_birth || "",
    selectedPlan: selectedPlan?._id || "",
  });

  // useEffect(() => {
  //   const idArray = teachers.map((ele) => ele.teacherId._id);
  //   setinitialData({
  //     ...initialValues,
  //     teachers: teacherState.filter((o) => idArray?.includes(o.value)),
  //   });
  // }, [teachers, teacherState]);

  const validationSchema = Yup.object().shape({
    location: Yup.string().required("Studio location is required"),
    lastName: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Number or special character is not allowed.")
      .required("Last name is required."),
    firstName: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Number or special character is not allowed.")
      .required("Last name is required."),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(
        /^(\+\d{1,3}[- ]?)?\d{10}$/,
        "Phone number must be 10 digits or follow the international format (1234567890)"
      ),
    // age: Yup.lazy((_, obj) => {
    //   if (obj.parent.type === "student") {
    //     return Yup.string().required("Age is required");
    //   } else {
    //     return Yup.string();
    //   }
    // }),
    date_of_birth: Yup.lazy((_, obj) => {
      if (role === "student") {
        return Yup.string()
          .required("Date of birth is required")
          .test(
            "is-valid-date",
            "Date of birth cannot be in the future",
            (value) => {
              if (!value) return false;
              const parsedDate = moment(value, "YYYY-MM-DD");

              return (
                parsedDate.isValid() && parsedDate.isSameOrBefore(moment())
              );
            }
          );
      } else {
        return Yup.string();
      }
    }),
    // teachers: Yup.array()
    //   .min(1, "At least one teacher is required.")
    //   .required("Teacher field is required"),
    teachers: Yup.lazy((_, obj) => {
      if (role === "student" && teacherList?.length > 0) {
        return Yup.string()
          .min(1, "At least one teacher is required.")
          .required("Teacher field is required");
      } else {
        return Yup.string();
      }
    }),
    relation: Yup.lazy((_, obj) => {
      const age = calculateAge(obj.parent?.date_of_birth);

      if (role === "student" && age < 17) {
        return Yup.string().required("Relation field is required");
      } else {
        return Yup.string();
      }
    }),

    parentFirstName: Yup.lazy((_, obj) => {
      const age = calculateAge(obj.parent?.date_of_birth);

      if (role === "student" && age < 17) {
        return Yup.string()
          .matches(
            /^[a-zA-Z\s]+$/,
            "Number or special character is not allowed."
          )
          .required("Last name is required.");
      } else {
        return Yup.string();
      }
    }),
    parentLastName: Yup.lazy((_, obj) => {
      const age = calculateAge(obj.parent?.date_of_birth);

      if (role === "student" && age < 17) {
        return Yup.string()
          .matches(
            /^[a-zA-Z\s]+$/,
            "Number or special character is not allowed."
          )
          .required("Parent last name is required.");
      } else {
        return Yup.string();
      }
    }),
    parentEmail: Yup.lazy((_, obj) => {
      const age = calculateAge(obj.parent?.date_of_birth);

      if (role === "student" && age < 17) {
        return Yup.string()
          .email("Invalid email")
          .required("Parent email is required");
      } else {
        return Yup.string();
      }
    }),

    parentNumber: Yup.lazy((_, obj) => {
      const age = calculateAge(obj.parent?.date_of_birth);
      if (role === "student" && age < 17) {
        return Yup.string()
          .required("Parent number is required")
          .matches(
            /^(\+\d{1,3}[- ]?)?\d{10}$/,
            "Phone number must be 10 digits or follow the international format (+1234567890)"
          );
      } else {
        return Yup.string();
      }
    }),
    selectedPlan: Yup.lazy((_, obj) => {
      if (role === "student") {
        return Yup.string().required("SelectedPlan field is required");
      } else {
        return Yup.string();
      }
    }),
  });

  const handleSubmit = async (values, { resetForm }) => {
    // const teachersLis = values?.teachers.map((ele) => {
    //   return ele?.value;
    // });

    let filteredValues = values;
    if (role === "teacher") {
      const {
        parentFirstName,
        parentLastName,
        parentEmail,
        parentNumber,
        parentPassword,
        selectedPlan,
        teacherId,
        date_of_birth,
        relation,
        ...rest
      } = filteredValues;
      filteredValues = rest;
    }

    if (role === "student" && calculateAge(values?.date_of_birth) > 17) {
      const {
        parentFirstName,
        parentLastName,
        parentEmail,
        parentNumber,
        parentPassword,
        relation,
        ...rest
      } = values;
      filteredValues = rest;
    }
    if (role === "student" && calculateAge(values?.date_of_birth) < 17) {
      filteredValues = { ...filteredValues, parentId: parentId?._id };
    }
    setBtnLoading(true);
    const payload = {
      ...filteredValues,
      userId: userEditData._id,
      type: role,
    };
    const res = await dispatch(updateUserStatus(payload));
    if (res?.status === 200) {
      resetForm();
      handleSuccess();
    }
    setBtnLoading(false);
  };

  const initAPI = async () => {
    dispatch(handleGetLocation());
  };

  useEffect(() => {
    initAPI();
  }, []);

  const featchTearcherList = async (val) => {
    if (val) {
      const res = await dispatch(handelGetTeacherList(val));
      if (res?.status === 200) {
        setTeacherList(res?.data?.response || {});
      }
    }
  };

  useEffect(() => {
    featchTearcherList(location?._id);
  }, []);
  const fetachgetSubscriptionPlan = async () => {
    const res = await dispatch(getAllSubscriptionPlan({}));
    if (res?.status === 200) {
      setsubscriptionPlan(res?.data?.response?.result || {});
    }
  };

  useEffect(() => {
    fetachgetSubscriptionPlan();
  }, []);

  useEffect(() => {
    if (teacherList?.length > 0) {
      const updatedList = teacherList?.map((ele) => ({
        value: ele?._id,
        label: ` ${ele?.firstName} ${ele?.lastName}`,
      }));

      setTeacherState(updatedList);
    }
  }, [teacherList]);
  return (
    <div id="usereditpopup-container">
      <Modal
        title={`${isEdit ? "Update" : "Add"} ${role} Details`}
        width="600px"
        onHide={onHide}
        isCloseOutside={true}
      >
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {(props) => {
            const {
              values,
              handleChange,
              handleSubmit,
              errors,
              resetForm,
              dirty,
            } = props;
            const {
              location,
              lastName,
              email,
              phoneNumber,
              date_of_birth,
              firstName,
              teachers,
              parentNumber,
              parentFirstName,
              parentLastName,
              parentEmail,
              relation,
              selectedPlan,
            } = values;
            const {
              firstName: firstNameError,
              location: studioLocationError,
              lastName: lastNameError,
              email: emailError,
              phoneNumber: phoneError,
              date_of_birth: dateOfBirthError,
              teachers: teachersError,
              parentFirstName: parentNameError,
              parentLastName: parentLastNameError,
              parentEmail: parentEmailError,
              parentNumber: parentNumberError,
              relation: relationError,
              selectedPlan: subscriptionError,
            } = errors;
            const ageCalc = calculateAge(date_of_birth);

            return (
              <form
                id="instrument-form"
                className="ps-0 pe-0 pt-20 pb-20"
                onSubmit={handleSubmit}
              >
                <div className="mb-20">
                  <Dropdown
                    id="location"
                    label="Studio location"
                    value={location}
                    onChange={(e) => {
                      handleChange(e);
                      featchTearcherList(e?.target.value);
                    }}
                    options={locationList?.map((loc) => ({
                      id: loc._id,
                      label: loc.name,
                    }))}
                    required
                    error={studioLocationError}
                    placeholder="Select studio location"
                    className="bg-white"
                    disabled={true}
                  />
                </div>
                {role === "student" && (
                  <Row className="mb-20">
                    <Col md={6}>
                      <DatePicker
                        id="date_of_birth"
                        label="Date of birth"
                        value={date_of_birth}
                        onChange={handleChange}
                        error={dateOfBirthError}
                        disabled={userEditData?._id}
                      />
                      {/* <Dropdown
                        id="age"
                        // placeholder='Select age'
                        label="Select age"
                        value={age}
                        onChange={handleChange}
                        options={numbers}
                        required
                        labelClass="color-5151 text-16-400 mb-8 font-gilroy-m"
                        startClass="color-1515"
                        error={ageError}
                      /> */}
                    </Col>
                    {teacherList?.length > 0 && (
                      <Col md={6}>
                        <Dropdown
                          id="teachers"
                          onChange={handleChange}
                          // options={teacherList}
                          options={teacherState}
                          label="Select teacher"
                          required
                          labelClass="color-5151 text-16-400 mb-8 font-gilroy-m"
                          startClass="color-1515"
                          error={teachersError}
                          value={teachers}
                          // optionLabel="lastName"
                          // optionKey="_id"
                          optionLabel="label"
                          optionKey="value"
                        />
                      </Col>
                    )}
                  </Row>
                )}
                {role === "student" && ageCalc < 17 && (
                  <React.Fragment>
                    <Row className="mb-20">
                      <Col md={6}>
                        <TextInput
                          id="parentFirstName"
                          label="Parent first name"
                          required
                          labelClass="color-5151 text-16-400 mb-8 font-gilroy-m"
                          startClass="color-1515"
                          className="h-49 br-6 bg-f7f7 b-dddd"
                          value={parentFirstName}
                          error={parentNameError}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col md={6}>
                        <TextInput
                          id="parentLastName"
                          label="Parent last name"
                          required
                          labelClass="color-5151 text-16-400 mb-8 font-gilroy-m"
                          startClass="color-1515"
                          className="h-49 br-6 bg-f7f7 b-dddd"
                          value={parentLastName}
                          error={parentLastNameError}
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-20">
                      <Col md={6}>
                        <TextInput
                          id="parentNumber"
                          label="Parent number"
                          required
                          numeric
                          labelClass="color-5151 text-16-400 mb-8 font-gilroy-m"
                          startClass="color-1515"
                          className="h-49 br-6 bg-f7f7 b-dddd"
                          value={parentNumber}
                          error={parentNumberError}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col md={6}>
                        <TextInput
                          id="relation"
                          label="relation"
                          required
                          labelClass="color-5151 text-16-400 mb-8 font-gilroy-m"
                          startClass="color-1515"
                          className="h-49 br-6 bg-f7f7 b-dddd"
                          value={relation}
                          error={relationError}
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-20">
                      <TextInput
                        id="parentEmail"
                        label="Parent email"
                        required
                        labelClass="color-5151 text-16-400 mb-8 font-gilroy-m"
                        startClass="color-1515"
                        className="h-49 br-6 bg-f7f7 b-dddd"
                        value={parentEmail}
                        error={parentEmailError}
                        onChange={handleChange}
                      />
                    </Row>
                    {/* <Row className="mb-20">
                      <Col md={6}>
                        <TextInput
                          id="parentName"
                          label="Parent name"
                          required
                          labelClass="color-5151 text-16-400 mb-8 font-gilroy-m"
                          startClass="color-1515"
                          className="h-49 br-6 bg-f7f7 b-dddd"
                          value={parentName}
                          error={parentNameError}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col md={6}>
                        <TextInput
                          id="parentNumber"
                          label="Parent number"
                          required
                          numeric
                          labelClass="color-5151 text-16-400 mb-8 font-gilroy-m"
                          startClass="color-1515"
                          className="h-49 br-6 bg-f7f7 b-dddd"
                          value={parentNumber}
                          error={parentNumberError}
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-20">
                      <Col md={6}>
                        <TextInput
                          id="relation"
                          label="relation"
                          required
                          labelClass="color-5151 text-16-400 mb-8 font-gilroy-m"
                          startClass="color-1515"
                          className="h-49 br-6 bg-f7f7 b-dddd"
                          value={relation}
                          error={relationError}
                          onChange={handleChange}
                        />
                      </Col>
                    </Row> */}
                  </React.Fragment>
                )}
                <div className="mb-20 row">
                  <div className="col-md-6">
                    <TextInput
                      id="firstName"
                      label="Frist name"
                      required
                      labelClass="color-5151 text-16-400 mb-8 font-gilroy-m"
                      startClass="color-1515"
                      className="h-49 br-6 bg-f7f7 b-dddd"
                      value={firstName}
                      error={firstNameError}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <TextInput
                      id="lastName"
                      label="Last Name/Account Name"
                      required
                      labelClass="color-5151 text-16-400 mb-8 font-gilroy-m"
                      startClass="color-1515"
                      className="h-49 br-6 bg-f7f7 b-dddd"
                      value={lastName}
                      error={lastNameError}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="mb-20">
                  <TextInput
                    id="email"
                    label="Email"
                    required
                    value={email}
                    error={emailError}
                    onChange={handleChange}
                    placeholder="Enter email"
                  />
                </div>
                <div className="mb-20">
                  <TextInput
                    id="phoneNumber"
                    label="Phone"
                    required
                    value={phoneNumber}
                    error={phoneError}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>
                {role === "student" && (
                  <div className="mb-20">
                    <Dropdown
                      id="selectedPlan"
                      label="Select subscription plan"
                      value={selectedPlan}
                      onChange={handleChange}
                      options={subscriptionPlan?.map((loc) => ({
                        id: loc._id,
                        label: loc.title,
                      }))}
                      required
                      labelClass="color-5151 text-16-400 mb-8 font-gilroy-m"
                      startClass="color-1515"
                      error={subscriptionError}
                    />
                  </div>
                )}
                <div className="fa-center gap-2 mt-20">
                  <Button
                    btnText="Submit"
                    className="h-43"
                    onClick={() => {
                      handleSubmit();
                    }}
                    loading={btnLoading}
                    disabled={btnLoading || !dirty}
                  />
                  <Button
                    btnText="Reset"
                    btnStyle="PDO"
                    className="h-43"
                    onClick={() => {
                      resetForm();
                    }}
                    disabled={!dirty}
                  />
                </div>
              </form>
            );
          }}
        </Formik>
      </Modal>
    </div>
  );
};

export default UserEditPopup;
