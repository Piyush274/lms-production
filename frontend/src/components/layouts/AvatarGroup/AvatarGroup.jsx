import "./AvatarGroup.scss";
import PropTypes from "prop-types";

const AvatarGroup = ({ avatars, maxVisible = 3, size = 30 }) => {
  const visibleAvatars = avatars?.slice(0, maxVisible);
  const overflowCount = avatars?.length - maxVisible;

  return (
    <div id="avatar-group-container">
      <div
        className="avatar-group"
        style={{ height: size, width: size * (maxVisible + 1) }}
      >
        {visibleAvatars?.map((avatar, index) => (
          <img
            key={index}
            src={avatar.src}
            alt={`Avatar ${index + 1}`}
            className="avatar"
            style={{ height: size, width: size, zIndex: maxVisible - index }}
          />
        ))}
        {overflowCount > 0 && (
          <div className="overflow text-14-400 color-aoao ms-4">{`+ ${overflowCount}`}</div>
        )}
      </div>
    </div>
  );
};

AvatarGroup.propTypes = {
  avatars: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
    })
  ).isRequired,
  maxVisible: PropTypes.number,
  size: PropTypes.number,
};

export default AvatarGroup;
