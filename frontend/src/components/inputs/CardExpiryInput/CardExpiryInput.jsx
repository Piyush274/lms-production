import Label from "../Label";
import "./CardExpiryInput.scss";
import Select from "react-select";

const CardExpiryInput = ({
    label,
    required,
    monthOptions,
    yearOptions,
    monthValue,
    yearValue,
    monthOptionsKey,
    monthOptionLabel,
    yearOptionsKey,
    yearOptionLabel,
    onMonthChange,
    onYearChange,
    id,
    name,
    monthPlaceholder,
    yearPlaceholder,
    disabled,
    isLoading,
    isClearable,
    onMenuScrollToBottom,
    onInputChange,
    info,
    startClass,
    labelClass,
    monthErrors,
    yearErrors,
}) => {
    const monthOptId = monthOptionsKey || "id";
    const monthOptVal = monthOptionLabel || "label";
    let fillValue = monthOptions?.find(
        (o) => `${o?.[monthOptId]}` === `${monthValue}`
    );
    if (!fillValue) {
        fillValue = null;
    }
    const yearOptId = yearOptionsKey || "id";
    const yearOptVal = yearOptionLabel || "label";
    let fillYearValue = yearOptions?.find(
        (o) => `${o?.[yearOptId]}` === `${yearValue}`
    );
    if (!fillYearValue) {
        fillYearValue = null;
    }
    return (
        <div className="card-input-expiry-container">
            {label && (
                <Label
                    label={label}
                    required={required}
                    info={info}
                    startClass={startClass}
                    labelClass={labelClass}
                />
            )}
            <div className="main-div">
                <div className="select-month-container">
                    <Select
                        getOptionValue={(option) => option[monthOptId]}
                        placeholder={monthPlaceholder || "MM"}
                        className={`basic-single ${
                            monthValue ? "" : "placeholder-val"
                        }`}
                        classNamePrefix="select"
                        value={fillValue}
                        isDisabled={disabled}
                        isLoading={isLoading}
                        name={`${name}-month`}
                        options={monthOptions}
                        isClearable={isClearable}
                        onMenuScrollToBottom={onMenuScrollToBottom}
                        getOptionLabel={(option) => {
                            return option[monthOptVal];
                        }}
                        onInputChange={(text, event) => {
                            if (
                                onInputChange &&
                                event?.action === "input-change"
                            ) {
                                onInputChange(text);
                            }
                        }}
                        onChange={(e) => {
                            onMonthChange({
                                target: {
                                    id: id,
                                    value: e ? e[monthOptId] : "",
                                    data: e,
                                },
                            });
                        }}
                    />
                    {monthErrors && (
                        <div className="input-error me-10">{monthErrors}</div>
                    )}
                </div>
                <div className="select-year-container">
                    <Select
                        getOptionValue={(option) => option[yearOptId]}
                        placeholder={yearPlaceholder || "YYYY"}
                        className={`basic-single ${
                            yearValue ? "" : "placeholder-val"
                        }`}
                        classNamePrefix="select"
                        value={fillYearValue}
                        isDisabled={disabled}
                        isLoading={isLoading}
                        name={`${name}-year`}
                        options={yearOptions}
                        isClearable={isClearable}
                        onMenuScrollToBottom={onMenuScrollToBottom}
                        getOptionLabel={(option) => {
                            return option[yearOptVal];
                        }}
                        onInputChange={(text, event) => {
                            if (
                                onInputChange &&
                                event?.action === "input-change"
                            ) {
                                onInputChange(text);
                            }
                        }}
                        onChange={(e) => {
                            onYearChange({
                                target: {
                                    id: id,
                                    value: e ? e[yearOptId] : "",
                                    data: e,
                                },
                            });
                        }}
                    />
                    {yearErrors && (
                        <div className="input-error">{yearErrors}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardExpiryInput;
