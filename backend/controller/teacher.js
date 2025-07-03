const {
  userService,
  teacherService,
  adminService,
  studentService,
} = require("../service");
const {
  response200,
  response400,
  response500,
  response201,
} = require("../lib/response-messages");
const catchAsyncError = require("../middleware/catchAsyncError");
const { isValidObjectId } = require("../config/mongoService");
const multer = require("multer");
const {
  addSkillValidator,
  updateSkillValidator,
} = require("../utils/validations/teacher.validation");
const {
  uploadFile,
  copyFileToDifferentFolder,
} = require("../lib/uploader/upload");
const { document_type, skill_history } = require("../utils/constants");
const { AssignSkill } = require("../models");
const storage = multer.memoryStorage();
const upload = multer(storage);
const { sendNotification } = require("../utils/pushFirebase");
const mongoService = require("../config/mongoService");
const moment = require('moment');

// add student
const addStudent = catchAsyncError(async (req, res) => {
  let userId = req.user;
  let { studentId } = req.body;

  if (!studentId) return response400(res, "studentId is required");
  if (!isValidObjectId(studentId))
    return response400(res, "Please enter valid student id");

  const student = await userService.checkUser({
    _id: studentId,
    role: "student",
  });
  if (!student) return response400(res, "Student details not found");

  const isStudentExits = await teacherService.checkStudent({
    teacherId: userId,
    studentId,
  });
  if (isStudentExits && !isStudentExits?.is_follow) {
    await teacherService.updateStudent(
      { _id: isStudentExits._id },
      { is_follow: true }
    );
    return response200(res, "Student added successfully", []);
  } else {
    await teacherService.storeStudent({
      teacherId: userId,
      status: "active",
      studentId,
      is_follow: true,
    });
    return response200(res, "Student added successfully", []);
  }
});

// all student list
const getAllStudents = catchAsyncError(async (req, res) => {
  let userId = req.user;
  const { sortKey, sortKeyOrder } = req.body;

  let sortQuery = { createdAt: -1 };
  if (sortKey && sortKeyOrder !== undefined) {
    sortQuery = { sortKey, sortKeyOrder };
  }
  // follow
  // let studentIds = await teacherService.getAllTeachersStudentIds({ teacherId: userId,status:"active",is_follow:true})
  // archived
  // let studentIds = await teacherService.getAllTeachersStudentIds({ teacherId: userId,status:"deleted",is_follow:false})
  let studentIds = await teacherService.getAllTeachersStudentIds({
    teacherId: userId,
    $or: [
      { status: "active", is_follow: true },
      { status: "deleted", is_follow: false },
    ],
  });

  let query = { _id: { $nin: studentIds } };

  const data = await teacherService.studentList(query, sortQuery, req.body);
  return response200(res, "All students list loaded successfully.", data);
});

// teacher's active student list
const getMyStudents = catchAsyncError(async (req, res) => {
  let userId = req.user;
  const { sortKey, sortKeyOrder } = req.body;

  let sortQuery = { createdAt: -1 };
  if (sortKey && sortKeyOrder !== undefined) {
    sortQuery = { sortKey, sortKeyOrder };
  }

  // include only active students
  let studentIds = await teacherService.teachersStudentIds({
    teacherId: userId,
    status: "active",
    is_follow: true,
  });
  let query = { _id: { $in: studentIds } };

  const data = await teacherService.studentList(query, sortQuery, req.body);

  return response200(res, "My students list loaded successfully.", data);
});

// teacher's deleted student list
const getDeletedStudents = catchAsyncError(async (req, res) => {
  let userId = req.user;
  const { sortKey, sortKeyOrder } = req.body;

  let sortQuery = { createdAt: -1 };
  if (sortKey && sortKeyOrder !== undefined) {
    sortQuery = { sortKey, sortKeyOrder };
  }

  // include only deleted students
  let studentIds = await teacherService.teachersStudentIds({
    teacherId: userId,
    status: "deleted",
  });
  let query = { _id: { $in: studentIds } };

  const data = await teacherService.studentList(query, sortQuery, req.body);

  return response200(res, "Deleted students list loaded successfully.", data);
});

const removeStudent = catchAsyncError(async (req, res) => {
  let userId = req.user;
  let { studentId } = req.body;

  if (!studentId) return response400(res, "studentId is required");
  if (!isValidObjectId(studentId))
    return response400(res, "Please enter valid student id");

  const isStudentExits = await teacherService.checkStudent({
    teacherId: userId,
    studentId,
  });
  // if (!isStudentExits) return response400(res, "Student does not exist.")

  // if (!isStudentExits) {
  //   await teacherService.storeStudent({
  //     teacherId: userId,
  //     studentId,
  //     is_follow: false,
  //   });
  // }

  await teacherService.updateStudent(
    { teacherId: userId, studentId },
    { status: "deleted", is_follow: false }
  );
  return response200(res, "Student removed successfully.", []);
});

