const router = require("express").Router();
const { chatController } = require("../controller");
const { isAuthenticated } = require("../middleware/auth");

router
  // chat
  .get(
    "/fetch-user-data/:userId",
    isAuthenticated,
    chatController.getUserData
  )
  .get("/fetch-student-data", isAuthenticated, chatController.getStudentData)

  .post("/create-group", isAuthenticated, chatController.createChatGroup)
  .get("/fetch-all-group", isAuthenticated, chatController.getAllGroup)
  .post("/send-message", isAuthenticated, chatController.createMessage)
  .get("/get-message", isAuthenticated, chatController.getMessages);

module.exports = router;
