import { Button } from "@/components";
import "./PaymentApprove.scss";
import { icons } from "@/utils/constants";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import {
  handelpurchesPlan,
  showSuccess,
  throwError,
} from "@/store/globalSlice";
import { storeLocalStorageData } from "@/utils/helpers";

const PaymentApprove = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const locationDa = useLocation();
  const param = useParams();
  const { state } = locationDa;
  const [isLoading, setIsLoading] = useState();
  const [isLoadingVal, setIsLoadingVal] = useState("");
  const handleSave = async (value) => {
    setIsLoading(true);
    const payload = {
      userId: state?.userId || param?.id,
      planId: state?.planId,
      paymentStatus: value,
    };
    const res = await dispatch(handelpurchesPlan(payload));
    if (
      res?.status === 200 &&
      res?.data?.response?.paymentStatus === "completed"
    ) {
      dispatch(showSuccess(res?.data?.message));
      if (state?.isTrue) {
        navigate("/admin/studentlist", {});
      } else {
        navigate("/admin/registration", {});
      }
    }
    if (
      res?.status === 200 &&
      res?.data?.response?.paymentStatus === "failed"
    ) {
      dispatch(throwError(res?.data?.message));
      if (state?.isTrue) {
        navigate("/admin/studentlist", {});
      } else {
        navigate("/admin/registration", {});
      }
    }
    storeLocalStorageData({
      studentData:'',
      cardDetails:'',
    })

    setIsLoading(false);
  };
  return (
    <div className="payment-approve-container">
      <div className="btn-top">
        <Button
          btnText="Back"
          btnStyle="btn-l"
          leftIcon={icons.backicon}
          onClick={() => {
            navigate(-1);
            
          }}
        />
      </div>
      <div className="row-div">
        <div className="payment-card">
          <h3 className="payment-title"> Payment Status</h3>
          <div className="payment-img mt-50">
            <img src={icons?.walletImg} alt="payement-icons" />
          </div>

          <div className="d-flex justify-content-center gap-3 mt-50">
            <Button
              btnText="Success"
              btnStyle="GA"
              type="L"
              loading={isLoadingVal === "completed" && isLoading}
              disabled={isLoading}
              onClick={() => {
                handleSave("completed");
                setIsLoadingVal("completed");
              }}
            />
            <Button
              btnText="Failure"
              btnStyle="RA"
              type="L"
              loading={isLoadingVal === "failed" && isLoading}
              disabled={isLoading}
              onClick={() => {
                handleSave("failed");
                setIsLoadingVal("failed");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentApprove;
