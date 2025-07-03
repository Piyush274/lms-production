const router = require("express").Router();
const { optionController, studentController } = require("../controller");
const { isAuthenticated, isAuthenticatedUser } = require("../middleware/auth");
const { validateRequest, teacherValidation } = require("../utils/validations");

router
  // students
  .get(
    "/schedule-lessons",
    isAuthenticated,
    isAuthenticatedUser("student"),
    optionController.fetchScheduleLessons
  )
  .get(
    "/lesson-details/:studentLessonId",
    isAuthenticated,
    isAuthenticatedUser("student"),
    optionController.lessonDetails
  )
  .post(
    "/confirmed-present",
    isAuthenticated,
    isAuthenticatedUser("student"),
    optionController.confirmedPresent
  )
  .post(
    "/reschedule-lesson",
    isAuthenticated,
    isAuthenticatedUser("student"),
    optionController.rescheduleLesson
  )
  //skills
  .get(
    "/my-skills",
    isAuthenticated,
    isAuthenticatedUser("student"),
    studentController.getMySkills
  )
  .get(
    "/skill/:skillId",
    isAuthenticated,
    isAuthenticatedUser("student"),
    studentController.fetchSkillDetails
  )
  .get(
    "/dashboard/:userId",
    isAuthenticated,
    studentController.studentDashboard
  )
  .get(
    "/assigns-skill-details/:skillId",
    isAuthenticated,
    studentController.getAssignedSkill
  )
  .post(
    "/response-video",
    isAuthenticated,
    isAuthenticatedUser("student"),
    studentController.skillResponseVideo
  )
  .put(
    "/update-response-video",
    isAuthenticated,
    isAuthenticatedUser("student"),
    validateRequest(teacherValidation.assignedTitleUpdateValidator),
    studentController.updateResponseVideo
  )
  .put(
    "/change-assigned-skill",
    isAuthenticated,
    isAuthenticatedUser("student"),
    validateRequest(teacherValidation.updatedAssignedValidator),
    studentController.updateAssignedSkillStatus
  )
  .post(
    "/skill-history",
    isAuthenticated,
    validateRequest(teacherValidation.getHistoryValidator),
    studentController.getSkillHistory
  )
  // virtual consultation
  .post(
    "/add-consultation",
    isAuthenticated,
    isAuthenticatedUser("student"),
    validateRequest(teacherValidation.addVirtualConsultationValidator),
    studentController.addVirtualConsultation
  )

  // Parent
  .get(
    "/get-my-child-list",
    isAuthenticated,
    isAuthenticatedUser("parent"),
    studentController.getChildList
  )

  .post(
    "/parent-dashboard",
    isAuthenticated,
    isAuthenticatedUser("parent"),
    validateRequest(teacherValidation.getHistoryValidator),
    studentController.parentDashboard
  );

module.exports = router;
