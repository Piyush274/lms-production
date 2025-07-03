import React from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import "./Progress.scss";
const Progress = ({ now }) => {
    return (
        <div className="progress-container">
            <ProgressBar
                completed={now}
                maxCompleted={100}
                bgColor="#fe5c38"
                borderRadius="100px"
                labelColor="transparent"
                height="12px"
                barContainerClassName="div-border"
                baseBgColor="#E5E5E5"
            />
        </div>
    );
};

export default Progress;
