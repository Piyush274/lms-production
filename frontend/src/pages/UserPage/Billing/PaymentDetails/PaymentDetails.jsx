import { Button, CheckBox, TextInput } from "@/components";
import "./PaymentDetails.scss";
import { useNavigate } from "react-router-dom";
import { icons } from "@/utils/constants";
import CardExpiryInput from "@/components/inputs/CardExpiryInput";
import moment from "moment";
import * as Yup from "yup";
import { Formik } from "formik";
import { trimLeftSpace } from "@/utils/helpers";
import React, { useState } from "react";
import Checkout from "../Checkout";

const PaymentDetails = () => {
    const navigate = useNavigate();
    const [isCheckOut, setIsCheckOut] = useState(false);

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
    const yearOptions = Array?.from({ length: 22 }, (_, index) => {
        const year = currentYear + index;
        return { id: year, label: year.toString() };
    });

    const initialValues = {
        cardHolderName: "",
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
        discountCode: "",
        agreeToTerms: false,
    };
    const validationSchema = Yup.object().shape({
        cardHolderName: Yup.string().required("Card holder name is required"),
        cardNumber: Yup.string()
            .required("Card number is required")
            .matches(/^[0-9]{16}$/, "Must be 16 digits"),
        expiryMonth: Yup.string().required("Expiry month is required"),
        expiryYear: Yup.string().required("Expiry year required"),
        cvv: Yup.string()
            .required("Card cvv is required")
            .matches(/^[0-9]{3}$/, "Must be 3 digits"),
        discountCode: Yup.string().optional(),
        agreeToTerms: Yup.boolean().oneOf(
            [true],
            "You must accept the terms and conditions"
        ),
    });
    const handleSave = (value) => {
        // console.log("e", value);
        setIsCheckOut(true);
    };
    const benefit = [
        "Weekly <span>Hour</span> Lessons",
        "Be part of the ambassador band",
    ];
    return (
        <section className="payment-details-container">
            {isCheckOut ? (
                <Checkout setIsCheckOut={setIsCheckOut} />
            ) : (
                <React.Fragment>
                    <div className="btn-top">
                        <Button
                            btnText="Back"
                            btnStyle="btn-l"
                            leftIcon={icons.backicon}
                            onClick={() => navigate(-1)}
                        />
                    </div>
                    <div className="page-label">
                        <img
                            src={icons?.informationImg}
                            alt="information-img"
                            loading="lazy"
                        />
                        <h2 className="text-la">
                            To cancel or change a subscription, please call us
                            during business hours at <span>(718) 454-0100</span>
                        </h2>
                    </div>
                    <h4 className="payment-title"> Checkout</h4>

                    <div className="row-div">
                        {/* <div className="col-xxl-6"> */}
                        <div className="payment-card">
                            <h3 className="payment-title"> Payment Details</h3>
                            <p className="payment-pra">
                                Complete your purchase by providing your payment
                                details below
                            </p>

                            <Formik
                                enableReinitialize
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSave}>
                                {(props) => {
                                    const {
                                        values,
                                        errors,
                                        setFieldValue,
                                        handleSubmit,
                                        handleBlur,
                                    } = props;
                                    const {
                                        cardHolderName,
                                        agreeToTerms,
                                        discountCode,
                                        cvv,
                                        expiryYear,
                                        expiryMonth,
                                        cardNumber,
                                    } = values;

                                    //     const { id, value } = e.target;
                                    //     if (!touched[id]) {
                                    //         touched[id] = true;
                                    //     }
                                    //     if (value === "") {
                                    //         setFieldError(id, "");
                                    //     }

                                    //     handleChange(e);
                                    // };
                                    return (
                                        <form
                                            className="row gy-3"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleSubmit();
                                                }
                                            }}>
                                            <div className="col-12">
                                                <TextInput
                                                    label="Card Holder Name"
                                                    labelClass="label-c"
                                                    className="input-bg"
                                                    value={cardHolderName}
                                                    onChange={(e) => {
                                                        setFieldValue(
                                                            "cardHolderName",
                                                            trimLeftSpace(
                                                                e?.target?.value
                                                            )
                                                        );
                                                    }}
                                                    error={
                                                        errors?.cardHolderName
                                                    }
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
                                                            trimLeftSpace(
                                                                e?.target?.value
                                                            )
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
                                                        setFieldValue(
                                                            "expiryMonth",
                                                            e?.target?.value
                                                        );
                                                    }}
                                                    onYearChange={(e) => {
                                                        setFieldValue(
                                                            "expiryYear",
                                                            e?.target?.value
                                                        );
                                                    }}
                                                    monthErrors={
                                                        errors?.expiryMonth
                                                    }
                                                    yearErrors={
                                                        errors?.expiryYear
                                                    }
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
                                                        setFieldValue(
                                                            "cvv",
                                                            trimLeftSpace(
                                                                e?.target?.value
                                                            )
                                                        );
                                                    }}
                                                    error={errors?.cvv}
                                                    onBlur={handleBlur}
                                                />
                                            </div>
                                            <div className="col-12">
                                                <TextInput
                                                    label="Discount Code (Optional)"
                                                    labelClass="label-c"
                                                    className="input-bg"
                                                    value={discountCode}
                                                    onChange={(e) => {
                                                        setFieldValue(
                                                            "discountCode",
                                                            trimLeftSpace(
                                                                e?.target?.value
                                                            )
                                                        );
                                                    }}
                                                    error={errors?.discountCode}
                                                    onBlur={handleBlur}
                                                />
                                            </div>
                                            <div className="col-12">
                                                <div className="condition-card">
                                                    <div className="mt-3">
                                                        <CheckBox
                                                            checked={
                                                                agreeToTerms
                                                            }
                                                            // onChange={(e) => {
                                                            //     console.log("e", e);
                                                            //     setFieldValue(
                                                            //         "agreeToTerms",
                                                            //         agreeToTerms ===
                                                            //             false
                                                            //             ? true
                                                            //             : false
                                                            //     );
                                                            // }}
                                                            onChange={(e) => {
                                                                setFieldValue(
                                                                    "agreeToTerms",
                                                                    e.target
                                                                        .checked
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="condition-pra">
                                                            By clicking this, I
                                                            agree to{" "}
                                                            <strong>
                                                                Real Brave
                                                            </strong>
                                                            <span>
                                                                {" "}
                                                                Terms &
                                                                Conditions{" "}
                                                            </span>
                                                            and
                                                            <span>
                                                                {" "}
                                                                Privacy policy{" "}
                                                            </span>
                                                        </p>
                                                        {errors?.agreeToTerms && (
                                                            <div className="input-error">
                                                                {
                                                                    errors?.agreeToTerms
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <Button
                                                    btnStyle="og-43"
                                                    btnText="Purchase Plan"
                                                    onClick={handleSubmit}
                                                />
                                            </div>
                                        </form>
                                    );
                                }}
                            </Formik>
                        </div>
                        {/* </div> */}
                        {/* <div className="col-xxl-5"> */}
                        <div className="right-div">
                            <h3 className="order-title"> Payment Details</h3>
                            <p className="order-pra">
                                Complete your purchase by providing your payment
                                details below
                            </p>
                            <h4 className="order-name">Virtual</h4>
                            <h4 className="order-price">$567.00</h4>
                            <h6 className="validate-month">per month</h6>
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
                                                className="card-des-p"
                                                dangerouslySetInnerHTML={{
                                                    __html: ele,
                                                }}
                                            />
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        {/* </div> */}
                    </div>
                </React.Fragment>
            )}
        </section>
    );
};

export default PaymentDetails;
