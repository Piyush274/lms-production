import {
	AdminSubscriptionPopup,
	Button,
	DeleteConfirmation,
} from "@/components";
import {
	deleteSubscriptionPlan,
	getAllSubscription,
	handleGetLocation,
	setShowSubscriptionPopup,
	setSubScriptionData,
} from "@/store/globalSlice";
import { icons } from "@/utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./SubScription.scss";

const SubScription = () => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.global);
  const { showSubscriptionPopup,locationList } = reduxData || {};
  const [loading, setloading] = useState(false);
  const [data, setData] = useState([]);
  const [deleteID, setDeleteID] = useState("");

  const getPlanList = async () => {
    setloading(true);
    const res = await dispatch(getAllSubscription({}));
    if (res?.data?.response?.result) {
      setData(res?.data?.response?.result);
    }
    setloading(false);
  };

  const handleDelete = async () => {
    const res = await dispatch(deleteSubscriptionPlan(deleteID));
    if (res?.status === 200) {
      getPlanList();
      setDeleteID("");
    }
  };
  const featchLocation = async () => {
    dispatch(handleGetLocation());
  };
  useEffect(() => {
    getPlanList();
	featchLocation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="admin-subscription">
      {deleteID && (
        <DeleteConfirmation
          title="Subscription plan"
          onHide={() => {
            setDeleteID("");
          }}
          onDelete={handleDelete}
        />
      )}
      {showSubscriptionPopup && (
        <AdminSubscriptionPopup
		locationList={locationList}
          handleSuccess={() => {
            getPlanList();
            dispatch(setSubScriptionData({}));
            dispatch(setShowSubscriptionPopup(false));
          }}
          onHide={() => {
            dispatch(setSubScriptionData({}));
            dispatch(setShowSubscriptionPopup(false));
          }}
        />
      )}
      <div className="admin-sub-container">
        <div className="fb-center p-20">
          <div className="text-24-400 font-gilroy-sb color-1a1a">
            Subscriptions
          </div>
          <div>
            <Button
              type="button"
              btnText="Add"
              onClick={() => dispatch(setShowSubscriptionPopup(true))}
              className="h-40"
            />
          </div>
        </div>
        <div className="p-20">
          <div className="row row-gap-3">
            {data?.map((elm, index) => {
              const {
                planImage,
                price,
                title,
                description,
                keyPoints,
                isPopular,
                _id,
              } = elm || {};
              return (
                <div className="col-xxl-4 col-md-6" key={index}>
                  <div
                    className={`${
                      isPopular
                        ? "most-popular-card"
                        : "most-popular-card active"
                    }`}
                  >
                    <div className="fb-center flex-nowrap">
                      <div className="image-div">
                        <img
                          src={planImage || icons?.virtualImg}
                          alt=""
                          loading="lazy"
                        />
                      </div>
                      <div className="fa-center gap-3 flex-nowrap mb-27">
                        <div
                          className="pointer"
                          onClick={() => {
                            dispatch(setSubScriptionData(elm));
                            dispatch(setShowSubscriptionPopup(true));
                          }}
                        >
                          <img
                            src={icons.editImg}
                            alt=""
                            className="fit-image w-30 h-30"
                          />
                        </div>
                        <div
                          className="pointer"
                          onClick={() => setDeleteID(_id)}
                        >
                          <img
                            src={icons.redDelete}
                            alt=""
                            className="fit-image w-30 h-30"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-20-400 color-0000 mb-20">{title}</div>
                    <p className="card-pra">{description}</p>
                    <h3 className="card-price">
                      ${price}
                      <span>/month</span>
                    </h3>
                    <ul className="brave-scroll">
                      {keyPoints?.map((item, index) => {
                        return (
                          <li className="image-div-s mb-10" key={index}>
                            <img
                              src={icons?.tickImg}
                              alt="image"
                              loading="lazy"
                            />
                            <p className="card-des">{item}</p>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              );
            })}
            {data?.length === 0 && (
              <div className="text-center p-10">
                {loading ? "Loading..." : "No data found"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubScription;
