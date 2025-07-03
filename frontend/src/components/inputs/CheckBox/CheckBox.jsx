import Form from "react-bootstrap/Form";
import "./CheckBox.scss";

const CheckBox = ({ className, onChange, checked, disabled }) => {
  return (
    <div id="checkbox-container">
      <Form.Check
        className={className}
        onChange={onChange}
        checked={checked}
        disabled={disabled}
      />
    </div>
  );
};

export default CheckBox;
