import { Button, Modal } from "@/components";
import "./IntroductionPopUp.scss";
import { icons } from "@/utils/constants";

const IntroductionPopUp = ({ onHide, isClose }) => {
    return (
        <Modal onHide={onHide} size="lg" isClose={isClose}>
            <div className="introduction-modal-container">
                <div className="main-div">
                    <div className="star-div">
                        <img
                            src={icons?.starGroupImg}
                            alt="star-group-img"
                            loading="lazy"
                        />
                    </div>
                    <h2 className="modal-title">You’ve made it!</h2>
                    <p className="modal-pra">
                        Take a look at our introduction video
                    </p>
                    <p className="modal-pra">
                        so you can easily explore your dashboard
                    </p>
                    <div className="btn-div">
                        <Button
                            textClass="font-gilroy-bold"
                            btnStyle="org-max"
                            btnText="Let’s Go"
                            onClick={isClose}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default IntroductionPopUp;
