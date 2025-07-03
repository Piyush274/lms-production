import { icons } from "@/utils/constants";
import Button from "../Button";
import "./ChatSearchInput.scss";

const ChatSearchInput = ({ placeholder, onClick, onChange }) => {
    return (
        <div className="chat-search-container">
            <input type="text" placeholder={placeholder} onChange={onChange} />
            <div className="btn-send">
                <button onClick={onClick}>
                    <img
                        src={icons?.navigationImg}
                        alt="send-icons"
                        loading="lazy"
                    />
                </button>
            </div>
        </div>
    );
};

export default ChatSearchInput;
