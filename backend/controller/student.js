const {
  studentService,
  teacherService,
  userService,
  adminService,
} = require("../service");
const {
  response200,
  response400,
  response500,
  response201,
} = require("../lib/response-messages");
const catchAsyncError = require("../middleware/catchAsyncError");
const { default: mongoose } = require("mongoose");
const { isValidObjectId } = require("../config/mongoService");
const multer = require("multer");
const { uploadFile } = require("../lib/uploader/upload");
const { skill_history } = require("../utils/constants");
const { sendNotification } = require("../utils/pushFirebase");
const storage = multer.memoryStorage();
const upload = multer(storage);
const mongoService = require("../config/mongoService");

// get assigned skills list with  type wise filter
const getMySkills = catchAsyncError(async (req, res) => {
  let userId = req.user;
  const { sortKey, sortKeyOrder } = req.query;

  let sortQuery = { createdAt: -1 };
  if (sortKey && sortKeyOrder !== undefined) {
    sortQuery = { [sortKey]: parseInt(sortKeyOrder) };
  }

  const query = {
    studentId: new mongoose.Types.ObjectId(userId),
    is_deleted: false,
  };
  // const data = await studentService.mySkills(query, sortQuery, limit, offset, type);
  const data = await studentService.mySkills(query, sortQuery);

  return response200(res, "My Skill list loaded successfully.", data);
});

// get single skill details
const fetchSkillDetails = catchAsyncError(async (req, res) => {
  let userId = req.user;
  let { skillId } = req.params;
  if (!isValidObjectId(skillId))
    return response200(res, "Please enter valid skill id");

  // check skill
  const isSkillExits = await studentService.checkSkill({
    studentId: userId,
    skillId,
  });
  if (!isSkillExits) return response400(res, "Assign skill details not found");

  let data = await teacherService.skillDetails(skillId);
  return response200(res, "Data fetched successfully", data);
});

// student dashboard
const studentDashboard = catchAsyncError(async (req, res) => {
  let { userId } = req.params;

  const totalSkill = await studentService.skillCounts({
    studentId: userId,
    is_deleted: false,
  });

  const activeSkillsCount = await studentService.skillCounts({
    studentId: userId,
    is_active: true,
    is_completed: false,
    is_deleted: false,
  });

  const completedSkillsCount = await studentService.skillCounts({
    studentId: userId,
    is_active: true,
    is_completed: true,
    is_deleted: false,
  });
  const instruments = await studentService.fetchStudentInstruments(userId);

  const scheduleSkill = await studentService.skillCounts({
    studentId: userId,
    is_completed: false,
    is_deleted: false,
  });

  const statistics = {
    finishedSkill: completedSkillsCount,
    scheduleSkill,
  };

  const activeSkillPercentage =
    totalSkill > 0 ? ((activeSkillsCount / totalSkill) * 100).toFixed(2) : "0";

  const completedSkillPercentage =
    totalSkill > 0
      ? ((completedSkillsCount / totalSkill) * 100).toFixed(2)
      : "0";

  const response = {
    activeSkillsCount,
    completedSkillsCount,
    instruments,
    statistics,
    activeSkillPercentage,
    completedSkillPercentage,
  };
  return response200(res, "Data fetched successfully", response);
});

