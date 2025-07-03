import { Button, Modal } from "@/components";
import "./VirtualPopUp.scss";
import { icons } from "@/utils/constants";

const VirtualPopUp = ({  onHide, }) => {
    return (
        <Modal onHide={onHide} size="lg" isClose={onHide}>
            <div className="virtual-popUp-container">
                <div className="main-div">
                    <div className="star-div">
                        <img
                            src={icons?.starGroupImg}
                            alt="star-group-img"
                            loading="lazy"
                        />
                    </div>
                    <h2 className="modal-title">All done!</h2>
                    <p className="modal-pra">
                        Thanks for selecting the date and time.
                    </p>
                    <p className="modal-pra">
                        You can now proceed and explore your dashboard.
                    </p>
                    <div className="btn-div">
                        <Button
                            textClass="text-17-400 font-gilroy-bold"
                            btnStyle="org-max"
                            btnText="Let’s Go"
                            onClick={onHide}
                           
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default VirtualPopUp;