const unArchivedStudent = catchAsyncError(async (req, res) => {
  let userId = req.user;
  let { studentId } = req.body;

  if (!studentId) return response400(res, "studentId is required");
  if (!isValidObjectId(studentId))
    return response400(res, "Please enter valid student id");

  const isStudentExits = await teacherService.checkStudent({
    teacherId: userId,
    studentId,
  });
  // if (!isStudentExits) return response400(res, "Student does not exist.")

  if (!isStudentExits) {
    return response400(res, "Student does not exist.");
  }

  // await teacherService.updateStudent({ teacherId: userId, studentId }, { status: "active" })
  // await teacherService.deleteStudentTeacher({ teacherId: userId, studentId },)
  await teacherService.updateStudent(
    { teacherId: userId, studentId },
    { status: "active", is_follow: false }
  );

  return response200(res, "Student un archived successfully.", []);
});

const unFollowStudent = catchAsyncError(async (req, res) => {
  let userId = req.user;
  let { studentId } = req.body;

  if (!studentId) return response400(res, "studentId is required");
  if (!isValidObjectId(studentId))
    return response400(res, "Please enter valid student id");

  const isStudentExits = await teacherService.checkStudent({
    teacherId: userId,
    studentId,
  });
  // if (!isStudentExits) return response400(res, "Student does not exist.")

  if (!isStudentExits) {
    return response400(res, "Student is not exists");
  }

  // await teacherService.deleteStudentTeacher({ teacherId: userId, studentId },)
  await teacherService.updateStudent(
    { teacherId: userId, studentId },
    { status: "active", is_follow: false }
  );
  return response200(res, "Student removed successfully.", []);
});

// get student details
const getStudentDetails = catchAsyncError(async (req, res) => {
  let { studentId } = req.params;

  let data = await userService.userDetails({ _id: studentId });
  return response200(res, "Data fetched successfully", data);
});

// confirmed student present
const studentPresent = catchAsyncError(async (req, res) => {
  const userId = req.user;
  const { studentLessonId, studentShow } = req.body;

  if (!studentLessonId)
    return response400(res, "The 'studentLessonId' is required.");
  if (!studentShow) return response400(res, "The 'studentShow' is required.");
  if (!isValidObjectId(studentLessonId))
    return response400(res, "Please enter valid studentLessonId");

  const query = { isDeleted: false, _id: studentLessonId, teachers: userId };

  const lesson = await adminService.checkOption("StudentLesson", query);
  if (!lesson) return response400(res, "Lesson details not found.");

  if (!userService.dateValidation(lesson.date))
    return response400(
      res,
      "Presence can only be confirmed on the day of the lesson."
    );
  lesson.studentShow = studentShow;

  await lesson.save();
  return response200(res, "Student presence marked successfully.", []);
});

// Will create a new skill
const newSkill = catchAsyncError(async (req, res) => {
  const userId = req.user;
  const data = await adminService.storeOption("Skills", {
    title: "New Skill",
    createdBy: userId,
  });
  await teacherService.store_skill({ teacherId: userId, skillId: data?._id });

  return response200(res, "Skill Added successfully", data);
});

// add skill
const addSkill = catchAsyncError(async (req, res) => {
  const userId = req.user;
  upload.fields([
    { name: "title", maxCount: 1 },
    { name: "instrument", maxCount: 1 },
    { name: "category", maxCount: 1 },
    { name: "description", maxCount: 1 },
    { name: "personalTutorials" },
    { name: "tutorialVideos" },
    { name: "supportingDocuments" },
    { name: "externalVideos", maxCount: 1 },
    { name: "notes", maxCount: 1 },
    { name: "assignToStudent", maxCount: 1 },
  ])(req, res, async (error) => {
    try {
      if (error) return response400(res, "Something went wrong.");
      let { title, instrument, category } = req.body;

      const validation = addSkillValidator?.filter((field) => !req.body[field]);
      if (validation.length > 0)
        return response400(res, `${validation.join(", ")} is required`);

      // let isMatch = await adminService.checkOption("Skills", { title })
      // if (isMatch) return response400(res, "Skill is already exits for this title.")

      await teacherService.checkIsExits("Instruments", instrument);
      if (category) await teacherService.checkIsExits("Category", category);

      // personal tutorials image
      const personalTutorials = [];
      if (req?.files?.personalTutorials) {
        const files = req.files.personalTutorials;
        await Promise.all(
          files.map(async (file) => {
            const result = await uploadFile(file);
            personalTutorials.push({ url: result, title: result });
          })
        );
      }
      //  tutorials videos
      const tutorialVideos = [];
      if (req?.files?.tutorialVideos) {
        const files = req.files.tutorialVideos;
        await Promise.all(
          files.map(async (file) => {
            const result = await uploadFile(file);
            tutorialVideos.push({ url: result, title: result });
          })
        );
      }
      //  supportingDocuments
      const supportingDocuments = [];
      if (req?.files?.supportingDocuments) {
        const files = req.files.supportingDocuments;
        await Promise.all(
          files.map(async (file) => {
            const result = await uploadFile(file);
            supportingDocuments.push({ url: result, title: result });
          })
        );
      }
      const skillData = await adminService.storeOption("Skills", {
        ...req.body,
        personalTutorials,
        tutorialVideos,
        supportingDocuments,
        createdBy: userId,
      });
      await teacherService.store_skill({
        teacherId: userId,
        skillId: skillData?._id,
      });
      const response = { skillId: skillData?._id };
      return response200(res, "Skill created successfully.", response);
    } catch (error) {
      return response400(res, error.message);
    }
  });
});

