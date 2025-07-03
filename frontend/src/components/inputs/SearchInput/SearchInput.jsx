import { icons } from "@/utils/constants";
import { Label } from "components";
import { trimLeftSpace } from "utils/helpers";
import "./SearchInput.scss";

const SearchInput = ({
  id,
  name,
  error,
  label,
  value,
  onBlur,
  disabled,
  onChange,
  required,
  placeholder,
  type,
  labelClass,
  numeric,
  maxLength,
  className,
  startClass,
  isEdit,
}) => {
  return (
    <div id="searchinput-container">
      {label && (
        <Label
          label={label}
          required={required}
          labelClass={labelClass}
          startClass={startClass}
        />
      )}
      <div className="text-input-container">
        <div className="text-input-block">
          <input
            id={id}
            name={name}
            className={className}
            type={type || "text"}
            value={value}
            onBlur={onBlur}
            autoComplete="new-password"
            onChange={(e) => {
              if (numeric) {
                e.target.value = e.target.value.replace(
                  /^(0|[^1-9][0-9]*)$/,
                  ""
                );
              }
              onChange({
                target: {
                  id: id,
                  value: trimLeftSpace(e.target.value),
                },
              });
            }}
            disabled={disabled}
            placeholder={placeholder}
            inputMode={numeric ? "numeric" : undefined}
            pattern={numeric ? "[0-9]*" : undefined}
            maxLength={maxLength}
          />
          {isEdit && (
            <div className="edit-icons">
              <img src={icons?.editImg} alt="edit-icons" loading="lazy" />
            </div>
          )}
        </div>
        {error && <div className="input-error">{error}</div>}
      </div>
      <span className="h-18 w-18 d-flex">
        <img src={icons.search} alt="search" className="fit-image" />
      </span>
    </div>
  );
};

export default SearchInput;
