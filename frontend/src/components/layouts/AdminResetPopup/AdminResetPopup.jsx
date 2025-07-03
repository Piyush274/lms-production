import "./AdminResetPopup.scss";
import { useDispatch } from "react-redux";
import { Button, Modal, PasswordInput, TextInput } from "@/components";
import { Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { resetPassword } from "@/store/globalSlice";
import { Col, Row } from "react-bootstrap";

const AdminResetPopup = ({ handleSuccess, onHide }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSave = async (values, { resetForm }) => {
    setLoading(true);
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...updatedValues } = values;
    const res = await dispatch(resetPassword(updatedValues));
    if (res?.status === 200) {
      resetForm();
      handleSuccess();
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <Modal onHide={onHide} title="Change Password" isCloseOutside={true}>
      <div className="reset-password-container">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          {(props) => {
            const { values, errors, handleChange, handleSubmit, handleBlur } =
              props;
            const { newPassword, confirmPassword } = values;

            return (
              <form className="password-card pt-20" onSubmit={handleSubmit}>
                <Row className="row-gap-3">
                  <Col md={12}>
                    <div>
                      <PasswordInput
                        id="currentPassword"
                        type="password"
                        label='Current password'
                        placeholder="Enter current password"
                        className="text-18 mb-3"
                        value={values.currentPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors?.currentPassword}
                      />
                    </div>
                  </Col>
                  <Col md={12} >
                    <div className="mb-20">
                      <PasswordInput
                        id="newPassword"
                        type="password"
                          label='New password'
                        placeholder="Enter new password"
                        className="text-18 mb-3"
                        value={newPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors?.newPassword}
                      />
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="mb-20">
                      <PasswordInput
                        id="confirmPassword"
                        type="password"
                        label='Confirm password'
                        placeholder="Enter confirm new password"
                        className="text-18 mb-3"
                        value={confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors?.confirmPassword}
                      />
                    </div>
                  </Col>
                </Row>

                <div className="btn-div mt-4 d-flex gap-2 justify-content-end">
                  <Button
                    btnText="Save"
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={loading}
                    className="h-43"
                  />
                  <Button
                    btnText="Cancel"
                    onClick={onHide}
                    btnStyle="PDO"
                    className="h-43"
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

export default AdminResetPopup;
