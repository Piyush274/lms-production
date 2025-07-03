import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Button, PasswordInput, TextInput } from "@/components";
import { Formik } from "formik";
import { icons, images } from "@/utils/constants";
import { Swiper, SwiperSlide } from "swiper/react";
import * as Yup from "yup";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { handleLogin, handleResetPassword } from "@/store/globalSlice";
import { getDataFromLocalStorage } from "@/utils/helpers";

const leftContentList = [
  {
    images: images?.womanImg,
    LogoImg: icons?.WhiteLogoImg,
    title: "Master Your Music, Perfect Your Craft",
    description: `Dive into interactive lessons, expert tutorials, and get personalized feedback to become the musician ${"you've"} always envisioned.`,
  },
  {
    images: images?.womanImg,
    LogoImg: icons?.WhiteLogoImg,
    title: "Master Your Music, Perfect Your Craft",
    description: `Dive into interactive lessons, expert tutorials, and get personalized feedback to become the musician ${"you've"} always envisioned.`,
  },
  {
    images: images?.womanImg,
    LogoImg: icons?.WhiteLogoImg,
    title: "Master Your Music, Perfect Your Craft",
    description: `Dive into interactive lessons, expert tutorials, and get personalized feedback to become the musician ${"you've"} always envisioned.`,
  },
];

const ResetPassword = () => {
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });


  const handleSave = async (values) => {
    setloading(true);
    await dispatch(
      handleResetPassword({
        password: values.confirmPassword,
        resetPasswordToken: params.token,
      })
    );
    setloading(false);
    navigate("/login");
  };

  return (
    <section className="login-container">
      <div className="left-div">
        <Swiper
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 1500,
            disableOnInteraction: false,
          }}
          slidesPerView={1}
          modules={[Pagination, Autoplay]}
          className="mySwiper"
        >
          {leftContentList?.map((ele, index) => {
            const { images, LogoImg, description, title } = ele;
            return (
              <SwiperSlide
                key={index}
                style={{ backgroundImage: `url(${images})` }}
              >
                <div className="logo-div">
                  <img src={LogoImg} alt="logo" loading="lazy" />
                </div>
                <h2 className="left-title">{title}</h2>
                <p className="left-description">{description}</p>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <div className="right-div">
        <div className="right-inner-div">
          <h2 className="right-title">Reset Password</h2>

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
              const { password, confirmPassword } = values;
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
                  <div className="password-div">
                    <PasswordInput
                      id="password"
                      forget={false}
                      label="Password"
                      labelClass="text-g-m"
                      placeholder="Enter your password"
                      onChange={handleInputChange}
                      value={password}
                      error={errors?.password}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="password-div">
                    <PasswordInput
                      id="confirmPassword"
                      forget={false}
                      label="Confirm Password"
                      labelClass="text-g-m"
                      placeholder="Enter your Confirm password"
                      onChange={handleInputChange}
                      value={confirmPassword}
                      error={errors?.confirmPassword}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="btn-div">
                    <Button
                      btnText="Reset Password"
                      onClick={handleSubmit}
                      loading={loading}
                    />
                  </div>
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
