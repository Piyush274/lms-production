import { Button } from "@/components";
import "./Checkout.scss";
import { icons } from "@/utils/constants";
import { useNavigate } from "react-router-dom";

const Checkout = ({ setIsCheckOut }) => {
    const navigate = useNavigate();
    return (
        <section className="check-out-section">
            <div className="btn-top">
                <Button
                    btnText="Back"
                    btnStyle="btn-l"
                    leftIcon={icons.backicon}
                    onClick={() => setIsCheckOut(false)}
                />
            </div>
            <h4 className="checkout-title"> Checkout</h4>
            <div className="success-card">
                <h3 className="success-text">Payment Success 🎉</h3>
                <p className="success-pra">
                    You have successfully purchased the{" "}
                    <span> Virtual Plan </span>, a receipt has been sent to your
                    email.
                </p>
                <div className="center-img">
                    <img src={icons?.checkMarkImg} />
                </div>
                <div className="last-btn">
                    <Button
                        btnText="Continue to Dashboard"
                        btnStyle="o-t-43"
                        onClick={() => {
                            navigate("/user/dashboard");
                        }}
                    />
                </div>
            </div>
        </section>
    );
};

export default Checkout;
