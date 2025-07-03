const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const catchAsyncError = require("./catchAsyncError");
const { response401 } = require("../lib/response-messages");

// Token is valid or not middleware
exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
    const headers = req.headers.authorization;
    if (!headers) return response401(res, "Please login to access this resource");

    const token = headers.split(" ")[1];
    if (!token) return response401(res, "Please Enter valid Token");

    const data = jwt.verify(token, process.env.JWT_SEC);

    const user = await Users.findOne({ _id: data._id });
    if (!user) return response401(res, "Token is expired or Invalid.");
    if (!user.isActive) return response401(res, "Your account has been deactivated by the administrator.");
    if (user.isDeleted) return response401(res, "Your Account is deleted, Please contact admin for further assistance");
    
    req.user = user._id;
    req.role = user.role;

    next();
});

// authenticate middleware
// for multiple
exports.isAuthenticatedUser = (...role) => {
    return catchAsyncError(async (req, res, next) => {
        const id = req.user;
        const user = await await Users.findOne({ _id: id });
        if (role.includes(user.role)) {
            if (user.isActive) {
                next();
            } else {
                return response401(res, "Your account is deactivated.");
            }
        } else {
            return response401(res, `You are not registered as a ${role}`);
        }
    });
}
