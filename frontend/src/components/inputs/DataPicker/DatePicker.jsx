import ReactDatePicker from "react-datepicker";
import moment from "moment";
import Label from "../Label";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker.scss";
import { getYearByCount } from "@/utils/helpers";


const DatePicker = ({
    label,
    error,
    isRequired,
    placeholder,
    onChange,
    name,
    value,
    id,
    minDate,
    maxDate,
    disabled,
    isClearable,
}) => {
    const months = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
    ];
    const years = getYearByCount(1953, 2030) || [];
    return (
        <div id="date-picker-container">
            {label && <Label label={label} required={isRequired} />}
            <div className="input-container">
                <ReactDatePicker
                    id={id}
                    name={name}
                    dateFormat="dd/MM/yyyy"
                    selected={value ? new Date(value) : null}
                    minDate={minDate ? new Date(minDate) : null}
                    maxDate={maxDate ? new Date(maxDate) : null}
                    placeholderText={placeholder}
                    disabled={disabled}
                    onInput={(e) => {
                        e.target.value = "";
                    }}
                    onChange={(e) => {
                        onChange({
                            target: {
                                id: id,
                                value: e ? moment(e).format("YYYY-MM-DD") : "",
                            },
                        });
                    }}
                    renderCustomHeader={({
                        date,
                        changeYear,
                        changeMonth,
                        decreaseMonth,
                        increaseMonth,
                        prevMonthButtonDisabled,
                        nextMonthButtonDisabled,
                    }) => (
                        <div
                            style={{
                                margin: 10,
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                            className="custom-date-header">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    decreaseMonth(e);
                                }}
                                disabled={prevMonthButtonDisabled}>
                                {"<"}
                            </button>
                            <select
                                value={moment(date).format("YYYY") || ""}
                                onChange={({ target: { value } }) =>
                                    changeYear(value)
                                }>
                                {years.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={months[moment(date).month()] || ""}
                                onChange={({ target: { value } }) =>
                                    changeMonth(months.indexOf(value))
                                }>
                                {months.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    increaseMonth(e);
                                }}
                                disabled={nextMonthButtonDisabled}>
                                {">"}
                            </button>
                        </div>
                    )}
                />
                {isClearable && value && (
                    <span
                        className="close-icon pointer"
                        onClick={() => {
                            onChange({
                                target: {
                                    id: id,
                                    value: "",
                                },
                            });
                        }}>
                        <i className="bi bi-x text-24-500 color-gray" />
                    </span>
                )}

                {error && (
                    <span className="text-13-400 pt-1">
                        <span style={{ color: "red" }}>{error}</span>
                    </span>
                )}
            </div>
        </div>
    );
};

export default DatePicker;