// get single skill details
const getSkillDetails = catchAsyncError(async (req, res) => {
  let { skillId } = req.params;
  if (!isValidObjectId(skillId))
    return response200(res, "Please enter valid skill id");
  let data = await teacherService.skillDetails(skillId);
  return response200(res, "Data fetched successfully", data);
});

const updateSkill = catchAsyncError(async (req, res) => {
  const userId = req.user;
  upload.fields([
    { name: "skillId", maxCount: 1 },
    { name: "title", maxCount: 1 },
    { name: "instrument", maxCount: 1 },
    { name: "category", maxCount: 1 },
    { name: "description", maxCount: 1 },
    { name: "personalTutorials" },
    { name: "tutorialVideos" },
    { name: "tutorialTitle", maxCount: 1 },
    { name: "supportingDocuments" },
    { name: "supportingTitle", maxCount: 1 },
    { name: "externalVideos", maxCount: 1 },
    { name: "notes", maxCount: 1 },
    { name: "removeTutorialVideos", maxCount: 1 },
    { name: "removePersonalTutorials", maxCount: 1 },
    { name: "removeSupportingDocuments", maxCount: 1 },
    { name: "status", maxCount: 1 },
    { name: "isDeleted", maxCount: 1 },
  ])(req, res, async (error) => {
    try {
      if (error) return response400(res, "Something went wrong.");
      let {
        skillId,
        title,
        instrument,
        category,
        removeSupportingDocuments,
        removeTutorialVideos,
        removePersonalTutorials,
        description,
        externalVideos,
        notes,
        status,
        isDeleted,
        tutorialTitle,
        supportingTitle,
      } = req.body;

      // const validation = updateSkillValidator?.filter(field => !req.body[field]);
      // if (validation.length > 0) return response400(res, `${validation.join(', ')} is required`);

      let skill = await adminService.checkOption("Skills", { _id: skillId });
      // let skill = await adminService.checkOption("Skills", { _id: skillId, isDeleted: false })
      if (!skill) return response400(res, "Skill details not found");

      // if (title) {
      //     let isMatch = await adminService.checkOption("Skills", { title, _id: { $ne: skillId } })
      //     if (isMatch) return response400(res, "Skill is already exits for this title.")
      // }

      if (instrument) {
        let instrumentDetails = await teacherService.checkIsExits(
          "Instruments",
          instrument
        );
        if (instrumentDetails) skill.instrument = instrument;
      }

      if (category) {
        let categoryDetails = await teacherService.checkIsExits(
          "Category",
          category
        );
        if (categoryDetails) skill.category = category;
      }

      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes
      let invalidFiles = [];

      const fieldsToValidate = [
        "personalTutorials",
        "tutorialVideos",
        "supportingDocuments",
      ];
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

      console.log("invalidFiles", invalidFiles);

      // If there are invalid files, return an error response
      if (invalidFiles.length) {
        return response400(
          res,
          `File size exceeds 10 MB for the following files. ${invalidFiles?.[0]?.field}`
        );
      }

      // personal tutorials image
      if (req?.files?.personalTutorials) {
        const files = req.files.personalTutorials;
        await Promise.all(
          files.map(async (file) => {
            const result = await uploadFile(file);
            skill.personalTutorials.push({ url: result, title: result });
          })
        );
      }
      //  tutorials videos
      if (req?.files?.tutorialVideos) {
        const files = req.files.tutorialVideos;
        await Promise.all(
          files.map(async (file) => {
            const result = await uploadFile(file);
            skill.tutorialVideos.push({
              url: result,
              title: tutorialTitle ? tutorialTitle : "Untitled",
            });
          })
        );
      }
      //  supportingDocumentsupdateSkill
      if (req?.files?.supportingDocuments) {
        const files = req.files.supportingDocuments;
        await Promise.all(
          files.map(async (file) => {
            const result = await uploadFile(file);
            skill.supportingDocuments.push({
              url: result,
              title: supportingTitle ? supportingTitle : "Untitled",
            });
          })
        );
      }

      if (removeSupportingDocuments && removeSupportingDocuments?.length) {
        await teacherService.removeDocuments(updateSkill
          [removeSupportingDocuments],
          skill,
          "supportingDocuments"
        );
      }
      if (removeTutorialVideos && removeTutorialVideos?.length) {
        await teacherService.removeDocuments(
          [removeTutorialVideos],
          skill,
          "tutorialVideos"
        );
      }
      if (removePersonalTutorials && removePersonalTutorials?.length) {
        await teacherService.removeDocuments(
          [removePersonalTutorials],
          skill,
          "personalTutorials"
        );
      }

      skill.title = title ? title : skill?.title;
      skill.description = description ? description : skill?.description;
      skill.externalVideos = externalVideos
        ? externalVideos
        : skill?.externalVideos;
      skill.notes = notes ? notes : skill?.notes;
      skill.status = status ? status : skill?.status;
      skill.isDeleted = isDeleted ? isDeleted : skill?.isDeleted;

      if (skill?.isDeleted) {
        const skillConnected = await teacherService.get_single_teacher_skill({
          skillId,
          teacherId: userId,
        });
        if (skillConnected) {
          await teacherService.update_teacher_skill(
            { skillId, teacherId: userId },
            { status: "deleted" }
          );
        } else {
          await teacherService.store_skill({
            teacherId: userId,
            skillId,
            status: "deleted",
          });
        }
      }

      if (!skill?.isDeleted) {
        await teacherService.update_teacher_skill(
          { teacherId: userId, skillId },
          { status: "active" }
        );
      }

    const token = "teacher token"
    await sendNotification(token ,"new message :","skill update" )

      await skill.save();
      
      return response200(res, "Skill details updated successfully.", []);
    } catch (error) {
      return response400(res, error.message);
    }
  });
});

