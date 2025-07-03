import React from "react";
import "./RattingInput.scss";
import { Rating } from "react-simple-star-rating";

const RattingInput = ({ errors, onClick, rating }) => {
    return (
        <React.Fragment>
            <Rating
                allowFraction="true"
                rating={rating}
                size={20}
                starDimension="35px"
                starSpacing="6px"
                onClick={onClick}
                iconsCount={5}
                emptyColor="#e4eeee"
                fillColor="#FFC107"
            />
            {errors?.rating && (
                <p className="text-12-400 pt-5 ps-8">
                    <span
                        style={{
                            color: "red",
                        }}>
                        {errors?.rating}
                    </span>
                </p>
            )}
        </React.Fragment>
    );
};

export default RattingInput;