const addVirtualConsultation = catchAsyncError(async (req, res) => {
  let userId = req.user;
  const { date, startTime, endTime, day, colorCode, title } = req.body;

  const isScheduleBooked = await adminService.checkOption("Lessons", {
    type: "virtual",
    day,
    startTime,
    endTime,
  });
  if (isScheduleBooked)
    return response400(res, "Schedule is already booked during this time");

  const student = await studentService.fetchStudentDetails({
    _id: new mongoose.Types.ObjectId(userId),
  });

  let isExits = await adminService.checkOption("StudentLesson", {
    studentId: userId,
    date,
    startTime,
    endTime,
  });
  if (isExits)
    return response400(res, "Lesson is already assigned during this time");

  let isTeacherAvailable = await adminService.checkOption("StudentLesson", {
    teacherId: student?.studentTeacher[0]?.teacherId,
    date,
    startTime,
    endTime,
  });
  if (isTeacherAvailable)
    return response400(res, "Teacher is not available for this time duration");

  const lesson = await adminService.storeOption("Lessons", {
    title,
    colorCode,
    type: "virtual",
    meetLink: "test",
    startTime,
    endTime,
    day,
    teachers: [student?.studentTeacher[0]?.teacherId],
    addedBy: userId,
  });

  const assignLesson = await adminService.storeOption("StudentLesson", {
    lessonId: lesson?._id,
    studentId: userId,
    date,
    day: day,
    startTime: startTime,
    endTime: endTime,
    teachers: lesson.teachers,
    meetLink: lesson.meetLink,
  });

  let user = await userService.userDetailsForLogin({ _id: userId });
  user.isFirstLogin = true;
  await user.save();

  return response201(
    res,
    "Virtual consultation schedule successfully",
    assignLesson
  );
});

const getChildList = catchAsyncError(async (req, res) => {
  const userId = req.user;

  const getList = await studentService.getChildData({ parentId: userId });
  return response200(res, "fetched successfully", getList);
});

const skillResponseVideo = catchAsyncError(async (req, res) => {
  const userId = req.user;

  upload.fields([
    { name: "assignSkillId", maxCount: 1 },
    { name: "responseTitle", maxCount: 1 },
    { name: "studentResponseVideo" },
  ])(req, res, async (error) => {
    const { assignSkillId, responseTitle } = req.body;

    if (!responseTitle) return response400(res, "Response title is required");

    let assignSkill = await studentService.getAssignedSkill({
      _id: assignSkillId,
      is_deleted: false,
    });

    if (!assignSkill)
      return response400(res, "Assigned skill ID is not exists");

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes
    let invalidFiles = [];

    const fieldsToValidate = ["studentResponseVideo"];
    fieldsToValidate.forEach((field) => {
      if (req?.files?.[field]) {
        req.files[field].forEach((file) => {
          if (file.size > MAX_FILE_SIZE) {
            invalidFiles.push({
              field,
              filename: file.originalname,
              size: file.size,
            });
          }
        });
      }
    });

    if (invalidFiles.length) {
      return response400(
        res,
        `File size exceeds 10 MB for the following files. ${invalidFiles?.[0]?.field}`
      );
    }

    // personal tutorials image
    if (!req?.files?.studentResponseVideo?.length) {
      return response400(res, `Response video is required`);
    }

    const files = req.files.studentResponseVideo;
    await Promise.all(
      files.map(async (file) => {
        const result = await uploadFile(file);
        assignSkill.studentResponseVideo.push({
          url: result,
          title: responseTitle,
        });
      })
    );

    await assignSkill.save();

    // Stored skill history
    await studentService.storeHistory({
      teacherId: assignSkill.teacherId,
      studentId: userId,
      skillId: assignSkill.skillId,
      status: skill_history.submitted,
    });

    const teacher = await userService.checkUser({
      _id: assignSkill.teacherId,
      role: "teacher",
    });

    const student = await userService.checkUser({
      _id: userId,
      role: "student",
    });

    let message = {
      title: "Add Response Video",
      message: `${student.firstName} has uploaded response video.`,
    };
    if (teacher.fcm_token) {
      await sendNotification(message, [teacher.fcm_token]);
    }

    var notificationData = {
      userId: assignSkill.teacherId,
      message: message.message,
      title: message.title,
      redirect_url: "skills/create-skill",
      redirect_id: assignSkill.skillId,
      studentId: userId,
      firstName: student.firstName,
      lastName: student.lastName,
      assignedId: assignSkillId,
    };

    const saveNotification = await mongoService.createOne(
      "Notification",
      notificationData
    );

    return response200(res, "Response added successfully", []);
  });
});

