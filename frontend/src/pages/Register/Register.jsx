import "./Register.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { icons, images } from "@/utils/constants";
import { Button, PasswordInput, TextInput } from "@/components";
import { NavLink } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";

const Register = () => {
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

  const initialValues = {
    name: "",
    email: "",
    password: "",
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .test("isValidEmail", "Email is not valid.", function (value) {
        if (value) {
          return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value);
        }
        return true;
      })
      .required("Email is required."),

    password: Yup.string()
      .required("Password is required")
      .min(8, "Minimum of 8 characters"),
  });

  const handleSave = (values) => {
    console.log(values);
  };

  return (
    // <section className="register-container">
    //     <div className="left-div">
    //         <Swiper
    //             pagination={{
    //                 clickable: true,
    //             }}
    //             spaceBetween={50}
    //             slidesPerView={1}
    //             modules={[Pagination]}
    //             className="mySwiper">
    //             {leftContentList?.map((ele, index) => {
    //                 const { images, LogoImg, description, title } = ele;
    //                 return (
    //                     <SwiperSlide key={index}>
    //                         <div className="logo-div">
    //                             <img
    //                                 src={icons?.WhiteLogoImg}
    //                                 alt="logo"
    //                                 loading="lazy"
    //                             />
    //                         </div>
    //                     </SwiperSlide>
    //                 );
    //             })}
    //         </Swiper>
    //     </div>

    //     <div className="right-div"></div>
    // </section>
    <section className="register-container">
      <div className="left-div">
        <Swiper
          pagination={{
            clickable: true,
          }}
          slidesPerView={1}
          modules={[Pagination]}
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
          <h2 className="right-title">Get Started</h2>
          <p className="right-pra">
            Sign up to get started with your musical journey
          </p>
          <div className="right-check">
            <Button
              btnStyle="wg"
              btnText="Sign up with Google"
              leftIcon={icons?.googleImg}
            />
            <div className="or-text">or</div>
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
              const { name, email, password } = values;
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
                  <div className="name-div">
                    <TextInput
                      id="name"
                      label="Name"
                      labelClass="text-g-m"
                      placeholder="Enter your name"
                      onChange={handleInputChange}
                      value={name}
                      error={errors?.name}
                      onBlur={handleBlur}
                    />
                  </div>
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
                  <div className="email-div">
                    <PasswordInput
                      id="password"
                      label="Password"
                      labelClass="text-g-m"
                      placeholder="Enter your password"
                      onChange={handleInputChange}
                      value={password}
                      error={errors?.password}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="btn-div">
                    <Button
                      btnStyle="og"
                      btnText="Sign Up"
                      onClick={handleSubmit}
                    />
                    <h6 className="last-con">
                      Don’t have an account?{" "}
                      <NavLink to={"/login"}> Sign In </NavLink>
                    </h6>
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

export default Register;
