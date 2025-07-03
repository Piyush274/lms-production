import { useEffect } from "react";
import { Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setErrorData } from "store/globalSlice";
import "./Promptalert.scss";

const Promptalert = () => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.global);
  const { errorData } = reduxData || {};
  const { show, type, message } = errorData || {};

  // Close propt error/success message after 3 sec or click on close icon
  const resetError = () => {
    dispatch(
      setErrorData({
        show: false,
        message: "",
        type: "",
      })
    );
  };

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        resetError();
      }, 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return (
    <div id="promptalert-container">
      {show && (
        <Alert
          variant={type}
          onClose={resetError}
          closeVariant={type === "success" ? "white" : "dark"}
          dismissible
        >
          <span className="text-16-500">{message}</span>
        </Alert>
      )}
    </div>
  );
};

export default Promptalert;
