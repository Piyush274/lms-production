const router = require("express").Router();
const { adminController, optionController } = require("../controller");
const { isAuthenticated, isAuthenticatedUser } = require("../middleware/auth");
const { validateRequest, adminValidation } = require("../utils/validations");
const j2s = require("joi-to-swagger");

router
  // Dashboard
  .get(
    "/dashboard",
    // isAuthenticated,
    // isAuthenticatedUser("admin"),
    adminController.getDashboard
  )
  // locations
  .post(
    "/location",
    /*
        #swagger.tags = ['Admin location']
        #swagger.summary = 'add-location'
        #swagger.responses[200] = { description: 'Successful' }
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    validateRequest(adminValidation.addOptionValidator),
    adminController.addLocation
  )
  .put(
    "/location",
    /*
        #swagger.tags = ['Admin location']
        #swagger.summary = 'update-location'
        #swagger.responses[200] = { description: 'Successful' }
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    validateRequest(adminValidation.updateLocationValidator),
    adminController.updateLocation
  )
  .post(
    "/location/delete",
    /*
        #swagger.tags = ['Admin location']
        #swagger.summary = delete-location'
        #swagger.responses[200] = {description: 'Successful'}
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    adminController.deleteLocation
  )

  // category
  .post(
    "/category",
    /*
        #swagger.tags = ['Admin category']
        #swagger.summary = 'add-category'
        #swagger.responses[200] = { description: 'Successful' }
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    validateRequest(adminValidation.addOptionValidator),
    adminController.addCategory
  )
  .put(
    "/category",
    /*
        #swagger.tags = ['Admin category']
        #swagger.summary = 'update-category'
        #swagger.responses[200] = { description: 'Successful' }
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    validateRequest(adminValidation.updateOptionValidator),
    adminController.updateCategory
  )
  .delete(
    "/category/:categoryId",
    /*
         #swagger.tags = ['Admin category']
         #swagger.summary = delete-location'
         #swagger.responses[200] = {description: 'Successful'}
         */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    adminController.deleteCategory
  )

  // instrument
  .post(
    "/instrument",
    /*
        #swagger.tags = ['Admin instrument']
        #swagger.summary = 'add-instrument'
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['name'] = {in: 'formData',required: true, type: 'string'}
        #swagger.parameters['instrumentImage'] = {in: 'formData',type: 'file'}
        #swagger.requestBody = null
        #swagger.responses[200] = {description: 'Successful'}
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    adminController.addInstrument
  )
  .put(
    "/instrument",
    /*
        #swagger.tags = ['Admin instrument']
        #swagger.summary = 'update-instrument'
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['id'] = {in: 'formData',required: true, type: 'string'}
        #swagger.parameters['name'] = {in: 'formData',required: true, type: 'string'}
        #swagger.parameters['instrumentImage'] = {in: 'formData',type: 'file'}
        #swagger.requestBody = null
        #swagger.responses[200] = {description: 'Successful'}
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    adminController.updateInstrument
  )
  .delete(
    "/instrument/:instrumentId",
    /*
        #swagger.tags = ['Admin instrument']
        #swagger.summary = delete-instrument'
        #swagger.responses[200] = {description: 'Successful'}
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    adminController.deleteInstrument
  )

  // plan
  .post(
    "/plan",
    /*
        #swagger.tags = ['Admin plan']
        #swagger.summary = 'add-plan'
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['title'] = {in: 'formData',required: true, type: 'string'}
        #swagger.parameters['description'] = {in: 'formData',required: true, type: 'string'}
        #swagger.parameters['price'] = {in: 'formData',required: true, type: 'string'}
        #swagger.parameters['isPopular'] = {in: 'formData',required: true, type: 'boolean'}
        #swagger.parameters['keyPoints'] = {in: 'formData',type: 'array',items: { type: 'string' },collectionFormat:'multi'}
        #swagger.parameters['planImage'] = {in: 'formData',type: 'file'}
        #swagger.requestBody = null
        #swagger.responses[200] = {description: 'Successful'}
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    adminController.addPlan
  )
  .put(
    "/plan",
    /*
        #swagger.tags = ['Admin plan']
        #swagger.summary = 'update-plan'
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['id'] = {in: 'formData',required: true, type: 'string'}
        #swagger.parameters['title'] = {in: 'formData',required: true, type: 'string'}
        #swagger.parameters['description'] = {in: 'formData',required: true, type: 'string'}
        #swagger.parameters['price'] = {in: 'formData',required: true, type: 'string'}
        #swagger.parameters['isPopular'] = {in: 'formData',required: true, type: 'boolean'}
        #swagger.parameters['keyPoints'] = {in: 'formData',type: 'array',items: { type: 'string' },collectionFormat:'multi'}
        #swagger.parameters['planImage'] = {in: 'formData',type: 'file'}
        #swagger.requestBody = null
        #swagger.responses[200] = {description: 'Successful'}
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    adminController.updatePlan
  )
  .delete(
    "/plan/:planId",
    /*
        #swagger.tags = ['Admin plan']
        #swagger.summary = delete-plan'
        #swagger.responses[200] = {description: 'Successful'}
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    adminController.deletePlan
  )

  // users
  .post(
    "/register-user",
    /*
        #swagger.tags = ['Admin User']
        #swagger.summary = 'register-user'
        #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: { $ref: '#/components/schemas/registerUserSwaggerSchema' }
        }
        #swagger.responses[200] = { description: 'Successful' }
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    validateRequest(adminValidation.registerUserValidator),
    adminController.addUser
  )
  .post(
    "/plan-payment",
    /*
        #swagger.tags = ['Admin User']
        #swagger.summary = 'plan-payment'
        #swagger.responses[200] = { description: 'Successful' }
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    validateRequest(adminValidation.planPaymentValidator),
    adminController.planPayment
  )
  .post(
    "/users-list",
    /*
        #swagger.tags = ['Admin User']
        #swagger.summary = 'user-list'
        #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: { $ref: '#/components/schemas/userListSwaggerSchema' }
        }
        #swagger.responses[200] = { description: 'Successful' }
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    adminController.getAllUsers
  )
  .put(
    "/update-user",
    /*
        #swagger.tags = ['Admin User']
        #swagger.summary = 'update-user'
        #swagger.responses[200] = { description: 'Successful' }
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    validateRequest(adminValidation.updateUserValidator),
    adminController.updateUser
  )
  .get(
    "/user/:userId",
    /*
        #swagger.tags = ['Admin User']
        #swagger.summary = 'get-user'
        #swagger.responses[200] = {description: 'Successful'}
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    adminController.getSingleUserDetails
  )
  .delete(
    "/user/:userId",
    /*
        #swagger.tags = ['Admin User']
        #swagger.summary = 'delete-user'
        #swagger.responses[200] = {description: 'Successful'}
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    adminController.deleteUser
  )

  // lesson
  .post(
    "/lesson",
    /*
        #swagger.tags = ['Admin Lesson']
        #swagger.summary = 'add-lesson'
        #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: { $ref: '#/components/schemas/addLessonSwaggerSchema' }
        }
        #swagger.responses[200] = { description: 'Successful' }
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    validateRequest(adminValidation.addLessonValidator),
    adminController.addLesson
  )
  .put(
    "/lesson",
    /*
        #swagger.tags = ['Admin Lesson']
        #swagger.summary = 'update-lesson'
        #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: { $ref: '#/components/schemas/updateLessonSwaggerSchema' }
        }
        #swagger.responses[200] = { description: 'Successful' }
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    validateRequest(adminValidation.updateLessonValidator),
    adminController.updateLesson
  )
  .get(
    "/lesson",
    /*
        #swagger.tags = ['Admin Lesson']
        #swagger.summary = 'all-lessons'
        #swagger.responses[200] = {description: 'Successful'}
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    adminController.getLessonList
  )
  .delete(
    "/lesson/:lessonId",
    /*
        #swagger.tags = ['Admin Lesson']
        #swagger.summary = 'delete-lesson'
        #swagger.responses[200] = {description: 'Successful'}
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    adminController.deleteLesson
  )
  .get(
    "/lesson-wise-students",
    /*
        #swagger.tags = ['Admin Lesson']
        #swagger.summary = 'lesson-wise-students'
        #swagger.responses[200] = {description: 'Successful'}
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    adminController.lessonWiseStudentList
  )

  // student lesson
  .post(
    "/assign-lesson",
    /*
        #swagger.tags = ['Admin Student Lesson']
        #swagger.summary = 'assign-lesson'
        #swagger.responses[200] = { description: 'Successful' }
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    validateRequest(adminValidation.assignLessonValidator),
    adminController.assignLesson
  )
  .put(
    "/assign-lesson",
    /*
        #swagger.tags = ['Admin Student Lesson']
        #swagger.summary = 'update-assign-lesson'
        #swagger.responses[200] = { description: 'Successful' }
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    adminController.updateAssignLesson
  )
  .delete(
    "/student-lesson/:studentLessonId",
    /*
        #swagger.tags = ['Admin Student Lesson']
        #swagger.summary = 'delete-student-lesson'
        #swagger.responses[200] = {description: 'Successful'}
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    adminController.deleteAssignLesson
  )
  .post(
    "/schedule-lessons",
    /*
        #swagger.tags = ['Admin Student Lesson']
        #swagger.summary = 'schedule-lessons'
        #swagger.responses[200] = {description: 'Successful'}
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    adminController.fetchScheduleLessonList
  )

  .get(
    "/filter-teachers",
    isAuthenticated,
    isAuthenticatedUser("admin"),
    adminController.getFilterTeacher
  )
  .get(
    "/location-teachers/:location",
    isAuthenticated,
    isAuthenticatedUser("admin"),
    adminController.getLocationTeacher
  )  
  .get(
    "/schedule-lessons-details/:studentLessonId",
    /*
        #swagger.tags = ['Admin Student Lesson']
        #swagger.summary = 'schedule-lessons-details'
        #swagger.responses[200] = {description: 'Successful'}
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    adminController.assignLessonDetails
  )
  .post(
    "/reschedule-lesson",
    /*
        #swagger.tags = ['Admin Student Lesson']
        #swagger.summary = 'reschedule-lesson'
        #swagger.responses[200] = {description: 'Successful'}
        */
    isAuthenticated,
    isAuthenticatedUser("admin"),
    optionController.rescheduleLesson
  )

  .get(
    "/get-consultation",
    isAuthenticated,
    isAuthenticatedUser("admin"),
    adminController.getVirtualConsultations
  )

  .get(
    "/teacher-students/:teacherId",
    isAuthenticated,
    adminController.getTeachersActiveStudent
  )

  .post(
    "/add-action-take",
    /*
        #swagger.tags = ['Admin Student Lesson']
        #swagger.summary = 'reschedule-lesson'
        #swagger.responses[200] = {description: 'Successful'}
        */
    isAuthenticated,
    // isAuthenticatedUser("admin"),
    adminController.addActionTake
  )
  
  .get(
    "/get-action-take/:studentId",
    /*
        #swagger.tags = ['Admin Student Lesson']
        #swagger.summary = 'reschedule-lesson'
        #swagger.responses[200] = {description: 'Successful'}
        */
    isAuthenticated,
    // isAuthenticatedUser("admin"),
    adminController.getAllAction
  )

  .post(
    "/add-out-reach",
    /*
        #swagger.tags = ['Admin Student Lesson']
        #swagger.summary = 'reschedule-lesson'
        #swagger.responses[200] = {description: 'Successful'}
        */
    isAuthenticated,
    // isAuthenticatedUser("admin"),
    adminController.addOutReach
  )
  
  .get(
    "/get-out-reach/:studentId",
    /*
        #swagger.tags = ['Admin Student Lesson']
        #swagger.summary = 'reschedule-lesson'
        #swagger.responses[200] = {description: 'Successful'}
        */
    isAuthenticated,
    // isAuthenticatedUser("admin"),
    adminController.getAllOutReach
  )

  .post(
    "/add-performance",
    /*
        #swagger.tags = ['Admin Student Lesson']
        #swagger.summary = 'reschedule-lesson'
        #swagger.responses[200] = {description: 'Successful'}
        */
    isAuthenticated,
    // isAuthenticatedUser("admin"),
    adminController.addPerformance
  )
  
  .get(
    "/get-performance/:studentId",
    /*
        #swagger.tags = ['Admin Student Lesson']
        #swagger.summary = 'reschedule-lesson'
        #swagger.responses[200] = {description: 'Successful'}
        */
    isAuthenticated,
    // isAuthenticatedUser("admin"),
    adminController.getPerformance
  )
  
  .post(
    "/add-inst-assessment",
    /*
        #swagger.tags = ['Admin Student Lesson']
        #swagger.summary = 'reschedule-lesson'
        #swagger.responses[200] = {description: 'Successful'}
        */
    isAuthenticated,
    // isAuthenticatedUser("admin"),
    adminController.addInstAssessment
  )
  
  .get(
    "/get-inst-assessment/:studentId",
    /*
        #swagger.tags = ['Admin Student Lesson']
        #swagger.summary = 'reschedule-lesson'
        #swagger.responses[200] = {description: 'Successful'}
        */
    isAuthenticated,
    // isAuthenticatedUser("admin"),
    adminController.getInstAssessment
  );


module.exports = router;
module.exports.adminSwaggerRoutes = (swaggerDoc) => {
  swaggerDoc.components.schemas.userListSwaggerSchema = j2s(
    adminValidation.fetchUserValidator
  ).swagger;
  swaggerDoc.components.schemas.addLessonSwaggerSchema = j2s(
    adminValidation.addLessonValidator
  ).swagger;
  swaggerDoc.components.schemas.updateLessonSwaggerSchema = j2s(
    adminValidation.updateLessonValidator
  ).swagger;
  swaggerDoc.components.schemas.registerUserSwaggerSchema = j2s(
    adminValidation.registerUserValidator
  ).swagger;
};
