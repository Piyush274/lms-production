import Progress from "@/components/layouts/Progress";
import "./Instruments.scss";
import { Button } from "@/components";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { useRef, useState } from "react";
import { icons } from "@/utils/constants";
const Instruments = ({data}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const swiperRef = useRef(null);

  
    const handleNext = () => {
        if (swiperRef?.current) {
            swiperRef?.current?.slideNext();
        }
    };

    const handlePrev = () => {
        if (swiperRef?.current) {
            swiperRef?.current?.slidePrev();
        }
    };

    return (
        <div className="instruments-container">
            <div className="row gy-4">
                <div className="col-xxl-5 col-lg-6">
                    <div className="instruments-left">
                        <p className="instruments-title">ASSIGNED TODAY</p>
                        <h5 className="instruments-pra">
                            Read the Starters Guide & Take Notes
                        </h5>
                        <span className="instruments-time">1:30:00 Left</span>
                        <div className="p-div">
                            <Progress now="0" />
                        </div>
                        <div className="btn-instruments">
                            <Button btnStyle="og h-37" btnText="Start" />
                        </div>
                    </div>
                </div>
                <div className="col-xxl-7 col-lg-6">
                    <div className="instruments-right">
                        <div className="fb-center top-s">
                            <div className="top-div ">
                                <h3 className="title-top "> My Instruments</h3>
                                {data?.length > 0 && (
                  <div className="custom-navigation-1">
                    <div
                      onClick={handlePrev}
                      className={`btn-prev-1 ${
                        currentSlide === 0 ? "first-slide" : ""
                      }`}
                    >
                      <img
                        src={icons?.leftLIcons}
                        alt="left-img"
                        loading="lazy"
                      />
                    </div>
                    <div
                      onClick={handleNext}
                      className={`btn-next-1 ${
                        currentSlide === data?.length - 1
                          ? "last-slide"
                          : ""
                      }`}
                    >
                      <img
                        src={icons?.leftRIcons}
                        alt="right-img"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* {goal && <Button btnText="Add instrument" btnStyle="b-w-37" />} */}
            </div>
            {data?.length > 0 && (
              <div className="swiper-div-a">
                <Swiper
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                  pagination={false}
                  breakpoints={{
                    0: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    576: {
                      slidesPerView: 3,
                      spaceBetween: 20,
                    },
                    768: {
                      slidesPerView: 4,
                      spaceBetween: 20,
                    },
                    1440: {
                      slidesPerView: 3.5,
                      spaceBetween: 20,
                    },
                  }}
                  spaceBetween={20}
                  slidesPerView={2}
                  onSlideChange={(swiper) =>
                    setCurrentSlide(swiper.activeIndex)
                  }
                  className="mySwiper"
                >
                  {data?.map((ele, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <div className="instruments-right-card-a">
                          <img
                            src={ele?.instrumentImage}
                            alt={`Instruments-${index}`}
                            loading="lazy"
                          />
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            )}
            {data?.length === 0 && ( 
              <div className="d-flex justify-content-center align-items-center h-100">
                <p className="mb-0 text-16-600 color-aoao">Not data found</p>
              </div>
            )}
                        {/* </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Instruments;
