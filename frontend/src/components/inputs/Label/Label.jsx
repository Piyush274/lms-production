import "./Label.scss";

const Label = ({ label, required, labelClass, startClass }) => {
  return (
    <div id="label-container">
      <label className={`${labelClass ? labelClass : ``}`} htmlFor={`${label}`}>
        {label}
        {required && <span className={`${startClass} ms-5`}>*</span>}
      </label>
    </div>
  );
};

export default Label;
