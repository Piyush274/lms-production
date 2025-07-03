import { Spinner } from "react-bootstrap";
import "./Roundedloader.scss";

const Roundedloader = ({ size, type }) => {
  let variantType = {
    P: "primary",
    S: "success",
    R: "danger",
    W: "warning",
    D: "dark",
    L: "light",
  };
  return (
    <div id="roundedloader-container">
      <Spinner
        animation="border"
        role="status"
        size={size || "sm"}
        variant={variantType[type] || "dark"}
      />
    </div>
  );
};

export default Roundedloader;
