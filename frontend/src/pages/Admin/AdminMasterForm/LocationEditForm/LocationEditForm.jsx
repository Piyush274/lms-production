import { Button, Modal, TextInput } from "@/components";
import "./LocationEditForm.scss";
import { Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { handelAddLocation, handelEditLocation } from "@/store/globalSlice";

const LocationEditForm = ({ onHide, fetchLocation }) => {
  const [loading, setloading] = useState(false);
  const reduxData = useSelector((state) => state.global);
  const { EditList } = reduxData || {};
  const dispatch = useDispatch();

  const initialValues = {
    name: EditList?.name || "",
    authorizeLoginId: EditList?.authorizeLoginId || "",
    authorizeTransactionKey: EditList?.authorizeTransactionKey || "",
  };

  const validationSchema = Yup.object().shape({
    // name: Yup.string()
    //   .matches(/^[a-zA-Z\s]+$/, "Number or special character is not allowed.")
    //   .required("Location is required."),

    name: Yup.string()
      .matches(/^[a-z\s]+$/, "Only lowercase letters and spaces are allowed.")
      .required("Location is required."),
    authorizeLoginId: Yup.string().required(
      "Authorize.net login id is required."
    ),
    authorizeTransactionKey: Yup.string().required(
      "Authorize.net transaction key is required."
    ),
  });

  const handleSave = async (values, { resetForm }) => {
    console.log("valuees", values);
    setloading(true);
    if (!EditList?._id) {
      const res = await dispatch(handelAddLocation(values));
      if (res?.status === 200) {
        fetchLocation();
        resetForm();
        onHide();
      }
    } else {
      const payload = {
        name: values.name,
        id: EditList?._id,
        authorizeLoginId: values.authorizeLoginId,
        authorizeTransactionKey: values.authorizeTransactionKey,
      };
      const res = await dispatch(handelEditLocation(payload));
      if (res?.status === 200) {
        fetchLocation();
        resetForm();
        onHide();
      }
    }

    setloading(false);
  };

  return (
    <Modal
      onHide={onHide}
      size="md"
      isClose={onHide}
      title={`${EditList?._id ? "Edit" : "Add"} Loaction`}
    >
      <div className="mt-20">
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
              setFieldError,
              handleBlur,
              dirty,
            } = props;
            const { name, authorizeLoginId, authorizeTransactionKey } = values;
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
            return (
              <form
                className="bottom-div"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
              >
                <div className="mb-10">
                  <TextInput
                    id="name"
                    labelClass="text-g-m"
                    placeholder="Enter Location"
                    onChange={handleInputChange}
                    value={name}
                    error={errors?.name}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="mb-10">
                  <TextInput
                    id="authorizeLoginId"
                    labelClass="text-g-m"
                    placeholder="Enter Authorize.net login id"
                    onChange={handleInputChange}
                    value={authorizeLoginId}
                    error={errors?.authorizeLoginId}
                    onBlur={handleBlur}
                  />
                </div>

                <div className="mb-10">
                  <TextInput
                    id="authorizeTransactionKey"
                    labelClass="text-g-m"
                    placeholder="Enter Authorize.net transaction key"
                    onChange={handleInputChange}
                    value={authorizeTransactionKey}
                    error={errors?.authorizeTransactionKey}
                    onBlur={handleBlur}
                  />
                </div>

                <div className="d-flex gap-2 justify-content-end mt-20">
                  <Button btnText="Close" btnStyle="PDO" onClick={onHide} />
                  <Button
                    btnText="Save"
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={loading || !dirty}
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

export default LocationEditForm;