const removeTeacherSkill = catchAsyncError(async (req, res) => {
  let userId = req.user;
  let { skillId } = req.body;

  if (!skillId) return response400(res, "skillId is required");
  if (!isValidObjectId(skillId))
    return response400(res, "Please enter valid skill id");

  const isStudentExits = await teacherService.get_single_teacher_skill({
    teacherId: userId,
    skillId,
  });
  // if (!isStudentExits) return response400(res, "Student does not exist.")

  if (!isStudentExits) {
    await teacherService.store_skill({
      teacherId: userId,
      skillId,
      status: "deleted",
    });
  } else {
    await teacherService.update_teacher_skill(
      { teacherId: userId, skillId },
      { status: "deleted" }
    );
  }

  let skill = await adminService.checkOption("Skills", { _id: skillId });
  if (!skill) return response400(res, "Skill details not found");
  skill.isDeleted = true;
  await skill.save();

  return response200(res, "Skill removed successfully.", []);
});

const updateDocumentTitle = catchAsyncError(async (req, res) => {
  const { title, skillId, documentId, documentType } = req.body;

  const skillData = await adminService.checkOption("Skills", { _id: skillId });
  if (!skillData) return response400(res, "Skill details not found");

  if (documentType === document_type.Tutorial) {
    if (skillData?.tutorialVideos?.length) {
      await Promise.all(
        skillData?.tutorialVideos?.map(async (doc) => {
          if (doc?._id?.toString() === documentId.toString()) {
            doc.title = title;
          }
        })
      );
    }
  }

  if (documentType === document_type.Supporting) {
    if (skillData?.supportingDocuments?.length) {
      await Promise.all(
        skillData?.supportingDocuments?.map(async (doc) => {
          if (doc?._id?.toString() === documentId.toString()) {
            doc.title = title;
          }
        })
      );
    }
  }

  if (documentType === document_type.Personal) {
    if (skillData?.personalTutorials?.length) {
      await Promise.all(
        skillData?.personalTutorials?.map(async (doc) => {
          if (doc?._id?.toString() === documentId.toString()) {
            doc.title = title;
          }
        })
      );
    }
  }

  if (documentType === document_type.Student) {
    if (skillData?.studentResponseVideos?.length) {
      await Promise.all(
        skillData?.studentResponseVideos?.map(async (doc) => {
          if (doc?._id?.toString() === documentId.toString()) {
            doc.title = title;
          }
        })
      );
    }
  }

  await skillData.save();
  return response200(res, "Title updated successfully.", []);
});

