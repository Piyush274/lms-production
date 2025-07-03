import { useState } from "react";
import "./SelectDropDown.scss";
import { icons } from "@/utils/constants";

const SelectDropDown = ({
    options,
    placeholder,
    handleOptionClick,
    toggleDropdown,
    isOpen,
    selectedOption,
}) => {
    return (
        <div className="dropdown-container pointer">
            <div className="dropdown-header" onClick={toggleDropdown}>
                <div className="text">
                    {selectedOption ? selectedOption.label : placeholder}
                </div>
                <img src={icons?.oDownIcons} alt="down-img" loading="lazy" />
            </div>
            {isOpen && (
                <ul className="dropdown-list">
                    {options.map((option) => (
                        <li
                            key={option.value}
                            onClick={() => handleOptionClick(option)}>
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SelectDropDown;
