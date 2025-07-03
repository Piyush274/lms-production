import "./TeacherBilling.scss";
import { icons } from "@/utils/constants";
import { Button } from "@/components";
import { useNavigate } from "react-router-dom";
import React from "react";

const TeacherBilling = () => {
  const navigate = useNavigate();
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
  const rockStarList = [
    {
      image: icons?.sprintImg,
      title: "Ten Song Sprint",

      description: "Master 10 songs quickly with intense, focused lessons.",
      price: "$1497.00<span>/month</span>",
      benefit: [
        "Weekly <span>1 Hour</span> Lessons",
        "Guaranteed progress",
        "Learn 10 songs you love in 16 weeks",
      ],
    },
    {
      image: icons?.stageImg,
      title: "Fast Track to the Stage",
      description:
        "Get ready to rock the stage quickly with focused, no-nonsense training.",
      price: "$1697.00<span>/month</span>",
      benefit: [
        "Weekly <span>1 Hour</span> Lessons",
        "Get to the stage in 16 weeks",
        "Learn everything you need to perform",
      ],
    },
    {
      image: icons?.starImg,
      title: "Real Brave Star",
      description:
        "Commit to a year of expert guidance and watch your stage presence soar.",
      price: "$2997.00<span>/month</span>",
      benefit: [
        "Weekly <span>Half-Hour</span> Lessons",
        "Become a star in 1 year",
        "Be part of the ambassador band",
      ],
    },

    {
      image: icons?.professionalImg,
      title: "Pro",
      description:
        "In just six months, transform yourself into a music pro with our top-tier coaching.",
      price: "$3997.00<span>/month</span>",
      benefit: [
        "Weekly <span>1 Hour</span> Lessons",
        "Free Consultation",
        "Online Lessons",
      ],
    },
  ];
  // const [isCheckOut, setIsCheckOut] = useState(false);
  return (
    <div id="teacherbilling-container">
      <section className="billing-container">
        <div className="top-billing">
          <img src={icons?.logoBImg} alt="logo-img" loading="lazy" />
          <div className="billing-top-div">
            <p className="billing-text">Powered by</p>
            <p className="billing-mark">PracticePad®</p>
          </div>
        </div>
        <div className="most-div">
          <div className="most-title-div">
            <h4 className="pricing-title">Pricing Plans</h4>
            <div className="pricing-high">Most Popular</div>
          </div>
        </div>
        <div className="popular-row">
          {MostPopularList?.map((ele, index) => {
            const { image, description, price, benefit, title } = ele;
            return (
              <div
                className={`popular-col`}
                //     ${
                //     show
                //         ? "col-xxl-4 col-xl-5 col-lg-5 col-md-6"
                //         : "col-xxl-3 col-xl-4 col-lg-5 col-md-6"
                // }`}
                key={index}
              >
                <div className="most-popular-card most-popular-card-bg">
                  <div className="card-top">
                    {image && (
                      <div className="image-div">
                        <img src={image} alt="virtual-img" loading="lazy" />
                      </div>
                    )}
                    {title && <p className="card-title">{title}</p>}
                    {description && <p className="card-pra">{description}</p>}
                    {price && (
                      <h3
                        className="card-price"
                        dangerouslySetInnerHTML={{
                          __html: price,
                        }}
                      />
                    )}
                    {benefit && (
                      <ul>
                        {benefit?.map((ele, index) => {
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
                        btnStyle="og-43"
                        onClick={() => {
                          navigate("/teacher/billing/payment-details");
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
            {rockStarList?.map((ele, index) => {
              const { image, description, price, benefit, title } = ele;
              return (
                <React.Fragment key={index}>
                  <div
                    className="rock-star-col"

                    // "col-xxl-3 col-xl-4 col-md-6"
                  >
                    <div className="most-popular-card">
                      <div className="card-top">
                        <div className="image-div">
                          <img src={image} alt="virtual-img" loading="lazy" />
                        </div>
                        <p className="card-title">{title}</p>

                        <p className="card-pra">{description}</p>
                        <h3
                          className="card-price"
                          dangerouslySetInnerHTML={{
                            __html: price,
                          }}
                        />
                        <ul>
                          {benefit.map((ele, index) => {
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
                      </div>
                      <div className="card-bottom">
                        <div className="inner-div">
                          <Button
                            btnText="Get Started"
                            btnStyle="og-43"
                            onClick={() => {
                              navigate("/user/billing/payment-details");
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeacherBilling;
