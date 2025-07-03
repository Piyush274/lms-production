const { userService } = require("../service");
const { response200, response400 } = require("../lib/response-messages");
const catchAsyncError = require("../middleware/catchAsyncError");
const { default: mongoose } = require("mongoose");

// get lesson calender for selected student
const fetchStuendtScheduleLessons = catchAsyncError(async (req, res) => {
  let { locations, studentId } = req.query;
  let query = {
    studentId: new mongoose.Types.ObjectId(studentId),
    isDeleted: false,
  };
  let user = await userService.checkUser({ _id: studentId });
  if (!user) return response400(res, "Student details not found");

  const currentDate = new Date();
  const oneYearAgoDate = new Date(currentDate);
  oneYearAgoDate.setFullYear(currentDate.getFullYear() - 1);
  oneYearAgoDate.setDate(oneYearAgoDate.getDate() - 1);

  if (locations && locations.length) {
    query.location = { $in: locations };
  }
  let data = await userService.scheduleLessons(query);
  return response200(res, "List fetch successfully.", data);
});

module.exports = {
  fetchStuendtScheduleLessons,
};