const manageExternalVideos = catchAsyncError(async (req, res) => {
  const { externalId, skillId, title, description, link, isDeleted } = req.body;
  const skillData = await adminService.checkOption("Skills", { _id: skillId });
  if (!skillData) return response400(res, "Skill details not found");

  if (externalId) {
    if (skillData?.externalVideos?.length) {
      skillData.externalVideos = skillData.externalVideos.filter((doc) => {
        if (doc?._id?.toString() === externalId.toString()) {
          if (isDeleted) {
            return false;
          } else {
            doc.title = title;
            doc.link = link;
            doc.description = description;
          }
        }
        return true;
      });
    }
  } else {
    if (!title || !description || !link)
      return response400(res, "Please enter title, description & link");
    skillData?.externalVideos.push({
      title,
      description,
      link,
    });
  }

  await skillData.save();
  return response200(res, "External video added successfully");
});

const getAllSkills = catchAsyncError(async (req, res) => {
  let userId = req.user;
  const { sortKey, sortKeyOrder, limit, offset, search } = req.body;

  let sortQuery = { createdAt: -1 };
  if (sortKey && sortKeyOrder !== undefined) {
    sortQuery[sortKey] = sortKeyOrder;
  }

  // exclude exits students
  let skillIds = await teacherService.teachersSkillIds({ teacherId: userId });
  // let query = { _id: { $nin: skillIds }, isDeleted: false, }
  let query = { isDeleted: false };

  const data = await teacherService.skillList(
    query,
    sortQuery,
    limit,
    offset,
    search
  );

  return response200(res, "All skill list loaded successfully.", data);
});

const getMySkills = catchAsyncError(async (req, res) => {
  let userId = req.user;
  const { sortKey, sortKeyOrder, limit, offset, search } = req.body;

  let sortQuery = { createdAt: -1 };
  if (sortKey && sortKeyOrder !== undefined) {
    sortQuery = { [sortKey]: sortKeyOrder };
  }

  // include only active students
  let skillIds = await teacherService.teachersSkillIds({
    teacherId: userId,
    status: "active",
  });
  let query = { _id: { $in: skillIds }, isDeleted: false };

  const data = await teacherService.skillList(
    query,
    sortQuery,
    limit,
    offset,
    search
  );

  return response200(res, "My Skill list loaded successfully.", data);
});

const getDeletedSkills = catchAsyncError(async (req, res) => {
  let userId = req.user;
  const { sortKey, sortKeyOrder, limit, offset, search } = req.body;

  let sortQuery = { createdAt: -1 };
  if (sortKey && sortKeyOrder !== undefined) {
    sortQuery[sortKey] = sortKeyOrder;
  }

  // include only deleted students
  let skillIds = await teacherService.teachersSkillIds({
    teacherId: userId,
    status: "deleted",
  });
  // let query = { _id: { $in: skillIds }, isDeleted: true, }
  let query = { _id: { $in: skillIds } };

  const data = await teacherService.skillList(
    query,
    sortQuery,
    limit,
    offset,
    search
  );

  return response200(res, "Deleted skill list loaded successfully.", data);
});

const removeSkill = catchAsyncError(async (req, res) => {
  const { skillId } = req.params;

  const skill = await adminService.checkOption("Skills", { _id: skillId });
  if (!skill) return response400(res, "Skill details not found");

  await teacherService.deleteTeacherSkill({ skillId, status: "deleted" });
  await teacherService.deleteSkill({ _id: skillId });
  await teacherService.removeAssignedSkill({ skillId });

  return response200(res, "Skill removed successfully", []);
});

const assignedSkillToStudent = catchAsyncError(async (req, res) => {
  const userId = req.user;
  const { studentId, skillIds } = req.body;

  const data = await teacherService.checkStudent({
    teacherId: userId,
    studentId,
  });
  if (!data) return response400(res, "Student details not found");

  let skillNotExists = false;
  if (skillIds?.length) {
    const skillChecks = await Promise.all(
      skillIds.map(async (skillId) => {
        const skill = await adminService.checkOption("Skills", {
          _id: skillId,
          isDeleted: false,
        });
        if (!skill) return { skillId, exists: false };
        await teacherService.manageAssignedSkill({
          teacherId: userId,
          skillId,
          studentId,
        });
        // Stored skill history
        await studentService.storeHistory({
          studentId: studentId,
          teacherId: userId,
          skillId: skillId,
          status: skill_history.pending,
        });
        return { skillId, exists: true };
      })
    );

    const invalidSkills = skillChecks.filter((skill) => !skill.exists);
    if (invalidSkills.length > 0) {
      return response400(
        res,
        "Skill is not exists",
        invalidSkills.map((skill) => skill.skillId)
      );
    }
  }

  if (skillNotExists) return response400(res, "Skill details not found");
  return response200(res, "Skill assigned successfully", []);
});

