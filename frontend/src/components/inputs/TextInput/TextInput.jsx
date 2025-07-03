// import { icons } from "@/utils/constants";
// import { Label } from "components";
// import { trimLeftSpace } from "utils/helpers";
// import "./TextInput.scss";

// const TextInput = ({
//   id,
//   name,
//   error,
//   label,
//   value,
//   onBlur,
//   disabled,
//   onChange,
//   required,
//   placeholder,
//   type,
//   labelClass,
//   numeric,
//   maxLength,
//   className,
//   startClass,
//   isEdit,
//   handelEdit,
//   isShowPass
  
// }) => {
//   return (
//     <div id="textinput-container">
//       {label && (
//         <Label
//           label={label}
//           required={required}
//           labelClass={labelClass}
//           startClass={startClass}
//         />
//       )}
//       <div className="text-input-container">
//         <div className="text-input-block">
//           <input
//             id={id}
//             name={name}
//             className={className}
//             type={type || "text"}
//             value={value}
//             onBlur={onBlur}
//             autoComplete="new-password"
//             onChange={(e) => {
//               if (numeric) {
//                 e.target.value = e.target.value.replace(
//                   /^(0|[^1-9][0-9]*)$/,
//                   ""
//                 );
//               }
//               onChange({
//                 target: {
//                   id: id,
//                   value: trimLeftSpace(e.target.value),
//                 },
//               });
//             }}
//             disabled={disabled}
//             placeholder={placeholder}
//             inputMode={numeric ? "numeric" : undefined}
//             pattern={numeric ? "[0-9]*" : undefined}
//             maxLength={maxLength}
//           />
//           {isEdit && (
//             <div className="edit-icons">
//               <img src={icons?.editImg} alt="edit-icons" loading="lazy" onClick={handelEdit} />
//             </div>
//           )}
//         </div>
//         {error && <div className="input-error">{error}</div>}
//       </div>
//     </div>
//   );
// };

// export default TextInput;
import { icons } from "@/utils/constants";
import { Label } from "components";
import { trimLeftSpace } from "utils/helpers";
import "./TextInput.scss";
import { useState } from "react";

const TextInput = ({
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
  handelEdit,
  isShowPass,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div id="textinput-container">
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
            type={isShowPass && showPassword ? "text" : type || "text"}
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
          {isShowPass && type === "password" && (
            <div
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={showPassword ? icons?.HidePassImg : icons?.ShowPassImg}
                alt={showPassword ? "Hide Password" : "Show Password"}
                loading="lazy"
              />
            </div>
          )}
          {isEdit && (
            <div className="edit-icons">
              <img
                src={icons?.editImg}
                alt="edit-icons"
                loading="lazy"
                onClick={handelEdit}
              />
            </div>
          )}
        </div>
        {error && <div className="input-error">{error}</div>}
      </div>
    </div>
  );
};

export default TextInput;
