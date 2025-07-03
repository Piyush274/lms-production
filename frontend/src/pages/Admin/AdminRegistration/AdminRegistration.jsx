/* eslint-disable no-unused-vars */

import { Button, Dropdown, InstrumentForm, TextInput } from "@/components";
import {
  getAllSubscriptionPlan,
  getStudentdetails,
  getUserDetailsByID,
  handelGetTeacherList,
  handelLocationTeacherList,
  handleAdminRegistration,
  handleGetInstrument,
  handleGetLocation,
  setShowInstrumentForm,
  showSuccess,
  throwError,
  updateUserStatus,
} from "@/store/globalSlice";
import { icons } from "@/utils/constants";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import "./AdminRegistration.scss";
import DatePicker from "@/components/inputs/DataPicker";
import {
  calculateAge,
  generateRandomPassword,
  storeLocalStorageData,
} from "@/utils/helpers";
import MultipleDropdown from "@/components/inputs/MultipleDropdown";
import moment from "moment";

const AdminRegistration = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location || {};
  const { id } = params || {};
  const reduxData = useSelector((state) => state.global);
  const { showInstrumentForm, instrumentList, locationList } = reduxData || {};
  const [loading, setloading] = useState(false);
  const [studentPlanList, setStudentPlanList] = useState({
    id: "",
    subscribtionId: "",
    role: "",
  });
  const isEdit = id ? true : false;
  const [initialValues, setInitialValues] = useState({
    type: "",
    location: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    date_of_birth: "",
    confirmPassword: "",
    // students: [{ firstName: "", instrument: "" }],
    // age: "",
    teachers: "",
    parentFirstName: "",
    parentLastName: "",
    parentEmail: "",
    parentNumber: "",
    parentPassword: "",
    parentConfirmPassword: "",
    relation: "",
    selectedPlan: "",
  });

  const [teacherList, setTeacherList] = useState({});
  const [list, setList] = useState([]);
  const [teacherState, setTeacherState] = useState([]);

  const [subscriptionPlan, setsubscriptionPlan] = useState([]);
  const numbers = Array.from({ length: 61 }, (_, index) => ({
    id: String(index),
    label: String(index),
  }));

  const validationSchema = Yup.object({
    type: Yup.string().required("Account type is required"),
    location: Yup.string().required("Studio location is required"),
    lastName: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Number or special character is not allowed.")
      .required("Last name is required."),
    firstName: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Number or special character is not allowed.")
      .required("First name is required."),

    email: Yup.string().email("Invalid email").required("Email is required"),
    // age: Yup.lazy((_, obj) => {
    //   if (obj.parent.type === "student") {
    //     return Yup.string().required("Age is required");
    //   } else {
    //     return Yup.string();
    //   }
    // }),
    // date_of_birth: Yup.lazy((_, obj) => {
    //   if (obj.parent.type === "student") {
    //     return Yup.string().required("Date of birth is required");
    //   } else {
    //     return Yup.string();
    //   }
    // }),
    date_of_birth: Yup.lazy((_, obj) => {
      if (obj.parent.type === "student") {
        return Yup.string()
          .required("Date of birth is required")
          .test(
            "is-valid-date",
            "Date of birth cannot be in the future",
            (value) => {
              if (!value) return false;
              const parsedDate = moment(value, "YYYY-MM-DD");

              // Check if the parsed date is valid and not in the future
              return (
                parsedDate.isValid() && parsedDate.isSameOrBefore(moment())
              );
              // console.log('value', moment(value, "YYYY-MM-DD", true).isSameOrBefore(
              //   moment()))
              // return moment(value, "YYYY-MM-DD", true)?.isSameOrBefore(
              //   moment()
              // );
            }
          );
      } else {
        return Yup.string();
      }
    }),

    phoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(
        /^(\+\d{1,3}[- ]?)?\d{10}$/,
        "Phone number must be 10 digits or follow the international format (+1234567890)"
      ),

    teachers: Yup.lazy((_, obj) => {
      if (obj?.parent?.type === "student" && teacherList?.length > 0) {
        return Yup.string()
          .min(1, "At least one teacher is required.")
          .required("Teacher field is required");
      } else {
        return Yup.string();
      }
    }),

    relation: Yup.lazy((_, obj) => {
      const age = calculateAge(obj.parent?.date_of_birth);
      if (obj.parent.type === "student" && age < 17) {
        return Yup.string().required("Relation field is required");
      } else {
        return Yup.string();
      }
    }),

    parentFirstName: Yup.lazy((_, obj) => {
      const age = calculateAge(obj.parent?.date_of_birth);

      if (obj.parent.type === "student" && age < 17) {
        return Yup.string()
          .matches(
            /^[a-zA-Z\s]+$/,
            "Number or special character is not allowed."
          )
          .required("Parent first name is required.");
      } else {
        return Yup.string().nullable();
      }
    }),
    parentLastName: Yup.lazy((_, obj) => {
      const age = calculateAge(obj.parent?.date_of_birth);

      if (obj.parent.type === "student" && age < 17) {
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
    parentNumber: Yup.lazy((_, obj) => {
      const age = calculateAge(obj.parent?.date_of_birth);

      if (obj.parent.type === "student" && age < 17) {
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
    parentEmail: Yup.lazy((_, obj) => {
      const age = calculateAge(obj.parent?.date_of_birth);

      if (obj.parent.type === "student" && age < 17) {
        return Yup.string()
          .email("Invalid email")
          .required("Parent email is required");
      } else {
        return Yup.string();
      }
    }),
    parentPassword: list?._id
      ? null
      : Yup.lazy((_, obj) => {
          const age = calculateAge(obj.parent?.date_of_birth);
          if (obj.parent.type === "student" && age < 17) {
            return Yup.string()
              .min(8, "Parent  password must be at least 8 characters")
              .required("Parent  password is required");
          } else {
            return Yup.string();
          }
        }),
    parentConfirmPassword: list?._id
      ? null
      : Yup.lazy((_, obj) => {
          const age = calculateAge(obj.parent?.date_of_birth);
          if (obj.parent.type === "student" && age < 17) {
            return Yup.string()
              .oneOf([Yup.ref("parentPassword"), null], "Passwords must match")
              .required("Confirm password is required");
          } else {
            return Yup.string();
          }
        }),
    selectedPlan: Yup.lazy((_, obj) => {
      if (obj.parent.type === "student") {
        return Yup.string().required("subscription field is required");
      } else {
        return Yup.string();
      }
    }),
    password: list?._id
      ? null
      : Yup.string()
          .min(8, "Password must be at least 8 characters")
          .required("Password is required"),
    confirmPassword: list?._id
      ? null
      : Yup.string()
          .oneOf([Yup.ref("password"), null], "Passwords must match")
          .required("Confirm password is required"),
    // students: Yup.array().of(
    //   Yup.object({
    //     firstName: Yup.string()
    //       .matches(
    //         /^[a-zA-Z\s]+$/,
    //         "Number or special character is not allowed."
    //       )
    //       .required("First name is required."),
    //     instrument: Yup.string().required("Instrument is required"),
    //   })
    // ),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setloading(true);
    let res;
    if (list?._id) {
      // eslint-disable-next-line no-unused-vars
      let {
        confirmPassword,
        parentConfirmPassword,
        parentPassword,
        students,
        teacherId,
        age,
        password,
        ...filteredValues
      } = values;

      if (
        list?.role === "student" &&
        calculateAge(values?.date_of_birth) > 17
      ) {
        const {
          parentFirstName,
          parentLastName,
          parentEmail,
          parentNumber,
          parentPassword,
          relation,
          ...rest
        } = filteredValues;
        filteredValues = rest;
      }
      if (
        list?.role === "student" &&
        calculateAge(values?.date_of_birth) < 17
      ) {
        filteredValues = {
          ...filteredValues,
          parentId: list?.studentParents?.parentId?._id,
        };
      }
      const payload = {
        ...filteredValues,
        userId: list?._id,
      };
      res = await dispatch(updateUserStatus(payload));
      if (res?.status === 200) {
        storeLocalStorageData({
          studentData: {
            studentName: values.firstName,
            listId: list?._id,
          },
        });
        resetForm();
        setInitialValues({
          type: "",
          location: "",
          lastName: "",
          firstName: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          date_of_birth: "",
          age: "",
          teachers: "",
          parentFirstName: "",
          parentLastName: "",
          parentEmail: "",
          parentNumber: "",
          parentPassword: "",
          parentConfirmPassword: "",
          relation: "",
          selectedPlan: "",
        });
        if (list?.role === "student") {
          navigate(`/admin/payment/${list?._id}`, {
            state: {
              studentPlan: {
                role: "student",
                id: list?._id,
                subscribtionId: list?.selectedPlan?._id,
              },
            },
          });
        }
      }
    } else {
      let {
        confirmPassword,
        parentConfirmPassword,
        students,
        teachers,
        age,
        ...filteredValues
      } = values;

      if (
        values.type === "student" &&
        calculateAge(values?.date_of_birth) > 17
      ) {
        const {
          parentFirstName,
          parentLastName,
          parentEmail,
          parentNumber,
          parentPassword,
          relation,
          ...rest
        } = filteredValues;
        filteredValues = rest;
      }
      if (values.type === "teacher") {
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
      const payload = {
        ...filteredValues,
        teacherId: values?.teachers,
      };
      res = await dispatch(handleAdminRegistration(payload));
      if (res?.status === 200) {
        storeLocalStorageData({
          studentData: {
            studentName: values.firstName,
            listId: res?.data?.response?.[0]?._id,
          },
        });
        resetForm();
        setInitialValues({
          type: "",
          location: "",
          lastName: "",
          firstName: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          date_of_birth: "",
          age: "",
          teachers: "",
          parentFirstName: "",
          parentLastName: "",
          parentEmail: "",
          parentNumber: "",
          parentPassword: "",
          parentConfirmPassword: "",
          relation: "",
          selectedPlan: "",
        });
        passGenereter();
        parentPassGenereter();
        if (res?.data?.response?.[0]?.role === "student") {
          setStudentPlanList({
            role: "student",
            id: res?.data?.response?.[0]?._id,
            subscribtionId: res?.data?.response?.[0]?.selectedPlan?._id,
          });
          navigate(`/admin/payment/${res?.data?.response?.[0]?._id}`, {
            state: {
              studentPlan: {
                role: "student",
                id: res?.data?.response?.[0]?._id,
                subscribtionId: res?.data?.response?.[0]?.selectedPlan?._id,
              },
            },
          });
        }
      }
    }

    setloading(false);
  };

  const getusersDetails = async () => {
    setloading(true);
    const res = await dispatch(getUserDetailsByID(id));
    if (res?.status === 200) {
      const { role, location, lastName, email, phoneNumber } =
        res.data.response || {};
      setInitialValues({
        type: role || "",
        location: location?._id || "",
        lastName: lastName || "",
        email: email || "",
        phoneNumber: phoneNumber || "",
        // students: students?.length
        //   ? students
        //   : [{ firstName: "", instrument: "" }],
        password: "",
        confirmPassword: "",
      });
      setloading(false);
    }
    setloading(false);
  };

  const initAPI = async () => {
    dispatch(handleGetInstrument());
    dispatch(handleGetLocation());
  };

  useEffect(() => {
    if (id) {
      getusersDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    initAPI();
  }, []);

  const featchTearcherList = async (val) => {
    const res = await dispatch(handelLocationTeacherList(val));
    if (res?.status === 200) {
      setTeacherList(res?.data?.response || {});
    }
  };

  const fetachgetSubscriptionPlan = async () => {
    const res = await dispatch(getAllSubscriptionPlan({}));
    if (res?.status === 200) {
      setsubscriptionPlan(res?.data?.response?.result || {});
    }
  };

  useEffect(() => {
    fetachgetSubscriptionPlan();
  }, []);

  const handelNaigate = () => {
    setStudentPlanList({ id: "", subscriptionId: "" });
    navigate(`/admin/payment/${list?._id}`, {
      state: {
        studentPlan: {
          role: "student",
          id: list?._id,
          subscribtionId: list?.selectedPlan?._id,
        },
      },
    });
  };

  const featchlist = async () => {
    if (!state?.id) return;
    const res = await dispatch(getStudentdetails(state?.id));
    if (res?.status === 200) {
      setList(res?.data?.response?.[0] || []);
    }
  };

  useEffect(() => {
    featchlist();
  }, [state]);

  // useEffect(() => {
  //   setInitialValues({
  //     type: list?.role || "",
  //     location: list?.location?._id || "",
  //     lastName: list?.lastName || "",
  //     email: list?.email || "",
  //     phoneNumber: list?.phoneNumber || "",
  //     date_of_birth: list?.date_of_birth || "",
  //     firstName: list?.firstName || "",
  //     teacherId: list?.teacherId || "",
  //     parentFirstName: list?.parentFirstName || "",
  //     parentNumber: list?.parentNumber || "",
  //     relation: list?.relation || "",
  //     selectedPlan: list?.selectedPlan?._id || "",
  //   });
  // }, [list?.length]);

  useEffect(() => {
    if (!list?.location?._id) return;
    featchTearcherList(list?.location?._id);
  }, [list?.length]);

  useEffect(() => {
    if (teacherList?.length > 0) {
      const updatedList = teacherList?.map((ele) => ({
        value: ele?._id,
        label: ` ${ele?.firstName} ${ele?.lastName}`,
      }));

      setTeacherState(updatedList);
    }
  }, [teacherList]);

  // useEffect(() => {
  //   const idArray = list?.teachers?.map((ele) => ele.teacherId._id);
  //   setInitialValues({
  //     ...initialValues,
  //     teachers: teacherState.filter((o) => idArray?.includes(o.value)),
  //   });
  // }, [list?.length, teacherState]);
  useEffect(() => {
    if (!list?.location?._id) return;

    setInitialValues((prev) => ({
      ...prev,
      type: list?.role || "",
      location: list?.location?._id || "",
      lastName: list?.lastName || "",
      email: list?.email || "",
      phoneNumber: list?.phoneNumber || "",
      date_of_birth: list?.date_of_birth || "",
      firstName: list?.firstName || "",
      teacherId: list?.teacherId || "",
      parentFirstName: list?.studentParents?.parentId?.firstName || "",
      parentLastName: list?.studentParents?.parentId?.lastName || "",
      parentEmail: list?.studentParents?.parentId?.email || "",
      parentNumber: list?.studentParents?.parentId?.phoneNumber || "",
      relation: list?.relation || "",
      selectedPlan: list?.selectedPlan?._id || "",
      teachers: list?.teachers?.[0]?.teacherId?._id || "",
    }));
  }, [list, teacherState]);

  useEffect(() => {
    passGenereter();
    parentPassGenereter();
  }, []);

  const passGenereter = () => {
    if (list?.length > 0) return;
    const randomPassword = generateRandomPassword();
    setInitialValues((prev) => ({
      ...prev,
      password: randomPassword,
    }));
  };
  const parentPassGenereter = () => {
    if (list?.length > 0) return;
    const randomPassword = generateRandomPassword();
    setInitialValues((prev) => ({
      ...prev,
      parentPassword: randomPassword,
    }));
  };

  return (
    <>
      {showInstrumentForm && (
        <InstrumentForm
          onHide={() => {
            dispatch(setShowInstrumentForm(false));
          }}
          handleSuccess={() => {
            dispatch(setShowInstrumentForm(false));
          }}
        />
      )}
      <div id="adminregistration-container">
        <div className="mainDiv brave-scroll">
          <div className="text-24-400 font-gilroy-sb color-1a1a mb-36">
            {isEdit ? "Update" : "Register"} an account
          </div>
          <div>
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
                  setFieldValue,
                  resetForm,
                  dirty,
                } = props;
                const {
                  type,
                  location,
                  lastName,
                  email,
                  phoneNumber,
                  password,
                  confirmPassword,
                  firstName,
                  date_of_birth,
                  teachers,
                  parentFirstName,
                  parentLastName,
                  parentPassword,
                  parentConfirmPassword,

                  parentEmail,
                  parentNumber,
                  relation,
                  selectedPlan,
                } = values;

                const {
                  firstName: firstNameError,
                  type: typeError,
                  location: studioLocationError,
                  lastName: lastNameError,
                  email: emailError,
                  phoneNumber: phoneError,
                  password: passwordError,
                  confirmPassword: confirmPasswordError,
                  date_of_birth: dateOfBirthError,
                  teachers: teachersError,
                  parentFirstName: parentNameError,
                  parentLastName: parentLastNameError,
                  parentEmail: parentEmailError,
                  parentPassword: parentPasswordError,
                  parentNumber: parentNumberError,
                  parentConfirmPassword: parentConfirmPasswordError,
                  relation: relationError,
                  selectedPlan: selectedPlanError,
                } = errors;
                const ageCount = calculateAge(date_of_birth);
                // const addStudent = () => {
                //   const newStudent = { firstName: "", instrument: "" };
                //   setFieldValue("students", [...students, newStudent]);
                // };

                // const removeStudent = (index) => {
                //   const updatedStudents = students.filter(
                //     (_, i) => i !== index
                //   );
                //   setFieldValue("students", updatedStudents);
                // };

                // eslint-disable-next-line react-hooks/rules-of-hooks
                useEffect(() => {
                  if (dirty) {
                    setStudentPlanList({
                      id: "",
                      subscriptionId: "",
                      role: "",
                    });
                  }
                }, [dirty]);

                const handleCopy = async (val) => {
                  try {
                    await navigator.clipboard.writeText(val);
                    dispatch(showSuccess("Password copied to clipboard!"));
                  } catch (err) {
                    dispatch(
                      throwError("Failed to copy password. Please try again.")
                    );
                  }
                };
                return (
                  <form onSubmit={handleSubmit} className="form">
                    <div className="mb-20">
                      <Dropdown
                        id="type"
                        label="Account type"
                        value={type}
                        onChange={handleChange}
                        options={[
                          { id: "teacher", label: "Teacher" },
                          { id: "student", label: "Student" },
                        ]}
                        required
                        labelClass="color-5151 text-16-400 mb-8 font-gilroy-m"
                        startClass="color-1515"
                        error={typeError}
                        disabled={isEdit}
                      />
                    </div>
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
                        labelClass="color-5151 text-16-400 mb-8 font-gilroy-m"
                        startClass="color-1515"
                        error={studioLocationError}
                      />
                    </div>
                    {type === "student" && (
                      <Row className="mb-20">
                        <Col md={6}>
                          <DatePicker
                            id="date_of_birth"
                            label="Date of birth"
                            value={date_of_birth}
                            onChange={handleChange}
                            error={dateOfBirthError}
                            disabled={list?._id}
                          />
                        </Col>
                        {teacherList?.length > 0 && (
                          <Col md={6}>
                            {/* <MultipleDropdown
                              id="teachers"
                              onChange={handleChange}
                              options={teacherState}
                              label="Select teacher"
                              required
                              labelClass="color-5151 text-16-400 mb-8 font-gilroy-m"
                              startClass="color-1515"
                              error={teachersError}
                              value={teachers}
                            /> */}
                            <Dropdown
                              id="teachers"
                              placeholder='Select teacher'
                              label="Select teacher"
                              value={teachers}
                              onChange={handleChange}
                              // options={teacherList}
                              options={teacherState}
                              optionLabel="label"
                              optionKey="value"
                              required
                              labelClass="color-5151 text-16-400 mb-8 font-gilroy-m"
                              startClass="color-1515"
                              error={teachersError}
                              disabled={isEdit}
                            />
                          </Col>
                        )}
                      </Row>
                    )}
                    {type === "student" && ageCount < 17 ? (
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
                        <Row className="mb-20">
                          <div className="position-relative">
                            <TextInput
                              id="parentPassword"
                              label="Parent password"
                              required
                              labelClass="color-5151 text-16-400 mb-8 font-gilroy-m"
                              startClass="color-1515"
                              className="h-49 br-6 bg-f7f7 b-dddd"
                              type="password"
                              isShowPass={
                                parentPassword && !list?._id ? true : false
                              }
                              value={
                                list?._id ? "*************" : parentPassword
                              }
                              error={parentPasswordError}
                              onChange={handleChange}
                              disabled={true}
                            />
                            <div className="refreshBlock-a pointer">
                              {!list?._id && (
                                <div className="d-flex gap-2">
                                  <div>
                                    <img
                                      src={icons.refresh}
                                      alt=""
                                      className="fit-image"
                                      onClick={() => {
                                        if (!list?._id) {
                                          const randomPassword =
                                            generateRandomPassword();
                                          setFieldValue(
                                            "parentPassword",
                                            randomPassword
                                          );
                                        }
                                      }}
                                    />
                                  </div>
                                  <img
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Copy Password"
                                    src={icons.CopyImg}
                                    alt=""
                                    className="fit-image"
                                    onClick={() => {
                                      if (!list?._id) {
                                        handleCopy(parentPassword);
                                      }
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </Row>
                        <Row className="mb-20">
                          <TextInput
                            id="parentConfirmPassword"
                            label="Parent confirm password"
                            required
                            labelClass="color-5151 text-16-400 mb-8 font-gilroy-m"
                            startClass="color-1515"
                            className="h-49 br-6 bg-f7f7 b-dddd"
                            type="password"
                            isShowPass={
                              parentConfirmPassword && !list?._id ? true : false
                            }
                            value={
                              list?._id
                                ? "*************"
                                : parentConfirmPassword
                            }
                            error={parentConfirmPasswordError}
                            onChange={handleChange}
                            disabled={list?._id ? true : false}
                          />
                        </Row>
                      </React.Fragment>
                    ) : (
                      ""
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
                        labelClass="color-5151 text-16-400 mb-8 font-gilroy-m"
                        startClass="color-1515"
                        className="h-49 br-6 bg-f7f7 b-dddd"
                        value={email}
                        error={emailError}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-20">
                      <TextInput
                        id="phoneNumber"
                        label="Phone"
                        required
                        labelClass="color-5151 text-16-400 mb-8 font-gilroy-m"
                        startClass="color-1515"
                        className="h-49 br-6 bg-f7f7 b-dddd"
                        value={phoneNumber}
                        error={phoneError}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-20 position-relative">
                      <TextInput
                        id="password"
                        label="Password"
                        required
                        labelClass="color-5151 text-16-400 mb-8 font-gilroy-m"
                        startClass="color-1515"
                        className="h-49 br-6 bg-f7f7 b-dddd"
                        type="password"
                        isShowPass={password && !list?._id ? true : false}
                        value={list?._id ? "*************" : password}
                        error={passwordError}
                        onChange={handleChange}
                        disabled={true}
                      />
                      <div className="refreshBlock pointer">
                        {!list?._id && (
                          <div className="d-flex gap-2">
                            <div>
                              <img
                                src={icons.refresh}
                                alt=""
                                className="fit-image"
                                onClick={() => {
                                  if (!list?._id) {
                                    const randomPassword =
                                      generateRandomPassword();
                                    setFieldValue("password", randomPassword);
                                  }
                                }}
                              />
                            </div>
                            <img
                              data-toggle="tooltip"
                              data-placement="top"
                              title="Copy Password"
                              src={icons.CopyImg}
                              alt=""
                              className="fit-image"
                              onClick={() => {
                                if (!list?._id) {
                                  handleCopy(password);
                                }
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mb-20">
                      <TextInput
                        id="confirmPassword"
                        label="Confirm password"
                        required
                        labelClass="color-5151 text-16-400 mb-8 font-gilroy-m"
                        startClass="color-1515"
                        className="h-49 br-6 bg-f7f7 b-dddd"
                        type="password"
                        isShowPass={
                          confirmPassword && !list?._id ? true : false
                        }
                        value={list?._id ? "*************" : confirmPassword}
                        error={confirmPasswordError}
                        onChange={handleChange}
                        disabled={list?._id ? true : false}
                      />
                    </div>

                    {type === "student" && (
                      <div className="mb-20">
                        <Dropdown
                          id="selectedPlan"
                          label="Select  plan"
                          value={selectedPlan}
                          onChange={handleChange}
                          options={subscriptionPlan?.map((ele) => ({
                            id: ele?._id,
                            label: ele?.title,
                          }))}
                          //   optionKey="_id"
                          //   optionLabel="title"
                          required
                          labelClass="color-5151 text-16-400 mb-8 font-gilroy-m"
                          startClass="color-1515"
                          error={selectedPlanError}
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
                        loading={loading}
                        disabled={loading || !dirty}
                      />

                      <Button
                        btnText="Reset"
                        btnStyle="PDO"
                        className="h-43"
                        onClick={() => {
                          navigate("/admin/registration", {
                            state: {
                              studentPlan: {
                                role: "",
                                id: null,
                                subscribtionId: null,
                              },
                            },
                            replace: true,
                          });
                          resetForm();
                        }}
                        disabled={!dirty}
                      />
                      {/* {list?.role === "student" &&
                        state?.id && (
                          <Button
                            btnText="Next"
                            className="h-43"
                            onClick={handelNaigate}
                          />
                        )} */}
                    </div>
                  </form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminRegistration;
