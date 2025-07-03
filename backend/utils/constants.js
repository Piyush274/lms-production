const image_url = {
  LOGO: "https://res.cloudinary.com/dakpjnpuu/image/upload/v1729156640/real-brave/logo.png",
  INVITE:
    "https://res.cloudinary.com/dakpjnpuu/image/upload/v1729158562/real-brave/invite.png",
  RESET_PASS:
    "https://res.cloudinary.com/dakpjnpuu/image/upload/v1729158159/real-brave/forgotPassword.png",
};

const document_type = {
  Personal: "Personal",
  Student: "Student",
  Tutorial: "Tutorial",
  Supporting: "Supporting",
  External: "External",
};

const skill_status = {
  active: "active",
  inactive: "inactive",
  complete: "complete",
  deleted: "deleted",
};

const skill_history = {
  pending: "pending",
  submitted: "submitted",
  completed: "completed",
};

const location_type = {
  online: "online",
  offline: "offline",
};

const messageType ={
  text:"text",
  file:"file",
}

const generateShortUUID = (prefix) => {
  const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase(); // Random string
  return `${prefix}-${randomPart}`;
};

module.exports = {
  image_url,
  document_type,
  skill_status,
  location_type,
  generateShortUUID,
  skill_history,
  messageType,
};
