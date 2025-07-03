import { Form } from "react-bootstrap";
import "./RadioButton.scss";

const RadioButton = ({ checked, onChange, className, disabled }) => {
  return (
    <div className={`${"radio-button-container"}`}>
      {/* <input
        id={id}
        type="radio"
        name={name}
        value="test"
        checked={checked}
        onChange={onChange}
      />
      <div className="radio-circle"></div> */}

      <Form.Check
        className={className}
        onChange={onChange}
        checked={checked}
        disabled={disabled}
      />
    </div>
  );
};

export default RadioButton;
