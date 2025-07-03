import Select from "react-select";
import Label from "../Label";
import "./MultipleDropdown.scss";

const MultipleDropdown = ({
  options,
  placeholder,
  label,
  required,
  labelClass,
  value,
  id,
  onChange,
  customStyles,
  error,
}) => {
  // const findVal = options?.find((o) => o.value === value) || null;

  return (
    <div id="multipledropdown-container">
      {label && (
        <Label label={label} required={required} labelClass={labelClass} />
      )}
      <div>
        <Select
          id={id}
          classNamePrefix="multi-select"
          options={options}
          placeholder={placeholder || "Select"}
          value={value}
          onChange={(e) => {
            onChange({ target: { id: id, value: e || "" } });
          }}
          styles={customStyles || {}}
          isClearable={false}
          isMulti
        />
        {error && <div className="input-error">{error}</div>}
      </div>
    </div>
  );
};

export default MultipleDropdown;
