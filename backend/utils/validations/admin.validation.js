const Joi = require("joi");

const registerUserValidator = Joi.object({
  type: Joi.string().valid("student", "teacher").required().messages({
    "any.only": "type must be either 'student' or 'teacher'",
    "*": "type is required",
  }),
  email: Joi.string().required().messages({
    "*": "email is required",
  }),
  password: Joi.string().required().messages({
    "*": "password is required",
  }),
  phoneNumber: Joi.string().required().messages({
    "*": "phoneNumber is required",
  }),
  location: Joi.string().required().messages({
    "*": "location is required",
  }),
  firstName: Joi.string().optional(),
  lastName: Joi.string().required().messages({
    "*": "lastName is required",
  }),
  teacherId: Joi.string()
    .optional()
    .allow("")
    .when("type", {
      is: "student",
      then: Joi.required().messages({
        "any.required": "teacher id is required",
      }),
      otherwise: Joi.optional().allow(""),
    }),
  selectedPlan: Joi.string()
    .optional()
    .allow("")
    .when("type", {
      is: "student",
      then: Joi.required().messages({ "any.required": "Plan is required" }),
      otherwise: Joi.optional().allow(""),
    }),
  date_of_birth: Joi.date().optional().allow(""),
  parentFirstName: Joi.string().optional(),
  parentLastName: Joi.string().optional(),
  parentNumber: Joi.number().optional(),
  parentEmail: Joi.string().optional(),
  parentPassword: Joi.string().optional(),
  relation: Joi.string().optional().allow(""),
  // age: Joi.number()
  //     .optional()
  //     .allow("")
  //     .when('type', {
  //         is: "student",
  //         then: Joi.required().messages({ "any.required": "age is required for students" }),
  //         otherwise: Joi.optional().allow(""),
  //     }),
  // parentName: Joi.string().optional().allow("").when('age', {
  //     is: Joi.number().less(17),
  //     then: Joi.required(),
  // }),
  // parentNumber: Joi.number().optional().allow("").when('age', {
  //     is: Joi.number().less(17),
  //     then: Joi.required(),
  // }),
  // relation: Joi.string().optional().allow("").when('age', {
  //     is: Joi.number().less(17),
  //     then: Joi.required(),
  // }),
});
const fetchUserValidator = Joi.object({
  limit: Joi.string().optional().allow(""),
  offset: Joi.string().optional().allow(""),
  search: Joi.string().optional().allow(""),
  role: Joi.string().optional().allow(""),
  order: Joi.string().optional().allow(""),
});

const updateUserValidator = Joi.object({
  type: Joi.string().valid("student", "teacher").required().messages({
    "any.only": "type must be either 'student' or 'teacher'",
    "*": "type is required",
  }),
  userId: Joi.string().required().messages({
    "*": "userId is required",
  }),
  email: Joi.string().required().messages({
    "*": "email is required",
  }),
  phoneNumber: Joi.string().required().messages({
    "*": "phoneNumber is required",
  }),
  location: Joi.string().required().messages({
    "*": "location is required",
  }),
  firstName: Joi.string().required().messages({
    "*": "firstName is required",
  }),
  lastName: Joi.string().required().messages({
    "*": "lastName is required",
  }),
  selectedPlan: Joi.string().optional().allow(""),
  date_of_birth: Joi.date().optional().allow(""),
  parentId: Joi.string().optional(),
  parentFirstName: Joi.string().optional(),
  parentLastName: Joi.string().optional(),
  parentNumber: Joi.number().optional(),
  parentEmail: Joi.string().optional(),
  // parentName:Joi.string().optional().allow(""),
  // parentNumber:Joi.number().optional().allow(""),
  relation: Joi.string().optional().allow(""),
  // age: Joi.number()
  //     .optional()
  //     .allow("")
  //     .when('type', {
  //         is: "student",
  //         then: Joi.required().messages({ "any.required": "age is required for students" }),
  //         otherwise: Joi.optional().allow(""),
  //     }),
  // parentName: Joi.string().optional().allow("").when('age', {
  //     is: Joi.number().less(17),
  //     then: Joi.required(),
  // }),
  // parentNumber: Joi.number().optional().allow("").when('age', {
  //     is: Joi.number().less(17),
  //     then: Joi.required(),
  // }),
  // relation: Joi.string().optional().allow("").when('age', {
  //     is: Joi.number().less(17),
  //     then: Joi.required(),
  // }),
  teachers: Joi.string().allow(""),
});

const addPlanValidator = [
  "title",
  "description",
  "price",
  "keyPoints",
  "isPopular",
  "location",
  "lessonPerWeek",
];

