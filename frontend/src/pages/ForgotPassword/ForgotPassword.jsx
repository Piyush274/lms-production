import { Button, TextInput } from "@/components";
import { Formik } from "formik";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import * as Yup from "yup";
import "./ForgotPassword.scss";
import { useDispatch } from "react-redux";
import { handleForgotPassword } from "@/store/globalSlice";

const ForgotPassword = ({ setIsForgotPassword }) => {
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .test("isValidEmail", "Email is not valid.", function (value) {
        if (value) {
          return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value);
        }
        return true;
      })
      .required("Email is required."),
  });

  const handleSave = async (values) => {
    setloading(true);
    await dispatch(handleForgotPassword(values));
    setloading(false);
  };
  return (
    <div className="right-div">
      <div className="right-inner-div">
        <h2 className="right-title">Forgot Password</h2>
        <div>
          <h6
            className="last-con-sign-in"
            onClick={() => setIsForgotPassword(false)}
          >
            Back to Sign in
          </h6>
        </div>
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
            } = props;
            const { email } = values;
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
                <div className="email-div">
                  <TextInput
                    id="email"
                    label="Email"
                    labelClass="text-g-m"
                    placeholder="Enter your email"
                    onChange={handleInputChange}
                    value={email}
                    error={errors?.email}
                    onBlur={handleBlur}
                  />
                </div>

                <div className="btn-div">
                  <Button
                    btnText="Submit"
                    onClick={handleSubmit}
                    loading={loading}
                  />
                  <h6 className="last-con">
                    Don’t have an account?{" "}
                    <NavLink to={"/sign-up"}> Sign Up </NavLink>
                  </h6>
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPassword;
