import BootrsapModal from "react-bootstrap/Modal";
import { icons } from "utils/constants";
import "./Modal.scss";

const Modal = ({
  children,
  onHide,
  width,
  title,
  size,
  fullscreen,
  largeClose,
  hideCloseButton,
  isCloseOutside,
  textClass,
  isClose = true
}) => {
  return (
    <BootrsapModal
      className="brave-scroll modal-block-custom"
      onHide={onHide}
      size={size || ""}
      fullscreen={fullscreen}
      centered
      backdrop={isCloseOutside ? "static" : "true"}
      show
    >
      <BootrsapModal.Body
        id={`modal-container`}
        style={{
          maxWidth: width ? width : "",
        }}
      >

        { isClose && !hideCloseButton && (
          <>
            {largeClose ? (
              <div className="modal-close-button pointer" onClick={onHide}>
                <img src={icons.squareClose} className="h-45" alt="close" />
              </div>
            ) : (
              <div className="modal-close-button pointer" onClick={onHide}>
                <img src={icons.eventClose} className="h-26" alt="close" />
              </div>
            )}
          </>
        )}
        {title && (
          <div
            className={`col-md-12 ${
              textClass || "text-24-600 color-1a1a"
            }  cpb-20 cps-26 cpe-26 color-2749 bb-edf0`}
          >
            {title}
          </div>
        )}

        {children}
      </BootrsapModal.Body>
    </BootrsapModal>
  );
};

export default Modal;
