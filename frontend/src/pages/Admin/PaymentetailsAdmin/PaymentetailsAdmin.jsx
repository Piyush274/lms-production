import { Button, TextInput } from "@/components";
import CardExpiryInput from "@/components/inputs/CardExpiryInput";
import { handelpurchesPlan } from "@/store/globalSlice";
import { icons } from "@/utils/constants";
import {
  getDataFromLocalStorage,
  storeLocalStorageData,
  trimLeftSpace,
} from "@/utils/helpers";
import { Formik } from "formik";
import moment from "moment";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import "./PaymentetailsAdmin.scss";
import PaymentPopup from "./PaymentPopup";
const PaymentetailsAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const locationDa = useLocation();
  const param = useParams();
  const { state } = locationDa;
  const [isLoading, setIsLoading] = useState();
  const [isShowPayment, setShowPayment] = useState({
    flag: false,
    status: "",
    message: "",
  });

  const useData = getDataFromLocalStorage("studentData");
  const monthOptions = [
    { id: 1, label: "January" },
    { id: 2, label: "February" },
    { id: 3, label: "March" },
    { id: 4, label: "April" },
    { id: 5, label: "May" },
    { id: 6, label: "June" },
    { id: 7, label: "July" },
    { id: 8, label: "August" },
    { id: 9, label: "September" },
    { id: 10, label: "October" },
    { id: 11, label: "November" },
    { id: 12, label: "December" },
  ];
  const currentYear = moment()?.year();
  const currentMonth = moment().month() + 1;
  const yearOptions = Array?.from({ length: 25 }, (_, index) => {
    const year = currentYear + index;
    return { id: year, label: year.toString() };
  });
  const details = getDataFromLocalStorage("cardDetails");

  const initialValues = {
    cardHolderName: details?.cardHolderName || "",
    cardNumber: details?.cardNumber || "",
    expiryMonth: details?.expiryMonth || "",
    expiryYear: details?.expiryYear || "",
    cvv: details?.cvv || "",
  };
  const validationSchema = Yup.object().shape({
    cardHolderName: Yup.string().required("Card holder name is required"),
    cardNumber: Yup.string()
      .required("Card number is required")
      .matches(/^[0-9]{16}$/, "Must be 16 digits"),
    // expiryMonth: Yup.string().required("Expiry month is required"),
    expiryMonth: Yup.number()
      .required("Expiry month is required")
      .test(
        "valid-month",
        "Cannot select a past month in the current year",
        function (value) {
          const { expiryYear } = this.parent; // Accessing expiryYear from parent
          if (
            parseInt(expiryYear, 10) === currentYear &&
            parseInt(value, 10) < currentMonth
          ) {
            return false; // Invalid if in current year and month is before currentMonth
          }
          return true;
        }
      ),

    // expiryMonth: Yup.number()
    //   .required("Expiry month is required")
    //   .test(
    //     "valid-month",
    //     "Cannot select a past month in the current year",
    //     function (value) {
    //       const { expiryYear } = this.parent;
    //       if (expiryYear === currentYear && value < currentMonth) {
    //         return false;
    //       }
    //       return true;
    //     }
    //   ),
    expiryYear: Yup.string().required("Expiry year required"),
    cvv: Yup.string()
      .required("Card cvv is required")
      .matches(/^[0-9]{3}$/, "Must be 3 digits"),
  });
  const handleSave = async (value, { resetForm }) => {
    setIsLoading(true);
    // storeLocalStorageData({
    //   cardDetails: value,
    // });
    const payload = {
      userId: state?.studentPlan?.id || param?.id,
      planId: state?.studentPlan?.subscribtionId,
      cardNumber: value.cardNumber,
      ExpirationDate: `${value.expiryYear}-${String(value.expiryMonth).padStart(
        2,
        "0"
      )}`,
      cvv: value.cvv,
    };
    const res = await dispatch(handelpurchesPlan(payload));
    if (res?.data?.status === 200) {
      resetForm();
      setShowPayment({
        flag: true,
        status: "success",
        message: res?.data?.message,
      });
    } else {
      resetForm();
      setShowPayment({
        flag: true,
        status: "failed",
        message: res?.messsage,
      });
    }

    setIsLoading(false);
  };

  return (
    <>
      <section className="payment-details-container">
        <div className="btn-top">
          <Button
            btnText="Back"
            btnStyle="btn-l"
            leftIcon={icons.backicon}
            onClick={() => {
              if (state?.isTrue) {
                navigate(-1);
                storeLocalStorageData({
                  cardDetails: "",
                });
              } else {
                storeLocalStorageData({
                  cardDetails: "",
                });
                navigate("/admin/registration", {
                  state: {
                    id: state?.studentPlan?.id,
                  },
                });
              }
            }}
          />
        </div>
        <div className="row-div">
          <div className="payment-card">
            <h3 className="payment-title"> Payment Details</h3>
            <h3 className="text-18-600 color-a1a1"> {useData?.studentName}</h3>
            <p className="text-1-600 color-aoao"> {useData?.listId}</p>
            <p className="payment-pra">
              Complete your purchase by providing your payment details below
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
                  errors,
                  setFieldValue,
                  setFieldError,
                  handleSubmit,
                  handleBlur,
                } = props;
                const {
                  cardHolderName,
                  cvv,
                  expiryYear,
                  expiryMonth,
                  cardNumber,
                } = values;

                return (
                  <form
                    className="row gy-3"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit();
                      }
                    }}
                  >
                    <div className="col-12">
                      <TextInput
                        label="Card Holder Name"
                        labelClass="label-c"
                        className="input-bg"
                        value={cardHolderName}
                        onChange={(e) => {
                          setFieldValue(
                            "cardHolderName",
                            trimLeftSpace(e?.target?.value)
                          );
                        }}
                        error={errors?.cardHolderName}
                        onBlur={handleBlur}
                      />
                    </div>
                    <div className="col-12">
                      <TextInput
                        type="number"
                        label="Card Number"
                        labelClass="label-c"
                        className="input-bg"
                        value={cardNumber}
                        onChange={(e) => {
                          setFieldValue(
                            "cardNumber",
                            trimLeftSpace(e?.target?.value)
                          );
                        }}
                        error={errors?.cardNumber}
                        onBlur={handleBlur}
                      />
                    </div>
                    <div className="col-sm-6">
                      <CardExpiryInput
                        label="Expiry Date"
                        labelClass="label-c"
                        monthOptions={monthOptions}
                        monthValue={expiryMonth}
                        yearValue={expiryYear}
                        monthOptionLabel="label"
                        yearOptions={yearOptions}
                        onMonthChange={(e) => {
                          const selectedMonth = parseInt(e.target.value, 10);
                          if (
                            expiryYear === currentYear &&
                            selectedMonth < currentMonth
                          ) {
                            setFieldError(
                              "expiryMonth",
                              "Cannot select a past month in the current year"
                            );
                          } else {
                            setFieldError("expiryMonth", "");
                            setFieldValue("expiryMonth", selectedMonth);
                          }
                        }}
                        onYearChange={(e) => {
                          const selectedYear = parseInt(e.target.value, 10);
                          setFieldValue("expiryYear", selectedYear);
                          if (selectedYear === currentYear) {
                            if (expiryMonth && expiryMonth < currentMonth) {
                              setFieldError(
                                "expiryMonth",
                                "Cannot select a past month in the current year"
                              );
                            } else {
                              setFieldError("expiryMonth", "");
                            }
                          } else {
                            setFieldError("expiryMonth", "");
                          }
                        }}
                        monthErrors={errors?.expiryMonth}
                        yearErrors={errors?.expiryYear}
                        id="expiry-date"
                        name="expiry"
                        monthPlaceholder="MM"
                        yearPlaceholder="YYYY"
                      />
                    </div>
                    <div className="col-sm-6">
                      <TextInput
                        label="CVV"
                        type="number"
                        labelClass="label-c"
                        className="input-bg"
                        value={cvv}
                        onChange={(e) => {
                          setFieldValue("cvv", trimLeftSpace(e?.target?.value));
                        }}
                        error={errors?.cvv}
                        onBlur={handleBlur}
                      />
                    </div>

                    <div className="col-md-6">
                      <Button
                        btnStyle="og-43"
                        btnText="Purchase Plan"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        loading={isLoading}
                      />
                    </div>
                    <div className="col-md-6">
                      <Button
                        btnStyle="org-btn"
                        btnText="Pay Later"
                        onClick={() => {
                          storeLocalStorageData({
                            cardDetails: "",
                            studentData: "",
                          });
                          if (state?.isTrue) {
                            navigate(-1);
                          } else {
                            navigate("/admin/registration", {
                              state: { id: null },
                            });
                          }
                        }}
                      />
                    </div>
                  </form>
                );
              }}
            </Formik>
          </div>
        </div>
      </section>

      {isShowPayment.flag && (
        <PaymentPopup
          status={isShowPayment.status}
          message={isShowPayment.message}
          onHide={() => {
            setShowPayment({
              flag: false,
              status: "",
              message: "",
            });
            navigate("/admin/studentlist", {});
          }}
        />
      )}
    </>
  );
};

export default PaymentetailsAdmin;
