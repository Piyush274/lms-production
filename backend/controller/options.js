const {
  userService,
  adminService,
  teacherService,
  studentService,
} = require("../service");
const { response200, response400 } = require("../lib/response-messages");
const catchAsyncError = require("../middleware/catchAsyncError");
const { isValidObjectId } = require("../config/mongoService");

// get lesson calender for teacher ,student and admin
const fetchScheduleLessons = catchAsyncError(async (req, res) => {
  let userId = req.user;
  let { startDate, endDate, instructors, locations } = req.query;
  let query = { isDeleted: false };
  let user = await userService.checkUser({ _id: userId });

  const currentDate = new Date();
  const oneYearAgoDate = new Date(currentDate);
  oneYearAgoDate.setFullYear(currentDate.getFullYear() - 1);
  oneYearAgoDate.setDate(oneYearAgoDate.getDate() - 1);
  // query.date = { $gte: oneYearAgoDate.toISOString() };

  if (user.role === "student") query.studentId = userId;
  if (user.role === "teacher") query.teachers = userId;

  // if (startDate && endDate) {
  //   query.date = { $gte: startDate, $lte: endDate };
  // }

  if (instructors && instructors.length) {
    query.teachers = { $in: instructors };
  }

  if (locations && locations.length) {
    query.location = { $in: locations };
  }
  let data = await userService.scheduleLessons(query);
  console.log("✌️data --->", data);
  return response200(res, "List fetch successfully.", data);
});

// schedule lesson details
const lessonDetails = catchAsyncError(async (req, res) => {
  let { studentLessonId } = req.params;
  if (!isValidObjectId(studentLessonId))
    return response400(res, "Please enter valid studentLessonId");

  let data = await userService.scheduleLessonDetails(studentLessonId);

  return response200(res, "List fetch successfully.", data);
});

// confirmed lesson present
const confirmedPresent = catchAsyncError(async (req, res) => {
  const userId = req.user;
  const { studentLessonId } = req.body;

  if (!studentLessonId)
    return response400(res, "The 'studentLessonId' is required.");
  if (!isValidObjectId(studentLessonId))
    return response400(res, "Please enter valid studentLessonId");

  const user = await userService.checkUser({ _id: userId });
  const { role } = user;

  const query = { isDeleted: false, _id: studentLessonId };
  if (role === "student") query.studentId = userId;
  if (role === "teacher") query.teachers = userId;

  const lesson = await adminService.checkOption("StudentLesson", query);
  if (!lesson) return response400(res, "Lesson details not found.");

  if (!userService.dateValidation(lesson.date))
    return response400(
      res,
      "Presence can only be confirmed on the day of the lesson."
    );
  if (role === "student") lesson.studentPresent = true;
  if (role === "teacher") lesson.teacherPresent = true;

  await lesson.save();
  return response200(res, "Presence confirmed successfully.", []);
});

//reschedule lesson
const rescheduleLesson = catchAsyncError(async (req, res) => {
  let userId = req.user;
  let { studentLessonId, date, startTime, endTime } = req.body;

  if (!studentLessonId) return response400(res, "studentLessonId is required");
  if (!isValidObjectId(studentLessonId))
    return response400(res, "Please enter valid student lesson id");

  let user = await userService.checkUser({ _id: userId });
  let { role } = user;

  let query = { isDeleted: false, _id: studentLessonId };

  if (role === "student") query.studentId = userId;
  if (role === "teacher") query.teachers = userId;

  let studentLesson = await adminService.checkOption("StudentLesson", query);
  if (!studentLesson)
    return response400(res, "Student lesson details not found.");

  // Check if the student already has a lesson scheduled during the same date and time
  let studentLessonExits = await adminService.checkOption("StudentLesson", {
    studentId: studentLesson.studentId,
    date,
    startTime,
    endTime,
    _id: { $ne: studentLessonId },
  });
  if (studentLessonExits)
    return response400(
      res,
      "The student already has a lesson scheduled during this time."
    );

  // Check if any of the teachers already have a lesson scheduled during the same date and time
  let teacherLessonExits = await adminService.checkOption("StudentLesson", {
    teachers: { $in: studentLesson.teachers },
    date,
    startTime,
    endTime,
    _id: { $ne: studentLessonId },
  });
  if (teacherLessonExits)
    return response400(
      res,
      "Teachers already have a lesson scheduled during this time"
    );

  studentLesson.date = date;
  studentLesson.startTime = startTime;
  studentLesson.endTime = endTime;
  studentLesson.isReschedule = true;
  studentLesson.rescheduleBy = userId;
  await studentLesson.save();
  return response200(res, "Lesson rescheduled successfully.", []);
});

//fetch location base teacher
const fetchLocationBaseTeacher = catchAsyncError(async (req, res) => {
  const data = await teacherService.teacherList(req.query);

  return response200(res, "Teacher list loaded successfully.", data);
});

module.exports = {
  fetchScheduleLessons,
  lessonDetails,
  confirmedPresent,
  rescheduleLesson,
  fetchLocationBaseTeacher,
};