const getSkillTemplates = catchAsyncError(async (req, res) => {
  const userId = req.user;
  const { studentId } = req.params;

  const data = await teacherService.checkStudent({
    teacherId: userId,
    studentId,
  });
  if (!data) {
    await teacherService.storeStudent({
      teacherId: userId,
      studentId,
      is_follow: false,
      status: "active",
    });
  }

  const skills = await teacherService.get_skill_templates({
    teacherId: userId,
    studentId,
  });

  const getAllSkills = await teacherService.get_all_skill_templates({
    teacherId: userId,
    studentId,
  });

  const response = { mySkills: skills, otherSkills: getAllSkills };

  return response200(res, "Fetched successfully", response);
});

const getAssignedSkills = catchAsyncError(async (req, res) => {
  const userId = req.user;
  const { studentId } = req.params;

  const data = await teacherService.checkStudent({
    teacherId: userId,
    studentId,
  });
  if (!data) return response400(res, "Student details not found");

  const skills = await teacherService.get_assigned_skills({
    teacherId: userId,
    studentId,
  });

  return response200(res, "Fetched successfully", skills);
});

const getAssignedSkillsVideoCall = catchAsyncError(async (req, res) => {
  const { studentId,teacherId } = req.query;

  const data = await teacherService.checkStudent({
    teacherId,
    studentId,
  });
  if (!data) return response400(res, "Student details not found");

  const skills = await teacherService.get_assigned_skills({
    teacherId,
    studentId,
  });

  return response200(res, "Fetched successfully", skills);
});

const updateAssignedSkills = catchAsyncError(async (req, res) => {
  const userId = req.user;
  const { assignedId } = req.body;

  const assignedData = await teacherService.get_single_assigned({
    _id: assignedId,
  });
  if (!assignedData) return response400(res, "Assigned Id not found");

  if (req?.body?.is_completed) {
    // Stored skill history
    await studentService.storeHistory({
      teacherId: userId,
      studentId: assignedData?.studentId,
      skillId: assignedData?.skillId,
      status: skill_history.completed,
      meetId: meetId,
    });
  }
  await teacherService.update_assigned_skill({ _id: assignedId }, req.body);

  return response200(res, "Status changed successfully", []);
});

const markAttandace = catchAsyncError(async (req, res) => {
  const userId = req.user;
  const { status, date, studentId, lessonId, studentLessonId } = req.body;

  var enterData = {
      studentId: studentId,
      lessonId: lessonId,
      studentLessonId: studentLessonId,
      date: date,
      status: status
  }
  mongoService.createOne("AttendedLesson", enterData);

  const dataReport = await mongoService.findOne("Report", { studentId: studentId });

  const data = await mongoService.findAll("AttendedLesson", {
    studentId: studentId,
    lessonId: lessonId,
    studentLessonId: studentLessonId,
    status: { $in: ["absent", "present"] },
  });

   const noshowdata = await mongoService.findAll("AttendedLesson", {
    studentId: studentId,
    lessonId: lessonId,
    studentLessonId: studentLessonId,
    status: "absent"
  });

  const totalLesson = data.length
  const noshowdataLesson = noshowdata.length
  let updatedNoShows;
  updatedNoShows = 0;

  if(totalLesson > 0){
    updatedNoShows = parseFloat((noshowdataLesson * 100) / totalLesson).toFixed(2);
  }

  const canceldata = await mongoService.findAll("AttendedLesson", {
    studentId: studentId,
    lessonId: lessonId,
    studentLessonId: studentLessonId,
    status: "cancel"
  });

  let ecxlCount = 0;
  let lcxlCount = 0;

  canceldata.forEach(record => {
    const lessonDate = moment(record.date);
    const cancelTime = moment(record.createdAt); 

    const dayOfWeek = lessonDate.day(); 
    let cutoff;
    if (dayOfWeek === 6 || dayOfWeek === 0) {
      cutoff = lessonDate.clone().subtract(1, 'days').hour(9).minute(0).second(0);
    } else {
      cutoff = lessonDate.clone().subtract(1, 'days').hour(13).minute(0).second(0);
    }

    if (cancelTime.isBefore(cutoff)) {
      ecxlCount++;
    } else {
      lcxlCount++;
    }
  });

  const totalCancellation = lcxlCount + ecxlCount;
  const lcxlPer = parseFloat((lcxlCount * 100) / totalCancellation).toFixed(2);
  const ecxlPer = parseFloat((ecxlCount * 100) / totalCancellation).toFixed(2);

  if (dataReport) {
    await mongoService.updateOne(
      "Report",
      { _id: dataReport._id },
      { $set: { noShows: updatedNoShows, lcxl: lcxlPer, ecxl: ecxlPer } }
    );
  }
    else {
    await mongoService.insertOne("Report", {
      studentId: studentId,
      noShows: updatedNoShows,
      lcxl: lcxlPer, 
      ecxl: ecxlPer
    });
  }

  return response200(res, "Status changed successfully", []);
});

