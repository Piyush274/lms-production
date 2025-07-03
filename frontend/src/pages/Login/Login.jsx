import { NavLink, useNavigate } from "react-router-dom";
import "./Login.scss";
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
import { handleLogin } from "@/store/globalSlice";
import ForgotPassword from "../ForgotPassword";
import { generateToken } from "@/config/fireBase";

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

const Login = () => {
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleForgotPasswordClick = () => {
    setIsForgotPassword(true);
  };

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .test("isValidEmail", "Email is not valid.", function (value) {
        if (value) {
          return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(value);
        }
        return true;
      })
      .required("Email is required."),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Minimum of 8 characters"),
  });

  const handleSave = async (values) => {
    setloading(true);
    const token = await generateToken();
    let payload = {
      ...values,
      fcm_token: token,
    };
    await dispatch(handleLogin(payload));
    setloading(false);
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

      {isForgotPassword ? (
        <ForgotPassword setIsForgotPassword={setIsForgotPassword} />
      ) : (
        <div className="right-div">
          <div className="right-inner-div">
            <h2 className="right-title">Welcome Back</h2>
            <p className="right-pra">
              Sign in to access your lessons and continue your musical journey
            </p>

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
                const { email, password } = values;
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
                    <div className="password-div">
                      <PasswordInput
                        id="password"
                        forget={true}
                        label="Password"
                        labelClass="text-g-m"
                        placeholder="Enter your password"
                        onChange={handleInputChange}
                        value={password}
                        error={errors?.password}
                        onBlur={handleBlur}
                        forgetClick={handleForgotPasswordClick}
                      />
                    </div>
                    <div className="btn-div">
                      <Button
                        btnText="Login"
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
      )}
    </section>
  );
};

export default Login;
