const Joi = require("joi");
const { document_type, skill_history } = require("../constants");

const addSkillValidator = ["title", "instrument"];

const updateSkillValidator = ["skillId", "title", "instrument"];

const titleUpdateValidator = Joi.object({
  title: Joi.string().required().messages({
    "*": "title is required",
  }),
  skillId: Joi.string().required().messages({
    "*": "skillId is required",
  }),
  documentId: Joi.string().required().messages({
    "*": "documentId is required",
  }),
  documentType: Joi.string()
    .required()
    .valid(
      document_type.External,
      document_type.Personal,
      document_type.Student,
      document_type.Supporting,
      document_type.Tutorial
    ),
});

const externalVideoValidator = Joi.object({
  externalId: Joi.string().optional(),
  title: Joi.string().optional(),
  skillId: Joi.string().required().messages({
    "*": "skillId is required",
  }),
  description: Joi.string().optional(),
  isDeleted: Joi.boolean().optional(),
  link: Joi.string().optional(),
});

const getSkillValidator = Joi.object({
  sortKey: Joi.string().optional().allow(""),
  sortKeyOrder: Joi.number().optional().allow(""),
  limit: Joi.number().optional().allow(""),
  offset: Joi.number().optional().allow(""),
  search: Joi.string().optional().allow(""),
});

const assignedSkillValidator = Joi.object({
  studentId: Joi.string().required().messages({
    "*": "studentId is required",
  }),
  skillIds: Joi.array().required().items(Joi.string()),
});

const updatedAssignedValidator = Joi.object({
  assignedId: Joi.string().required().messages({
    "*": "assignedId is required",
  }),
  meetId: Joi.string(),
  is_active: Joi.boolean().optional(),
  is_completed: Joi.boolean().optional(),
  is_deleted: Joi.boolean().optional(),
  status: Joi.string()
    .optional()
    .valid(
      skill_history.pending,
      skill_history.completed,
      skill_history.submitted
    ),
});

const editStudentValidator = Joi.object({
  studentId: Joi.string().required().messages({
    "*": "studentId is required",
  }),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().optional(),
  phoneNumber: Joi.string().optional(),
  location: Joi.string().optional(),
  instrument: Joi.string().optional(),
  selectedPlan: Joi.string()
    .optional()
    .allow("")
    .when("type", {
      is: "student",
      then: Joi.required().messages({ "any.required": "Plan is required" }),
      otherwise: Joi.optional().allow(""),
    }),
  RBA_ACCOUNT: Joi.boolean().optional(),
  RBA_PROFILE: Joi.boolean().optional(),
  pro_rate_charge: Joi.boolean().optional(),
  paymentStatus: Joi.string().optional().valid("pending", "completed"),
});

const addVirtualConsultationValidator = Joi.object({
  date: Joi.string().required().messages({
    "*": "date is required",
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
  title: Joi.string().required().messages({
    "*": "title is required",
  }),
  colorCode: Joi.string().required().messages({
    "*": "colorCode is required",
  }),
});

const assignedTitleUpdateValidator = Joi.object({
  title: Joi.string().optional(),
  assignSkillId: Joi.string().required().messages({
    "*": "assignSkillId is required",
  }),
  documentId: Joi.string().optional(),
  removeDocumentId: Joi.string().optional(),
});

const getHistoryValidator = Joi.object({
  studentId: Joi.string().optional(),
  parentId: Joi.string().optional(),
  teacherId: Joi.string().optional(),
  limit: Joi.number().optional(),
  offset: Joi.number().optional(),
  search: Joi.string().optional().allow(""),
  sortKey: Joi.string().optional().allow(""),
  sortOrder: Joi.number().optional().allow(""),
  status: Joi.string()
    .optional()
    .valid(
      skill_history.pending,
      skill_history.submitted,
      skill_history.completed
    ),
});

const addMeetLinkValidator = Joi.object({
  Id: Joi.string().required().messages({
    "*": "Id is required",
  }),
  meeting_link: Joi.string().required().messages({
    "*": "Meeting link is required",
  }),
});

module.exports = {
  addSkillValidator,
  updateSkillValidator,
  titleUpdateValidator,
  externalVideoValidator,
  getSkillValidator,
  assignedSkillValidator,
  updatedAssignedValidator,
  editStudentValidator,
  addVirtualConsultationValidator,
  assignedTitleUpdateValidator,
  getHistoryValidator,
  addMeetLinkValidator,
};
