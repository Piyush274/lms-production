const catchAsyncError = require("../middleware/catchAsyncError");
const { Users } = require("../models");
const bcrypt = require("bcryptjs");
const {
  response200,
  response400,
  response500,
} = require("../lib/response-messages");
const { userService, authService, adminService } = require("../service");
const crypto = require("crypto");
const { forgotPasswordMail } = require("../utils/emailTemplates");
const multer = require("multer");
const { uploadFile, deleteImage } = require("../lib/uploader/upload");
const { isValidObjectId } = require("mongoose");
const storage = multer.memoryStorage();
const upload = multer({ storage });

// sign up
const signup = catchAsyncError(async (req, res) => {
  let { email, password, role } = req.body;

  let user = await userService.checkUser({ email });
  if (user) return response400(res, "User is already register with us");

  req.body.password = bcrypt.hashSync(password, 10);

  user = await userService.registerUser({ ...req.body, isFirstLogin: true });
  let token = await authService.generateToken({ userId: user._id });

  let data = {
    userId: user._id,
    email,
    name: user.name,
    isFirstLogin: user.isFirstLogin,
    role,
    token,
  };

  return response200(res, "Sign up done successfully", data);
});

// sign-in
const signIn = catchAsyncError(async (req, res) => {
  let { email, password, fcm_token } = req.body;

  let user = await userService.userDetailsForLogin({ email, isDeleted: false });
  if (!user) return response400(res, "Invalid email");
  if (user.isDeleted)
    return response400(
      res,
      "Your Account is deleted, Please contact admin for further assistance"
    );

  if (!bcrypt.compareSync(password, user.password))
    return response400(res, "Invalid password");

  let token = await authService.generateToken({ userId: user._id });

  // save update fcm_token user
  await userService.updateUser({ _id: user._id }, { fcm_token, lastLogin: new Date() });

  // update isFirstLogin status
  // user.isFirstLogin = user.isFirstLogin === true ? user.isFirstLogin = false : user.isFirstLogin = true;
  // await user.save()

  let data = {
    userId: user._id,
    email,
    name: user.name,
    isFirstLogin: user.isFirstLogin,
    role: user.role,
    token,
    fcm_token,
  };
  return response200(res, "Login done successfully", data);
});

// forgot password
const forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return response400(res, "Email is required");

  const user = await userService.checkUser({ email });
  if (!user) return response400(res, "User details not found.");

  const resetToken = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // hashedToken =
  //   "8769e56dffb7c6c0559a97f9e69ce8386be503abf18730c3958c88d732acf518";
  const tokenExpiration = Date.now() + 15 * 60 * 1000; // Token valid for 15 minutes
  const resetPasswordUrl = `${process.env.FRONT_URL}/reset-password/${hashedToken}`;

  const name = `${user.firstName} ${user.lastName}`;

  await forgotPasswordMail({ email: user.email, name: name, resetPasswordUrl });
  // console.log(hashedToken,"hashedToken")
  user.resetPasswordToken = hashedToken;
  user.resetPasswordTokenExpires = tokenExpiration;
  await user.save();

  return response200(
    res,
    "Please check your mail and click on the link to reset your password",
    true
  );
});

// reset password
const resetPassword = catchAsyncError(async (req, res, next) => {
  const { password, resetPasswordToken } = req.body;

  const user = await userService.checkUser({
    resetPasswordToken,
    resetPasswordTokenExpires: { $gt: Date.now() },
  });
  if (!user)
    return response400(res, "Reset password token is invalid or expired.");

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;

  await user.save();
  return response200(res, "Password Reset successfully.", true);
});

