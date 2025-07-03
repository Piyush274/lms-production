const router = require("express").Router();
const { teacherController, optionController } = require("../controller");
const { isAuthenticated, isAuthenticatedUser } = require("../middleware/auth");
const { validateRequest, teacherValidation } = require("../utils/validations");

router
  // students
  .get(
    "/student/:studentId",
    isAuthenticated,
    teacherController.getStudentInformation
  )
  .get(
    "/student-report/:studentId",
    isAuthenticated,
    teacherController.getStudentReportDetails
  )
  .put(
    "/edit-student",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    validateRequest(teacherValidation.editStudentValidator),
    teacherController.updateStudent
  )
  .post(
    "/add-student",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    teacherController.addStudent
  )
  .post(
    "/all-students",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    teacherController.getAllStudents
  )
  .post(
    "/my-students",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    teacherController.getMyStudents
  )
  .post(
    "/deleted-students",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    teacherController.getDeletedStudents
  )
  .post(
    "/remove-student",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    teacherController.removeStudent
  )
  .post(
    "/unarchive-student",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    teacherController.unArchivedStudent
  )
  .post(
    "/unfollow-student",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    teacherController.unFollowStudent
  )
  .get(
    "/student-details/:studentId",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    teacherController.getStudentDetails
  )

  // lesson
  .get(
    "/schedule-lessons",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    optionController.fetchScheduleLessons
  )
  .get(
    "/lesson-details/:studentLessonId",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    optionController.lessonDetails
  )
  .post(
    "/confirmed-present",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    optionController.confirmedPresent
  )
  .post(
    "/student-present",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    teacherController.studentPresent
  )
  .post(
    "/reschedule-lesson",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    optionController.rescheduleLesson
  )

  // skills
  .post(
    "/new-skill",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    teacherController.newSkill
  )
  .post(
    "/create-skill",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    teacherController.addSkill
  )
  .put(
    "/update-skill",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    teacherController.updateSkill
  )
  .put(
    "/remove-teacher-skill",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    teacherController.removeTeacherSkill
  )
  .get(
    "/skill-details/:skillId",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    teacherController.getSkillDetails
  )
  .put(
    "/update-document-title",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    validateRequest(teacherValidation.titleUpdateValidator),
    teacherController.updateDocumentTitle
  )
  .post(
    "/manage-external-video",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    validateRequest(teacherValidation.externalVideoValidator),
    teacherController.manageExternalVideos
  )
  .post(
    "/get-all-skills",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    validateRequest(teacherValidation.getSkillValidator),
    teacherController.getAllSkills
  )
  .post(
    "/get-my-skills",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    validateRequest(teacherValidation.getSkillValidator),
    teacherController.getMySkills
  )
  .post(
    "/get-archived-skills",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    validateRequest(teacherValidation.getSkillValidator),
    teacherController.getDeletedSkills
  )
  .delete(
    "/remove-skill/:skillId",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    teacherController.removeSkill
  )

  .post(
    "/assign-skill",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    validateRequest(teacherValidation.assignedSkillValidator),
    teacherController.assignedSkillToStudent
  )

  // -----
  // .put("/assign-skill", isAuthenticated, isAuthenticatedUser("teacher"), validateRequest(teacherValidation.assignedSkillValidator), teacherController.updateSkillToStudent)

  .get(
    "/skill-templates/:studentId",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    teacherController.getSkillTemplates
  )

  .get(
    "/get-assigned-skill/:studentId",
    isAuthenticated,
    // isAuthenticatedUser("teacher"),
    teacherController.getAssignedSkills
  )

  // Update Assigned Skill
  .put(
    "/update-assigned-skill",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    validateRequest(teacherValidation.updatedAssignedValidator),
    teacherController.updateAssignedSkills
  )

  .post(
    "/mark-attendance",
    isAuthenticated,
    // isAuthenticatedUser(["teacher","student"]),
    teacherController.markAttandace
  )

  .put(
    "/update-assigned-skill-videocall",
    isAuthenticated,
    teacherController.updateAssignedSkillsVideoCall
  )


  .get(
    "/get-assigned-skill-vc",
    isAuthenticated,
    teacherController.getAssignedSkillsVideoCall
  )




  .post(
    "/copy-skill",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    teacherController.copySkill
  )
  .post(
    "/add-meet-link",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    validateRequest(teacherValidation.addMeetLinkValidator),
    teacherController.addMeetingLink
  )

  // Dashboard
  .get(
    "/dashboard",
    isAuthenticated,
    isAuthenticatedUser("teacher"),
    teacherController.teacherDashboard
  );

module.exports = router;
