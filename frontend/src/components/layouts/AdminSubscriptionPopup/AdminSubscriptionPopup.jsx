import CheckBox from "@/components/inputs/CheckBox";
import Dropdown from "@/components/inputs/Dropdown";
import TextArea from "@/components/inputs/TextArea";
import TextInput from "@/components/inputs/TextInput";
import {
  addSubscriptionPlan,
  updateSubscriptionPlan,
} from "@/store/globalSlice";
import { icons } from "@/utils/constants";
import { Button, Modal } from "components";
import { FieldArray, Formik } from "formik";
import { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import "./AdminSubscriptionPopup.scss";

const AdminSubscriptionPopup = ({ handleSuccess, onHide, locationList }) => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.global);
  const { subScriptionData } = reduxData || {};
  const [btnLoading, setBtnLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const isEdit = subScriptionData._id ? true : false;

  const [initialValues, setInitialValues] = useState({
    title: "",
    planImage: null,
    description: "",
    location: "",
    price: "",
    keyPoints: [""],
    isPopular: false,
  });

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Number or special character is not allowed.")
      .required("Title is required.")
      .min(3, "Title must be at least 3 characters.")
      .max(20, "Title must be at most 20 characters."),
    planImage: Yup.mixed()
      .required("Required.")
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
    description: Yup.string()
      .required("Description is required.")
      .min(10, "Description must be at least 10 characters.")
      .max(100, "Description must be at most 100 characters."),
    price: Yup.number()
      .typeError("Price must be a number.")
      .required("Price is required.")
      .positive("Price must be greater than zero."),
    keyPoints: Yup.array()
      .of(Yup.string().required("Key point cannot be empty."))
      .min(1, "At least one key point is required."),
    location: Yup.string().required("Location is required."),
  });

  const handleSubmit = async (values) => {
    setBtnLoading(true);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("planImage", values.planImage);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("isPopular", values.isPopular);
    formData.append("location", values.location);
    {
      values.keyPoints.map((keyPoint) =>
        formData.append("keyPoints", keyPoint)
      );
    }
    if (isEdit) {
      formData.append("id", subScriptionData._id);
      const res = await dispatch(updateSubscriptionPlan(formData));
      if (res?.status === 200) {
        handleSuccess();
        setBtnLoading(false);
      }
    } else {
      const res = await dispatch(addSubscriptionPlan(formData));
      if (res?.status === 200) {
        handleSuccess();
        setBtnLoading(false);
      }
    }
    setBtnLoading(false);
  };

  useEffect(() => {
    if (isEdit) {
      setInitialValues({
        title: subScriptionData.title,
        planImage: subScriptionData.planImage,
        description: subScriptionData.description || "",
        price: subScriptionData.price || "",
        keyPoints: subScriptionData.keyPoints || [""],
        isPopular: subScriptionData.isPopular ? true : false,
        location: subScriptionData?.location?._id || "",
      });
      setPreviewImage(subScriptionData.planImage);
    }
  }, [isEdit, subScriptionData]);
  return (
    <div id="adminsubscriptionpopup-container">
      <Modal
        title={`${isEdit ? "Edit" : "Add"} pricing plan`}
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
              setFieldValue,
              handleSubmit,
              errors,
            } = props;

            const handleImageChange = (e) => {
              const file = e.target.files[0];
              if (file) {
                setFieldValue("planImage", file);
                const reader = new FileReader();
                reader.onloadend = () => {
                  setPreviewImage(reader.result);
                };
                reader.readAsDataURL(file);
              }
            };

            return (
              <form
                id="instrument-form"
                className="row ps-0 pe-0 pt-20 pb-20 row-gap-3"
                onSubmit={handleSubmit}
              >
                <Col md={3}>
                  <div className="upload-container-sub">
                    <label htmlFor="planImage" className="form-label mb-0">
                      Image
                    </label>
                    <div
                      className="upload-button"
                      onClick={() =>
                        document.getElementById("planImage").click()
                      }
                    >
                      <input
                        id="planImage"
                        name="planImage"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e)}
                        className="upload-input"
                      />
                      {!previewImage && (
                        <div className="upload-icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="svg-icon"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                            />
                          </svg>
                        </div>
                      )}
                      {previewImage && (
                        <div className="image-preview">
                          <img
                            src={previewImage}
                            alt=""
                            className="fit-image"
                          />
                        </div>
                      )}
                    </div>
                    {errors.planImage && (
                      <div className="input-error">{errors.planImage}</div>
                    )}
                  </div>
                </Col>
                <Col md={9}>
                  <div className="input_select">
                    <TextInput
                      id="title"
                      label="Title"
                      value={values.title}
                      name="title"
                      placeholder="Enter title"
                      onChange={handleChange}
                      required
                      error={errors.title}
                    />
                  </div>
                </Col>
                <Col md={12}>
                  <TextArea
                    id="description"
                    label="Description"
                    required
                    value={values.description}
                    onChange={handleChange}
                    error={errors.description}
                    rows="1"
                    placeholder="Enter description"
                  />
                </Col>
                <Col md={12}>
                  <Dropdown
                    id="location"
                    label="Select location"
                    value={values?.location}
                    onChange={handleChange}
                    options={locationList?.map((loc) => ({
                      id: loc._id,
                      label: loc.name,
                    }))}
                    labelClass="color-5151 text-16-400 mb-8 font-gilroy-m"
                    startClass="color-1515"
                    error={errors?.location}
                  />
                </Col>
                <Col md={12}>
                  <TextInput
                    id="price"
                    label="Price"
                    required
                    type="number"
                    value={values.price}
                    onChange={handleChange}
                    error={errors.price}
                    name="price"
                    placeholder="Enter price"
                  />
                </Col>
                <Col md={6} className="d-flex align-items-center gap-3">
                  <CheckBox
                    className="custom-checkbox"
                    onChange={(e) =>
                      setFieldValue("isPopular", e.target.checked)
                    }
                    checked={values.isPopular}
                  />
                  <label htmlFor="isPopular" className="form-label mb-0">
                    Is Popular Plan
                  </label>
                </Col>
                <Col md={12}>
                  <FieldArray
                    name="keyPoints"
                    render={(arrayHelpers) => (
                      <div className="key-points">
                        <div className="fa-center gap-2 mb-10">
                          <div className="text-18-400 font-gilroy-m color-1a1a">
                            Add Key Points
                          </div>
                          <div
                            className="w-22 h-22 pointer f-center"
                            onClick={() => arrayHelpers.push("")}
                          >
                            <img
                              src={icons.addRed}
                              alt="Add Key Point"
                              className="fit-image"
                            />
                          </div>
                        </div>
                        <div className="keyBlock brave-scroll">
                          {values.keyPoints.map((keyPoint, index) => (
                            <div key={index} className="fa-center gap-2 mb-20">
                              <div className="flex-grow-1">
                                <TextInput
                                  id={`keyPoints.${index}`}
                                  name={`keyPoints.${index}`}
                                  value={keyPoint}
                                  onChange={handleChange}
                                  placeholder={`Enter key point ${index + 1}`}
                                  error={errors.keyPoints?.[index]}
                                />
                              </div>
                              {values.keyPoints.length > 1 && (
                                <div
                                  className="w-30 h-30"
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  <img
                                    src={icons.decrease}
                                    alt="Remove"
                                    className="fit-image"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  />
                </Col>
                <div className="d-flex justify-content-end">
                  <Button
                    btnStyle="PD"
                    onClick={handleSubmit}
                    loading={btnLoading}
                    btnText="Submit"
                    className=""
                    disabled={btnLoading}
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

export default AdminSubscriptionPopup;