const addLessonValidator = Joi.object({
  title: Joi.string().required().messages({
    "*": "title is required",
  }),
  colorCode: Joi.string().required().messages({
    "*": "colorCode is required",
  }),
  type: Joi.string().valid("virtual", "on_location").required().messages({
    "any.only": "type must be either 'virtual' or 'on_location'",
    "*": "type is required",
  }),
  location: Joi.string()
    .when("type", {
      is: "on_location",
      then: Joi.required(),
      otherwise: Joi.optional().allow(""),
    })
    .messages({
      "*": "location is required.",
    }),
  meetLink: Joi.string()
    .when("type", {
      is: "virtual",
      then: Joi.required(),
      otherwise: Joi.optional().allow(""),
    })
    .messages({
      "*": "meetLink is required.",
    }),
  startTime: Joi.string().required().messages({
    "*": "startTime is required",
  }),
  endTime: Joi.string().required().messages({
    "*": "endTime is required",
  }),
  day: Joi.string().required().messages({
    "*": "day is required",
  }),
  teachers: Joi.array().min(1).required().messages({
    "array.base": "teachers must be an array.",
    "array.empty": "teachers array must not be empty.",
  }),
  description: Joi.string().optional().allow(""),
});

const updateLessonValidator = Joi.object({
  id: Joi.string().required().messages({
    "*": "Lesson id is required",
  }),
  title: Joi.string().required().messages({
    "*": "title is required",
  }),
  colorCode: Joi.string().required().messages({
    "*": "colorCode is required",
  }),
  type: Joi.string().valid("virtual", "on_location").required().messages({
    "any.only": "type must be either 'virtual' or 'on_location'",
    "*": "type is required",
  }),
  location: Joi.string()
    .when("type", {
      is: "on_location",
      then: Joi.required(),
      otherwise: Joi.optional().allow(""),
    })
    .messages({
      "*": "location is required.",
    }),
  meetLink: Joi.string()
    .when("type", {
      is: "virtual",
      then: Joi.required(),
      otherwise: Joi.optional().allow(""),
    })
    .messages({
      "*": "meetLink is required.",
    }),
  startTime: Joi.string().required().messages({
    "*": "startTime is required",
  }),
  endTime: Joi.string().required().messages({
    "*": "endTime is required",
  }),
  day: Joi.string().required().messages({
    "*": "day is required",
  }),
  teachers: Joi.array().min(1).required().messages({
    "array.base": "teachers must be an array.",
    "array.empty": "teachers array must not be empty.",
  }),
  description: Joi.string().optional().allow(""),
});

const assignLessonValidator = Joi.object({
  lessonId: Joi.string().required().messages({
    "*": "lessonId is required",
  }),
  studentId: Joi.string().required().messages({
    "*": "studentId is required",
  }),
  date: Joi.string().required().messages({
    "*": "date is required",
  }),
  appointmentNote: Joi.string().optional().allow(""),
  clientNote: Joi.string().optional().allow(""),
});

const planPaymentValidator = Joi.object({
  userId: Joi.string().required().messages({
    "*": "userId is required",
  }),
  planId: Joi.string().required().messages({
    "*": "planId is required",
  }),
  // paymentStatus: Joi.string().required().valid("completed","failed"),
  cardNumber: Joi.string().required().messages({
    "*": "cardNumber is required",
  }),
  ExpirationDate: Joi.string().required().messages({
    "*": "ExpirationDate is required",
  }),
  cvv: Joi.string().required().messages({
    "*": "cvv is required",
  }),
});

const addOptionValidator = Joi.object({
  name: Joi.string().required().messages({
    "*": "name is required",
  }),
  authorizeLoginId: Joi.string().required().messages({
    "*": "Authorize Login Id is required",
  }),
  authorizeTransactionKey: Joi.string().required().messages({
    "*": "Authorize Transaction key is required",
  }),
});

const updateOptionValidator = Joi.object({
  id: Joi.string().required().messages({
    "*": "id is required",
  }),
  name: Joi.string().required().messages({
    "*": "name is required",
  }),
});

const updateLocationValidator = Joi.object({
  id: Joi.string().required().messages({
    "*": "id is required",
  }),
  name: Joi.string().required().messages({
    "*": "name is required",
  }),
  authorizeLoginId: Joi.string().required().messages({
    "*": "Authorize Login Id is required",
  }),
  authorizeTransactionKey: Joi.string().required().messages({
    "*": "Authorize Transaction key is required",
  }),
});

module.exports = {
  registerUserValidator,
  addPlanValidator,
  addLessonValidator,
  updateLessonValidator,
  assignLessonValidator,
  fetchUserValidator,
  updateUserValidator,
  planPaymentValidator,
  addOptionValidator,
  updateOptionValidator,
  updateLocationValidator,
};
