import { icons } from "@/utils/constants";
import "./Billing.scss";
import { Button, Roundedloader } from "@/components";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllSubscription, getProfile } from "@/store/globalSlice";

const Billing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);
  const [data, setData] = useState([]);
  const [rockStarList, setRockStarList] = useState([]);
  const [starList, setStarList] = useState([]);
  const reduxData = useSelector((state) => state.global);
  const { profileData } = reduxData || {};
  // console.log('profileData', profileData?.selectedPlan?._id)

  const MostPopularList = [
    {
      image: icons?.virtualImg,
      title: "Virtual",
      description:
        "  Grow your music skills from the comfort of your home with our easy virtual lessons.",
      price: " $567.00<span>/month</span>",
      benefit: [
        "Weekly <span> Half-Hour</span> Lessons",
        "Free Consultation",
        "Online Lessons",
      ],
    },
    {
      image: icons?.studioImg,
      title: "In Studio",
      description:
        "Step into the studio and take your music to the next level with hands-on guidance.",
      price: "$797.00<span>/month</span>",
      benefit: [
        "Weekly <span> Half-Hour</span> Lessons",
        "Free Consultation",
        " Online Lessons",
      ],
    },
  ];
  // const rockStarList = [
  //   {
  //     image: icons?.sprintImg,
  //     title: "Ten Song Sprint",

  //     description: "Master 10 songs quickly with intense, focused lessons.",
  //     price: "$1497.00<span>/month</span>",
  //     benefit: [
  //       "Weekly <span>1 Hour</span> Lessons",
  //       "Guaranteed progress",
  //       "Learn 10 songs you love in 16 weeks",
  //     ],
  //   },
  //   {
  //     image: icons?.stageImg,
  //     title: "Fast Track to the Stage",
  //     description:
  //       "Get ready to rock the stage quickly with focused, no-nonsense training.",
  //     price: "$1697.00<span>/month</span>",
  //     benefit: [
  //       "Weekly <span>1 Hour</span> Lessons",
  //       "Get to the stage in 16 weeks",
  //       "Learn everything you need to perform",
  //     ],
  //   },
  //   {
  //     image: icons?.starImg,
  //     title: "Real Brave Star",
  //     description:
  //       "Commit to a year of expert guidance and watch your stage presence soar.",
  //     price: "$2997.00<span>/month</span>",
  //     benefit: [
  //       "Weekly <span>Half-Hour</span> Lessons",
  //       "Become a star in 1 year",
  //       "Be part of the ambassador band",
  //     ],
  //   },

  //   {
  //     image: icons?.professionalImg,
  //     title: "Pro",
  //     description:
  //       "In just six months, transform yourself into a music pro with our top-tier coaching.",
  //     price: "$3997.00<span>/month</span>",
  //     benefit: [
  //       "Weekly <span>1 Hour</span> Lessons",
  //       "Free Consultation",
  //       "Online Lessons",
  //     ],
  //   },
  // ];

  const getPlanList = async () => {
    setloading(true);
    const res = await dispatch(getAllSubscription({}));
    if (res?.data?.response?.result) {
      setData(res?.data?.response?.result);
    }
    setloading(false);
  };
  const fetchProfile = async () => {
    setloading(true);
    const res = await dispatch(getProfile({}));

    setloading(false);
  };

  useEffect(() => {
    getPlanList();
    fetchProfile();
  }, []);
  useEffect(() => {
    if (data?.length > 0) {
      const ispopular = data?.filter((ele) => ele?.isPopular === true);
      setRockStarList(ispopular);
      const popularNo = data?.filter((ele) => ele?.isPopular === false);
      setStarList(popularNo);
    }
  }, [data]);

  return (
    <React.Fragment>
      <section className="billing-container">
        <div className="top-billing">
          <img src={icons?.logoBImg} alt="logo-img" loading="lazy" />
          <div className="billing-top-div">
            <p className="billing-text">Powered by</p>
            <p className="billing-mark">PracticePad®</p>
          </div>
        </div>

        {loading ? (
          <div className="f-center pt-100">
            <Roundedloader />
          </div>
        ) : (
          <React.Fragment>
            <div className="most-div">
              <div className="most-title-div">
                <h4 className="pricing-title">Pricing Plans</h4>
                <div className="pricing-high">Most Popular</div>
              </div>
            </div>
            <div className="popular-row">
              {rockStarList?.map((ele, index) => {
                const { description, price, title, planImage, keyPoints, _id } =
                  ele;
                const active = profileData?.selectedPlan?._id === _id;

                return (
                  <div className={`popular-col`} key={index}>
                    <div
                      className={`most-popular-card most-popular-card-bg ${
                        profileData?.hasSubscriptionPlan && active
                          ? "border-active"
                          : ""
                      }`}
                    >
                      <div className="card-top">
                        {planImage && (
                          <div className="image-div">
                            <img
                              src={planImage}
                              alt="virtual-img"
                              loading="lazy"
                            />
                          </div>
                        )}
                        {profileData?.hasSubscriptionPlan && active && (
                          <div className="text-16-800 mb-8 color-0000">
                            {" "}
                            Current Plan
                          </div>
                        )}
                        {title && <p className="card-title">{title}</p>}
                        {description && (
                          <p className="card-pra">{description}</p>
                        )}
                        {price && (
                          <h3 className="card-price">
                            $ {price} <span> /month</span>
                          </h3>
                        )}
                        {keyPoints && (
                          <ul>
                            {keyPoints?.map((ele, index) => {
                              return (
                                <li className="image-div-s" key={index}>
                                  <img
                                    src={icons?.tickImg}
                                    alt="image"
                                    loading="lazy"
                                  />
                                  <p
                                    className="card-des"
                                    dangerouslySetInnerHTML={{
                                      __html: ele,
                                    }}
                                  />
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                      <div className="card-bottom">
                        <div className="inner-div">
                          <Button
                            btnText="Get Started"
                            disabled={
                              profileData?.hasSubscriptionPlan && active
                            }
                            btnStyle="og-43"
                            onClick={() => {
                              navigate("/user/billing/payment-details");
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="rock-star-div">
              <h3 className="rock-star-title">The Path to a Rockstar</h3>
              <div className="rock-star-row">
                {starList?.map((ele, index) => {
                  const {
                    planImage,
                    description,
                    price,
                    keyPoints,
                    title,
                    _id,
                  } = ele;
                  const active = profileData?.selectedPlan?._id === _id;
                  return (
                    <React.Fragment key={index}>
                      <div
                        className="rock-star-col"

                        // "col-xxl-3 col-xl-4 col-md-6"
                      >
                        <div
                          className={`most-popular-card ${
                            profileData?.hasSubscriptionPlan && active
                              ? "border-active"
                              : ""
                          }`}
                        >
                          <div className="card-top">
                            <div className="image-div">
                              <img
                                src={planImage}
                                alt="virtual-img"
                                loading="lazy"
                              />
                            </div>
                            {profileData?.hasSubscriptionPlan && active && (
                              <div className="text-16-800 mb-8 color-fe5c">
                                {" "}
                                Current Plan
                              </div>
                            )}

                            <p className="card-title">{title}</p>

                            <p className="card-pra">{description}</p>
                            <h3 className="card-price">
                              $ {price} <span>/month</span>
                            </h3>
                            <ul>
                              {keyPoints.map((ele, index) => {
                                return (
                                  <li className="image-div-s" key={index}>
                                    <img
                                      src={icons?.tickImg}
                                      alt="image"
                                      loading="lazy"
                                    />
                                    <p className="card-des">{ele}</p>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                          <div className="card-bottom">
                            <div className="inner-div">
                              <Button
                                btnText="Get Started"
                                btnStyle="og-43"
                                disabled={
                                  profileData?.hasSubscriptionPlan && active
                                }
                                onClick={() => {
                                  navigate("/user/billing/payment-details");
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {index === 2 && (
                        // <div className="col-xxl-3  col-xl-0" />
                        <div className="col-xxl-3 col-xl-4  d-none d-xxl-block"></div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </React.Fragment>
        )}
      </section>
      {/* )} */}
    </React.Fragment>
  );
};

export default Billing;
