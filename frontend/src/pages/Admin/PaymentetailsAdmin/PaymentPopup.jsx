import { Button, Modal } from "@/components";
import "./PaymentPopup.scss";

const PaymentPopup = ({ onHide, status = "success", message = "" }) => {
  const isSuccess = status === "success";

  return (
    <Modal onHide={onHide} size="md" isClose={onHide} title={"Payment Details"}>
      <div className="payment-status-modal mt-20 text-center">
        <div className="icon-wrapper mb-4">
          <span
            style={{
              fontSize: "60px",
              color: isSuccess ? "#4BB543" : "#FF4C4C",
            }}
          >
            {isSuccess ? "✅" : "❌"}
          </span>
        </div>

        <p className="status-message text-lg">{message}</p>

        <div className="d-flex justify-content-center mt-20">
          <Button btnText="Close" btnStyle="PDO" onClick={onHide} />
        </div>
      </div>
    </Modal>
  );
};

export default PaymentPopup;
