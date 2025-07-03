import { Label } from "components";
import Select from "react-select";
import "./Dropdown.scss";

const Dropdown = ({
    label,
    required,
    optionKey,
    optionLabel,
    value,
    options,
    onChange,
    id,
    name,
    placeholder,
    disabled,
    isLoading,
    isClearable,
    isSearchable,
    onMenuScrollToBottom,
    onInputChange,
    error,
    info,
    startClass,
    labelClass,
    className,
}) => {
    const optId = optionKey || "id";
    const optVal = optionLabel || "label";
    let fillValue = options?.find((o) => `${o?.[optId]}` === `${value}`);
    if (!fillValue) {
        fillValue = null;
    }
    return (
        <div id={`dropdown-container`}>
            {label && (
                <Label
                    label={label}
                    required={required}
                    info={info}
                    startClass={startClass}
                    labelClass={labelClass}
                />
            )}
            <div className="select-input-container">
                <Select
                    getOptionValue={(option) => option[optId]}
                    placeholder={placeholder || ""}
                    className={`basic-single ${
                        value ? "" : "placehoder-val"
                    } ${className}`}
                    classNamePrefix="select"
                    value={fillValue}
                    isDisabled={disabled}
                    isLoading={isLoading}
                    name={name}
                    options={options}
                    isClearable={isClearable}
                    isSearchable={isSearchable}
                    onMenuScrollToBottom={onMenuScrollToBottom}
                    getOptionLabel={(option) => {
                        return option[optVal];
                    }}
                    onInputChange={(text, event) => {
                        if (onInputChange && event?.action === "input-change") {
                            onInputChange(text);
                        }
                    }}
                    onChange={(e) => {
                        onChange({
                            target: {
                                id: id,
                                value: e ? e[optId] : "",
                                data: e,
                            },
                        });
                    }}
                    // menuIsOpen
                />
                {error && <div className="input-error">{error}</div>}
            </div>
        </div>
    );
};

export default Dropdown;
