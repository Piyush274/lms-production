import { useState } from "react";
import "./PasswordInput.scss";
import Label from "../Label";
import { icons } from "../../../utils/constants";
import { trimLeftSpace } from "@/utils/helpers";

const PasswordInput = ({
    id,
    placeholder,
    name,
    onChange,
    value,
    reference,
    disabled,
    autoFocus,
    error,
    isHide,
    label,
    labelClass,
    isRequired,
    forget,
    forgetClick,
}) => {
    const [inputType, setType] = useState(`${isHide ? "text" : "password"}`);
    const [isShow, setIsShow] = useState(false);
    const handleType = (type) => {
        setType(type);
    };

    return (
        <div id="password-input-container">
            <div
                className={`${forget ? "d-flex justify-content-between" : ""}`}>
                {label && (
                    <Label
                        label={label}
                        required={isRequired}
                        labelClass={labelClass}
                    />
                )}
                {forget && (
                    <div className="forget-text" onClick={forgetClick}>
                        Forgot password?
                    </div>
                )}
            </div>

            <div className="password-container">
                <input
                    id={id}
                    autoComplete="off"
                    placeholder={placeholder}
                    name={name}
                    type={inputType || "text"}
                    className="noscroll text-truncate password-input"
                    onChange={(e) => {
                        onChange({
                            target: {
                                id: id,
                                value: trimLeftSpace(e.target.value),
                            },
                        });
                    }}
                    onBlur={() => {
                        setIsShow(false);
                    }}
                    onFocus={() => {
                        setIsShow(true);
                    }}
                    value={value}
                    ref={reference}
                    disabled={disabled}
                    autoFocus={autoFocus}
                />
                {isHide ? (
                    ""
                ) : (
                    <span
                        className="password-icon"
                        onClick={() => {
                            handleType(
                                inputType === "text" ? "password" : "text"
                            );
                        }}>
                        {inputType === "text" ? (
                            <img
                                src={icons.viewImg}
                                alt="eye-icons"
                                loading="lazy"
                                className="pointer pass-icons"
                            />
                        ) : (
                            <img
                                src={icons.eyeSlashImg}
                                alt="eye-slash-icons"
                                loading="lazy"
                                className="pointer pass-icons"
                            />
                        )}
                    </span>
                )}
            </div>
            {error && <span className="input-error">{error}</span>}
        </div>
    );
};

export default PasswordInput;
