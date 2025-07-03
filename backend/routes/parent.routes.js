const router = require("express").Router();
const { parentController } = require("../controller");
const { isAuthenticated, isAuthenticatedUser } = require("../middleware/auth");

router
  // lesson
  .get(
    "/schedule-lessons",
    isAuthenticated,
    isAuthenticatedUser("parent"),
    parentController.fetchStuendtScheduleLessons
  );
module.exports = router;