const updateResponseVideo = catchAsyncError(async (req, res) => {
  const { title, assignSkillId, documentId, removeDocumentId } = req.body;

  const skillData = await adminService.checkOption("AssignSkill", {
    _id: assignSkillId,
  });
  if (!skillData) return response400(res, "Skill details not found");

  if (documentId) {
    if (skillData?.studentResponseVideo?.length) {
      await Promise.all(
        skillData?.studentResponseVideo?.map(async (doc) => {
          console.log("hello");
          if (doc?._id?.toString() === documentId.toString()) {
            doc.title = title;
          }
        })
      );
    }
  }

  if (removeDocumentId) {
    await teacherService.removeDocuments(
      [removeDocumentId],
      skillData,
      "studentResponseVideo"
    );
  }

  await skillData.save();
  return response200(res, "Title updated successfully.", []);
});

const getAssignedSkill = catchAsyncError(async (req, res) => {
  const { skillId } = req.params;
  const { teacherId, studentId } = req.query;

  let data = {};
  if (studentId) {
    data = await studentService.studentAssignedSkillDetails({
      skillId,
      studentId,
    });
  }
  // else if(teacherId){
  //   data = await studentService.teacherAssignedSkillDetails({teacherId})
  // }
  else {
    return response400(res, "Please enter valid Id");
  }

  return response200(res, "fetched successfully", data);
});

const getSkillHistory = catchAsyncError(async (req, res) => {
  const {
    studentId,
    parentId,
    teacherId,
    limit,
    offset,
    search,
    sortKey,
    sortOrder,
    status,
  } = req.body;

  let sortQuery = { createdAt: -1 };
  if (sortKey && sortOrder !== undefined) {
    sortQuery = { [sortKey]: parseInt(sortOrder) };
  }

  let historyData = [];
  if (studentId) {
    historyData = await studentService.getStudentSkillHistory({
      studentId,
      limit,
      offset,
      search,
      sortQuery,
      status,
    });
  } else if (teacherId) {
    historyData = await studentService.getTeacherSkillHistory({
      teacherId,
      limit,
      offset,
      search,
      sortQuery,
      status,
    });
  }

  return response200(res, "fetched successfully", historyData);
});

const updateAssignedSkillStatus = catchAsyncError(async (req, res) => {
  const userId = req.user;
  const { assignedId, status } = req.body;

  const skillData = await adminService.checkOption("AssignSkill", {
    _id: assignedId,
  });
  if (!skillData) return response400(res, "Skill details not found");

  if (status) {
    skillData.status = status;
    await studentService.storeHistory({
      teacherId: skillData.teacherId,
      studentId: userId,
      skillId: skillData?.skillId,
      status: skill_history.submitted,
    });
  }
  await skillData.save();

  return response200(res, "Status changed successfully");
});

const parentDashboard = catchAsyncError(async (req, res) => {
  const userId = req.user;
  const { limit, offset, search, sortKey, sortOrder } = req.body;

  let sortQuery = { createdAt: -1 };
  if (sortKey && sortOrder !== undefined) {
    sortQuery = { [sortKey]: parseInt(sortOrder) };
  }

  const historyData = await studentService.getParentSkillHistory({
    parentId: userId,
    limit,
    offset,
    search,
    sortQuery,
  });

  const skillCount = await studentService.getChildSkillsCount({
    parentId: userId,
  });

  const data = {
    totalSkills: skillCount,
    totalLessonCompleted: 0,
    progressOverview: 0,
    skillCompletionRate: 0,
    history: historyData,
  };

  return response200(res, "Fetched successfully", data);
});

module.exports = {
  getMySkills,
  fetchSkillDetails,
  studentDashboard,
  addVirtualConsultation,
  getChildList,
  skillResponseVideo,
  updateResponseVideo,
  getAssignedSkill,
  getSkillHistory,
  updateAssignedSkillStatus,
  parentDashboard,
};