const updateAssignedSkillsVideoCall = catchAsyncError(async (req, res) => {
  const { assignedId, meetId } = req.body;

  const assignedData = await teacherService.get_single_assigned({
    _id: assignedId,
  });
  if (!assignedData) return response400(res, "Assigned Id not found");

  const assignedSkillData = await AssignSkill.findOne({_id:assignedId})


  console.log(assignedSkillData.meetId,"assignedSkillData")

  if(!assignedSkillData.meetId){
  // Stored skill history
  await studentService.storeHistory({
    meetId: meetId,
  });

  await teacherService.update_assigned_skill({ _id: assignedId }, req.body);
  }

  return response200(res, "Status changed successfully", []);
});

const updateStudent = catchAsyncError(async (req, res) => {
  const {
    studentId,
    RBA_ACCOUNT,
    RBA_PROFILE,
    pro_rate_charge,
    email,
    instrument,
    phoneNumber,
    location,
    selectedPlan,
  } = req.body;

  const studentData = await teacherService.checkStudent({ studentId });
  if (!studentData) return response400(res, "Student details not found");

  if (location) {
    if (!isValidObjectId(location))
      return response400(res, "Please enter valid location id");
    let locationDetails = await adminService.checkOption("Locations", {
      _id: location,
    });
    if (!locationDetails) return response400(res, "Location details not found");
  }

  if (email) {
    const user = await userService.checkUser({
      email,
      _id: { $ne: studentId },
    });
    if (user) return response400(res, "User is already register with us");
  }

  if (phoneNumber) {
    const isExits = await userService.checkUser({
      phoneNumber,
      _id: { $ne: studentId },
    });
    if (isExits) return response400(res, "Phone number is already exits.");
  }

  if (selectedPlan) {
    const planDetails = await adminService.checkOption("Plans", {
      _id: selectedPlan,
    });
    if (!planDetails)
      return response400(res, "Selected plan details not found");
  }

  if (instrument) {
    const isMatch = await adminService.checkOption("Instruments", {
      _id: instrument,
    });
    if (!isMatch) return response400(res, "Instrument is not exits.");
    req.body.instruments = [instrument];
  }

  if (
    RBA_ACCOUNT !== undefined ||
    RBA_PROFILE !== undefined ||
    pro_rate_charge !== undefined
  ) {
    await teacherService.updateStudentDetails(
      { studentId: studentId },
      { RBA_ACCOUNT, RBA_PROFILE, pro_rate_charge }
    );
  }

  await teacherService.updateStudentReport({ _id: studentId }, req.body);

  return response200(res, "Updated successfully", []);
});

const getStudentInformation = catchAsyncError(async (req, res) => {
  const userId = req.user;
  const { studentId } = req.params;
  const data = await teacherService.getStudentReport({
    studentId,
    teacherId: userId,
  });
  return response200(res, "Data fetched successfully", data);
});

const getStudentReportDetails = catchAsyncError(async (req, res) => {
  const userId = req.user;
  const { studentId } = req.params;
  const data = await teacherService.getStudentReportData({
    studentId,
    teacherId: userId,
  });
  return response200(res, "Data fetched successfully", data);
});

