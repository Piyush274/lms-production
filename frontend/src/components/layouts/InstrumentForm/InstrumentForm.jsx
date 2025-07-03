import "./InstrumentForm.scss";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Button, Modal } from "components";
import { useDispatch, useSelector } from "react-redux";
import TextInput from "@/components/inputs/TextInput";
import { addInstrument, updateInstrument } from "@/store/globalSlice";
import { Col } from "react-bootstrap";

const InstrumentForm = ({ handleSuccess, onHide }) => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.global);
  const { instrumentData } = reduxData || {};
  const [btnLoading, setBtnLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const isEdit = instrumentData._id ? true : false;

  const [initialValues, setinitialData] = useState({
    name: "",
    instrumentImage: null,
  });

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Number or special character is not allowed.")
      .required("Title is required.")
      .min(3, "Title must be at least 3 characters.")
      .max(20, "Title must be at most 20 characters."),
    instrumentImage: Yup.mixed()
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
  });

  const handleSubmit = async (values) => {
    setBtnLoading(true);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("instrumentImage", values.instrumentImage);
    if (isEdit) {
      formData.append("id", instrumentData._id);
      const res = await dispatch(updateInstrument(formData));
      if (res?.status === 200) {
        handleSuccess();
        setBtnLoading(false);
      }
    } else {
      const res = await dispatch(addInstrument(formData));
      if (res?.status === 200) {
        handleSuccess();
        setBtnLoading(false);
      }
    }
    setBtnLoading(false);
  };

  useEffect(() => {
    if (isEdit) {
      setinitialData({
        name: instrumentData.name,
        instrumentImage: instrumentData.instrumentImage,
      });
      setPreviewImage(instrumentData.instrumentImage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit]);

  return (
    <div id="instrumentform-container">
      <Modal
        title={`${isEdit ? "Edit" : "Add"} Instrument`}
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
                setFieldValue("instrumentImage", file);
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
                <Col md={2}>
                  <div className="upload-container">
                    <label
                      htmlFor="instrumentImage"
                      className="form-label mb-0"
                    >
                      Image
                    </label>
                    <div
                      className="upload-button"
                      onClick={() =>
                        document.getElementById("instrumentImage").click()
                      }
                    >
                      <input
                        id="instrumentImage"
                        name="instrumentImage"
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
                    {errors?.instrumentImage && (
                      <p className="input-error">{errors?.instrumentImage}</p>
                    )}
                  </div>
                </Col>

                <Col md={10}>
                  <div className="">
                    <div className="input_select">
                      <TextInput
                        id="name"
                        label="Title"
                        value={values.name}
                        name="name"
                        placeholder="Enter title"
                        onChange={handleChange}
                        error={errors.name}
                      />
                    </div>
                  </div>
                </Col>

                <div className="d-flex justify-content-end">
                  <Button
                    btnStyle="PD"
                    onClick={handleSubmit}
                    loading={btnLoading}
                    btnText="Submit"
                    className=""
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

export default InstrumentForm;