// update profile
const updateProfile = catchAsyncError(async (req, res) => {
  const id = req.user;
  upload.fields([
    { name: "firstName", maxCount: 1 },
    { name: "lastName", maxCount: 1 },
    { name: "email", maxCount: 1 },
    { name: "location", maxCount: 1 },
    { name: "phoneNumber", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ])(req, res, async (err) => {
    try {
      if (err) return response400(res, "Something went wrong");

      const { firstName, lastName, email, location, phoneNumber } = req.body;
      const user = await userService.checkUser({ _id: id });

      if (email) {
        const isExits = await userService.checkUser({
          email,
          _id: { $ne: id },
        });
        if (isExits) return response400(res, "Email is already exits.");
        user.email = email;
      }

      if (phoneNumber) {
        const isExits = await userService.checkUser({
          phoneNumber,
          _id: { $ne: id },
        });
        if (isExits) return response400(res, "Phone number is already exits.");
        user.phoneNumber = phoneNumber;
      }

      if (req?.files?.profileImage) {
        const file = req.files.profileImage[0];
        const result = await uploadFile(file);
        if (user.profileImage) await deleteImage(user.profileImage);
        user.profileImage = result;
      }
      // validate location
      if (location) {
        if (!isValidObjectId(location))
          return response400(res, "Please enter valid location id");
        const locationDetails = await adminService.checkOption("Locations", {
          _id: location,
        });
        if (!locationDetails)
          return response400(res, "Location details not found.");

        user.location = location;
      }

      user.firstName = firstName ? firstName : user.firstName;
      user.lastName = lastName ? lastName : user.lastName;
      user.email = email ? email : user.email;
      await user.save();
      return response200(res, "Account details update successfully", []);
    } catch (error) {
      console.log("✌️error --->", error);
      response500(res, "Something went wrong");
    }
  });
});

// get profile
const getProfile = catchAsyncError(async (req, res) => {
  let userId = req.user;
  let data = await userService.userDetails({ _id: userId });
  return response200(res, "Data fetched successfully", data);
});

// change password
const changePasswordMail = catchAsyncError(async (req, res, next) => {
  const userId = req.user;

  const user = await userService.checkUser({ _id: userId });

  const resetToken = crypto.randomBytes(20).toString("hex");
  // const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  hashedToken =
    "8769e56dffb7c6c0559a97f9e69ce8386be503abf18730c3958c88d732acf518";
  const tokenExpiration = Date.now() + 15 * 60 * 1000; // Token valid for 15 minutes
  const changePasswordUrl = `${process.env.FRONT_URL}/change-password/${resetToken}`;

  // await forgotPasswordMail({ email: user.email, name: user.name, changePasswordUrl });
  user.changePasswordToken = hashedToken;
  await user.save();

  return response200(
    res,
    "Please check your mail and click on the link to reset your password",
    true
  );
});

// get notificatoin list
const getNotificationList = catchAsyncError(async (req, res) => {
  let userId = req.user;
  let data = await userService.notificationList({ userId: userId });
  return response200(res, "Data fetched successfully", data);
});

// change password
const changePassword = catchAsyncError(async (req, res) => {
  const userId = req.user;
  let { currentPassword, newPassword, changePasswordToken } = req.body;

  const user = await userService.checkUser({ _id: userId });

  if (user.changePasswordToken !== changePasswordToken)
    return response400(res, "Invalid token");
  if (!bcrypt.compareSync(currentPassword, user.password))
    return response400(res, "Invalid current password");

  newPassword = bcrypt.hashSync(newPassword, 10);
  user.password = newPassword;
  await user.save();

  return response200(res, "Password reset successfully.");
});

const updatePassword = catchAsyncError(async (req, res) => {
  const userId = req.user;
  const { currentPassword, newPassword } = req.body;

  let user = await userService.checkUser({ _id: userId });
  if (!bcrypt.compareSync(currentPassword, user.password))
    return response400(res, "Invalid current password");

  const Password = bcrypt.hashSync(newPassword, 10);
  user.password = Password;
  await user.save();

  return response200(res, "Password changed successfully.");
});

module.exports = {
  signup,
  signIn,
  forgotPassword,
  resetPassword,
  updateProfile,
  getProfile,
  changePasswordMail,
  changePassword,
  updatePassword,
  getNotificationList,
};
