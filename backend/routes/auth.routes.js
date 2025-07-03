const router = require("express").Router();
const { authController } = require("../controller");
const { isAuthenticated } = require("../middleware/auth");
const { authValidation, validateRequest } = require("../utils/validations");

router
  // auth
  .post(
    "/signup",
    validateRequest(authValidation.signUpValidator),
    authController.signup
  )
  .post(
    "/sign-in",
    validateRequest(authValidation.signInValidator),
    authController.signIn
  )
  .post("/forgot-password", authController.forgotPassword)
  .post(
    "/reset-password",
    validateRequest(authValidation.resetPasswordValidator),
    authController.resetPassword
  )
  .post(
    "/change-password-mail",
    isAuthenticated,
    authController.changePasswordMail
  )
  .post(
    "/change-password",
    isAuthenticated,
    validateRequest(authValidation.changePasswordValidator),
    authController.changePassword
  )
  .post(
    "/update-password",
    isAuthenticated,
    validateRequest(authValidation.updatePasswordValidator),
    authController.updatePassword
  )
  // profile
  .put("/update-profile", isAuthenticated, authController.updateProfile)
  .get("/profile", isAuthenticated, authController.getProfile)
  .get(
    "/get-notification",
    isAuthenticated,
    authController.getNotificationList
  );

module.exports = router;