const copySkill = catchAsyncError(async (req, res) => {
  const userId = req.user;

  const { skillId } = req.body;
  if (!isValidObjectId(skillId))
    return response200(res, "Please enter valid skill id");

  const skillData = await adminService.checkOption("Skills", { _id: skillId });
  if (!skillData) return response400(res, "Skill details not found");

  const {
    title,
    instrument,
    category,
    description,
    externalVideos,
    notes,
    status,
    isDeleted,
    personalTutorials,
    tutorialVideos,
    supportingDocuments,
    studentResponseVideos,
  } = skillData;

  let tempPersonalTutorials = [];
  let tempTutorialVideos = [];
  let tempSupportingDocuments = [];
  let tempStudentReportVideos = [];

  if (personalTutorials?.length) {
    await Promise.all(
      personalTutorials.map(async (per) => {
        if (per?.url) {
          const newURL = await copyFileToDifferentFolder(per?.url);
          per.url = newURL;
        }
        tempPersonalTutorials.push(per);
      })
    );
  }

  if (tutorialVideos?.length) {
    await Promise.all(
      tutorialVideos.map(async (tut) => {
        if (tut?.url) {
          const newURL = await copyFileToDifferentFolder(tut?.url);
          tut.url = newURL;
        }
        tempTutorialVideos.push(tut);
      })
    );
  }

  if (supportingDocuments?.length) {
    await Promise.all(
      supportingDocuments.map(async (sup) => {
        if (sup?.url) {
          const newURL = await copyFileToDifferentFolder(sup?.url);
          sup.url = newURL;
        }
        tempSupportingDocuments.push(sup);
      })
    );
  }

  if (studentResponseVideos?.length) {
    await Promise.all(
      studentResponseVideos.map(async (stu) => {
        if (stu?.url) {
          const newURL = await copyFileToDifferentFolder(stu?.url);
          stu.url = newURL;
        }
        tempStudentReportVideos.push(stu);
      })
    );
  }

  let skillObject = {
    title: `${title} (Copy)`,
    instrument,
    category,
    description,
    externalVideos,
    notes,
    status,
    // isDeleted,
    personalTutorials: tempPersonalTutorials,
    tutorialVideos: tempTutorialVideos,
    supportingDocuments: tempSupportingDocuments,
    studentResponseVideos: tempStudentReportVideos,
    createdBy: userId,
  };

  const newSkill = await adminService.storeOption("Skills", skillObject);
  await teacherService.store_skill({
    teacherId: userId,
    skillId: newSkill?._id,
  });
  return response201(res, "Skill Added successfully", newSkill);
});

const teacherDashboard = catchAsyncError(async (req, res) => {
  const userId = req.user;

  const studentCount = await teacherService.getStudentCount({
    teacherId: userId,
    status: { $ne: "deleted" },
  });

  const signUpStudentList = await teacherService.fetchAllStudentsOfTeacher({
    teacherId: userId,
    status: { $ne: "deleted" },
  });
  const yearlySignupData = await teacherService.fetchYearlyData(
    signUpStudentList
  );

  let signupCount = 0;
  let signupPercentage = 0.0;
  if (yearlySignupData?.length) {
    yearlySignupData.map((val) => {
      signupCount += val.signupStudentCounts;
    });

    const lastMonthIndex = yearlySignupData.length - 1;
    const currentMonth = yearlySignupData[lastMonthIndex];
    const previousMonth = yearlySignupData[lastMonthIndex - 1];

    const prevCount = previousMonth.signupStudentCounts;
    const currCount = currentMonth.signupStudentCounts;

    let percentageChange = 0;

    if (prevCount === 0) {
      percentageChange = currCount > 0 ? 100 : 0; // Avoid division by zero
    } else {
      percentageChange = ((currCount - prevCount) / prevCount) * 100;
    }

    signupPercentage = percentageChange.toFixed(2);
  }

  const data = {
    studentCount,
    studentPerformance: 0,
    flightRisksStudents: 0,
    sign_ups: signupCount,
    signupPercentage,
    terminations: 0,
    PracticePad: 0.0,
    yearlySignupData,
  };

  return response200(res, "fetched successfully", data);
});

const addMeetingLink = catchAsyncError(async (req, res) => {
  const { Id, meeting_link } = req.body;
  const data = await teacherService.checkStudent({
    _id: Id,
  });

  if (!data) {
    return response400(res, "Student details id is not exists");
  }

  await teacherService.updateStudent({ _id: Id }, { meeting_link });

  return response200(res, "Added successfully");
});

module.exports = {
  addStudent,
  getAllStudents,
  getMyStudents,
  getDeletedStudents,
  removeStudent,
  getStudentDetails,
  studentPresent,
  newSkill,
  addSkill,
  getSkillDetails,
  updateSkill,
  updateDocumentTitle,
  manageExternalVideos,
  getAllSkills,
  getMySkills,
  getDeletedSkills,
  removeSkill,
  assignedSkillToStudent,
  getSkillTemplates,
  getAssignedSkills,
  updateAssignedSkills,
  unFollowStudent,
  unArchivedStudent,
  updateStudent,
  getStudentInformation,
  getStudentReportDetails,
  removeTeacherSkill,
  copySkill,
  teacherDashboard,
  addMeetingLink,
  updateAssignedSkillsVideoCall,
  getAssignedSkillsVideoCall,
  markAttandace
};
