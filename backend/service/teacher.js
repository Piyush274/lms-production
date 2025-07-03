const { default: mongoose } = require("mongoose");
const mongoService = require("../config/mongoService");
const { deleteImage } = require("../lib/uploader/upload");
const moment = require("moment");

const checkStudent = async (payload) => {
  try {
    return await mongoService.findOne("StudentTeacher", payload);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const storeStudent = async (payload) => {
  try {
    return await mongoService.createOne("StudentTeacher", payload);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const teachersStudentIds = async (payload) => {
  try {
    const students = await mongoService.findAll("StudentTeacher", payload);
    return students.map((val) => val.studentId);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllTeachersStudentIds = async (payload) => {
  try {
    let students = await mongoService.findAll("StudentTeacher", payload);
    return students.map((val) => val.studentId);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteStudentTeacher = async (query) => {
  try {
    return await mongoService.deleteData("StudentTeacher", query);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const studentsTeacherIds = async (payload) => {
  try {
    const teacher = await mongoService.findAll("StudentTeacher", payload);
    return teacher.map((val) => val.teacherId.toString());
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateStudent = async (match, payload) => {
  try {
    return await mongoService.updateOne("StudentTeacher", match, payload);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const studentList = async (match, sortQuery, reqBody) => {
  try {
    const { limit, offset, search } = reqBody;
    const limitData = parseInt(limit, 10) || 10;
    const offsetData = parseInt(offset, 10) || 0;

    let query = { isDeleted: false, role: "student", ...match };
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    let pipeline = [
      { $match: query },
      {
        $lookup: {
          from: "studentteachers",
          localField: "_id",
          foreignField: "studentId",
          as: "teacherDetails",
          pipeline: [
            {
              $project: {
                teacherId: 1,
                meeting_link: { $ifNull: ["$meeting_link", ""] },
              },
            },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          date_of_birth: 1,
          phoneNumber: 1,
          isActive: 1,
          createdAt: 1,
          profileImage: 1,
          teacherDetails: 1,
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          results: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          totalCount: 1,
          data: { $slice: ["$results", offsetData, limitData] },
        },
      },
    ];
    let data = await mongoService.aggregation("Users", pipeline);

    if (sortQuery.sortKey === "lastName" && data?.length) {
      data[0].data = data?.[0]?.data.sort((a, b) => {
        return sortQuery.sortKeyOrder === -1
          ? b?.lastName.localeCompare(a?.lastName)
          : a?.lastName.localeCompare(b?.lastName);
      });
    }
    return (data = !data.length ? [{ totalCount: 0, data: [] }] : data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const studentData = async (teacherId) => {
  try {
    let query = {
      // isDeleted: false,
      // role: "student",
      teacherId: new mongoose.Types.ObjectId(teacherId),
    };

    let pipeline = [
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "studentDetails",
          pipeline: [
            {
              $project: {
                firstName: 1,
                lastName: 1,
                profileImage: { $ifNull: ["$profileImage", ""] },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$studentDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          studentId: "$studentDetails._id",
          firstName: "$studentDetails.firstName",
          lastName: "$studentDetails.lastName",
          profileImage: "$studentDetails.profileImage",
        },
      },
    ];

    let data = await mongoService.aggregation("StudentTeacher", pipeline);

    let temp =[]
    if(data?.length){
      data.map(val => {
        if (!temp.some(item => item.studentId.toString() === val.studentId.toString())) {
          temp.push(val);
        }
      });
      data =temp;
    }

    if (!data || data.length === 0) {
      return { success: false, message: "No students found." };
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const checkIsExits = async (model, id) => {
  try {
    if (!mongoService.isValidObjectId(id)) {
      throw { message: `Please enter valid ${model} id` };
    }

    const result = await mongoService.findOne(model, { _id: id });
    if (!result) {
      throw { message: `${model} details not found` };
    }

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const skillDetails = async (id) => {
  try {
    let populateQuery = [
      {
        path: "instrument",
        select: "name",
      },
      {
        path: "category",
        select: "name",
      },
    ];
    return await mongoService.findOne(
      "Skills",
      { _id: id },
      {},
      {
        select:
          "title description personalTutorials tutorialVideos supportingDocuments externalVideos notes status studentResponseVideos isDeleted",
      },
      populateQuery
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const removeDocuments = async (removeItems, data, fieldName) => {
  if (removeItems.length) {
    await Promise.all(
      removeItems.map(async (itemId) => {
        const itemIndex = data[fieldName].findIndex(
          (item) => item._id.toString() === itemId
        );

        if (itemIndex !== -1) {
          const fileUrl = data[fieldName][itemIndex].url;

          data[fieldName].splice(itemIndex, 1);

          await deleteImage(fileUrl);
        }
      })
    );

    return await data.save();
  }
};

const updateSkillDetails = async (match, payload) => {
  try {
    return await mongoService.updateOne("Skills", match, payload);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const teacherList = async (reqQuery) => {
  try {
    let location = reqQuery;
  
    let query = { isDeleted: false, role: "teacher", isActive: true };

    if (location) {
      query.location = new mongoose.Types.ObjectId(location);
    }
    let populateQuery = [
      {
        path: "location",
        select: "name locationType",
      },
    ];
    return await mongoService.populate(
      "Users",
      query,
      {},
      {
        select:
          "email firstName role isActive createdAt phoneNumber profileImage location lastName",
      },
      populateQuery
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const store_skill = async (payload) => {
  try {
    return await mongoService.createOne("TeacherSkill", payload);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const get_single_teacher_skill = async (query) => {
  try {
    return await mongoService.findOne("TeacherSkill", query);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const update_teacher_skill = async (query, payload) => {
  try {
    return await mongoService.updateOne("TeacherSkill", query, payload);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const teachersSkillIds = async (payload) => {
  try {
    const skills = await mongoService.findAll("TeacherSkill", payload);
    return skills?.map((val) => val.skillId);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const skillList = async (match, sortQuery, limit, offset, search) => {
  try {
    const limitData = parseInt(limit, 10) || 10;
    const offsetData = parseInt(offset, 10) || 0;

    let query = { ...match };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        // { instrument: { $regex: search, $options: 'i' } },
      ];
    }

    let pipeline = [
      { $match: query },
      {
        $lookup: {
          from: "instruments",
          localField: "instrument",
          foreignField: "_id",
          as: "instrumentDetails",
          pipeline: [{ $project: { name: 1 } }],
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
          pipeline: [{ $project: { name: 1 } }],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "userDetails",
          pipeline: [{ $project: { lastName: 1 } }],
        },
      },
      {
        $project: {
          title: 1,
          instrument: {
            $ifNull: [{ $arrayElemAt: ["$instrumentDetails.name", 0] }, null],
          },
          instrumentId: {
            $ifNull: [{ $arrayElemAt: ["$instrumentDetails._id", 0] }, null],
          },
          category: {
            $ifNull: [{ $arrayElemAt: ["$categoryDetails.name", 0] }, null],
          },
          categoryId: {
            $ifNull: [{ $arrayElemAt: ["$categoryDetails._id", 0] }, null],
          },
          description: { $ifNull: ["$description", ""] },
          createdBy: 1,
          creator: {
            $ifNull: [
              { $arrayElemAt: ["$userDetails.lastName", 0] },
              "Teacher",
            ],
          },
        },
      },
      { $sort: sortQuery },
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          results: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          totalCount: 1,
          data: { $slice: ["$results", offsetData, limitData] },
        },
      },
    ];
    let data = await mongoService.aggregation("Skills", pipeline);
    return (data = !data.length ? [{ totalCount: 0, data: [] }] : data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteTeacherSkill = async (query) => {
  try {
    return await mongoService.deleteData("TeacherSkill", query);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteSkill = async (query) => {
  try {
    return await mongoService.deleteData("Skills", query);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const manageAssignedSkill = async (payload) => {
  try {
    return await mongoService.createOne("AssignSkill", payload);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// remove permently
const removeAssignedSkill = async (skillId) => {
  try {
    return await mongoService.deleteMany("AssignSkill", skillId);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const get_skill_templates = async (matchQuery) => {
  try {
    const populateQuery = [
      {
        path: "skillId",
        select: "title createdBy",
        match: { isDeleted: false },
      },
    ];

    let getTeacherSkills = await mongoService.populate(
      "TeacherSkill",
      { teacherId: matchQuery.teacherId, status: "active" },
      {},
      { sort: { createdAt: -1 } },
      populateQuery
    );
    if (getTeacherSkills?.length) {
      getTeacherSkills = getTeacherSkills.filter((val) => val.skillId);
    }
    let pipeline = [
      {
        $match: {
          studentId: new mongoose.Types.ObjectId(matchQuery.studentId),
          teacherId: new mongoose.Types.ObjectId(matchQuery.teacherId),
        },
      },
    ];

    const getAssignedSkills = await mongoService.aggregation(
      "AssignSkill",
      pipeline
    );

    const assignedSkillIds = new Set(
      getAssignedSkills.map((skill) => skill.skillId.toString())
    );

    if (getTeacherSkills) {
      getTeacherSkills = getTeacherSkills.map((teacherSkill) => {
        const isSelected = assignedSkillIds.has(
          teacherSkill?.skillId?._id?.toString()
        );
        return {
          ...teacherSkill,
          isSelected,
        };
      });
    }
    return getTeacherSkills;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const get_all_skill_templates = async (matchQuery) => {
  try {
    const populateQuery = [
      { path: "skillId", select: "title", match: { isDeleted: false } },
    ];

    let getTeacherSkills = await mongoService.populate(
      "TeacherSkill",
      { teacherId: { $ne: matchQuery.teacherId }, status: "active" },
      {},
      { sort: { createdAt: -1 } },
      populateQuery
    );

    let pipeline = [
      {
        $match: {
          studentId: new mongoose.Types.ObjectId(matchQuery.studentId),
          teacherId: new mongoose.Types.ObjectId(matchQuery.teacherId),
        },
      },
    ];

    const getAssignedSkills = await mongoService.aggregation(
      "AssignSkill",
      pipeline
    );

    const assignedSkillIds = new Set(
      getAssignedSkills.map((skill) => skill.skillId.toString())
    );

    if (getTeacherSkills) {
      getTeacherSkills = getTeacherSkills.map((teacherSkill) => {
        const isSelected = assignedSkillIds.has(
          teacherSkill?.skillId?._id?.toString()
        );
        return {
          ...teacherSkill,
          isSelected,
        };
      });

      getTeacherSkills = getTeacherSkills.filter((val) => val.skillId !== null);
    }
    return getTeacherSkills;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const get_single_assigned = async (query) => {
  try {
    return await mongoService.findOne("AssignSkill", query);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const get_assigned_skills = async (matchQuery) => {
  try {
    let pipeline = [
      {
        $match: {
          studentId: new mongoose.Types.ObjectId(matchQuery.studentId),
          teacherId: new mongoose.Types.ObjectId(matchQuery.teacherId),
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "skills",
          localField: "skillId",
          foreignField: "_id",
          as: "skillDetails",
          pipeline: [
            {
              $lookup: {
                from: "instruments",
                localField: "instrument",
                foreignField: "_id",
                as: "instrumentDetails",
                pipeline: [{ $project: { name: 1 } }],
              },
            },
            {
              $project: {
                title: 1,
                description: 1,
                instrumentName: {
                  $ifNull: [
                    { $arrayElemAt: ["$instrumentDetails.name", 0] },
                    null,
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          teacherId: 1,
          studentId: 1,
          skillId: 1,
          is_active: 1,
          is_completed: 1,
          is_deleted: 1,
          meetId:1,
          title: {
            $ifNull: [{ $arrayElemAt: ["$skillDetails.title", 0] }, null],
          },
          description: {
            $ifNull: [{ $arrayElemAt: ["$skillDetails.description", 0] }, null],
          },
          createdAt: 1,
          instrumentName: {
            $ifNull: [
              { $arrayElemAt: ["$skillDetails.instrumentName", 0] },
              null,
            ],
          },
        },
      },
    ];

    const getAssignedSkills = await mongoService.aggregation(
      "AssignSkill",
      pipeline
    );

    return getAssignedSkills;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const update_assigned_skill = async (query, payload) => {
  try {
    return await mongoService.updateOne("AssignSkill", query, payload);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getStudentInfo = async (studentId) => {
  try {
    let pipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(studentId) } },
      {
        $lookup: {
          from: "instruments",
          localField: "instruments",
          foreignField: "_id",
          as: "instruments",
          pipeline: [{ $project: { name: 1 } }],
        },
      },
      {
        $unwind: {
          path: "$instruments",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "studentdetails",
          localField: "_id",
          foreignField: "studentId",
          as: "studentInfo",
          pipeline: [
            {
              $project: {
                studentId: 1,
                RBA_ACCOUNT: 1,
                RBA_PROFILE: 1,
                pro_rate_charge: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$studentInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "location",
          pipeline: [{ $project: { name: 1 } }],
        },
      },
      {
        $unwind: {
          path: "$location",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "plans",
          localField: "selectedPlan",
          foreignField: "_id",
          as: "selectedPlan",
          pipeline: [{ $project: { title: 1, price: 1 } }],
        },
      },
      {
        $unwind: {
          path: "$selectedPlan",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "studentteachers",
          localField: "_id",
          foreignField: "studentId",
          as: "teachers",
          pipeline: [
            { $match: { teacherId: "active" } },
            {
              $lookup: {
                from: "users",
                localField: "teacherId",
                foreignField: "_id",
                as: "teacherId",
                pipeline: [
                  { $project: { firstName: 1, lastName: 1, email: 1 } },
                ],
              },
            },
            { $unwind: "$teacherId" },
            {
              $project: {
                _id: 1,
                teacherId: 1,
                status: { $ifNull: ["$status", "active"] },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "studentparents",
          localField: "_id",
          foreignField: "studentId",
          as: "studentParents",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "parentId",
                foreignField: "_id",
                as: "parentId",
                pipeline: [
                  {
                    $project: {
                      firstName: 1,
                      lastName: 1,
                      email: 1,
                      phoneNumber: 1,
                    },
                  },
                ],
              },
            },
            { $unwind: "$parentId" },
            {
              $project: {
                _id: 1,
                parentId: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$studentParents",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: { password: 0, updatedAt: 0, __v: 0 },
      },
    ];

    const details = await mongoService.aggregation("Users", pipeline);

    return details;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getStudentReport = async (query) => {
  try {
    let pipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(query.studentId) } },
      {
        $lookup: {
          from: "instruments",
          localField: "instruments",
          foreignField: "_id",
          as: "instruments",
          pipeline: [{ $project: { name: 1 } }],
        },
      },
      {
        $unwind: {
          path: "$instruments",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "studentdetails",
          localField: "_id",
          foreignField: "studentId",
          as: "studentInfo",
          pipeline: [
            {
              $project: {
                studentId: 1,
                RBA_ACCOUNT: 1,
                RBA_PROFILE: 1,
                pro_rate_charge: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$studentInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "location",
          pipeline: [{ $project: { name: 1 } }],
        },
      },
      {
        $unwind: {
          path: "$location",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "plans",
          localField: "selectedPlan",
          foreignField: "_id",
          as: "selectedPlan",
          pipeline: [{ $project: { title: 1, price: 1 } }],
        },
      },
      {
        $unwind: {
          path: "$selectedPlan",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "studentteachers",
          localField: "_id",
          foreignField: "studentId",
          as: "teachers",
          pipeline: [
            // { $match: { teacherId: new mongoose.Types.ObjectId(query.teacherId)} },
            {
              $lookup: {
                from: "users",
                localField: "teacherId",
                foreignField: "_id",
                as: "teacherId",
                pipeline: [
                  { $project: { firstName: 1, lastName: 1, email: 1 } },
                ],
              },
            },
            { $unwind: "$teacherId" },
            {
              $project: {
                _id: 1,
                teacherId: 1,
                status: { $ifNull: ["$status", "active"] },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "studentparents",
          localField: "_id",
          foreignField: "studentId",
          as: "studentParents",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "parentId",
                foreignField: "_id",
                as: "parentId",
                pipeline: [
                  {
                    $project: {
                      firstName: 1,
                      lastName: 1,
                      email: 1,
                      phoneNumber: 1,
                    },
                  },
                ],
              },
            },
            { $unwind: "$parentId" },
            {
              $project: {
                _id: 1,
                parentId: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$studentParents",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: { password: 0, updatedAt: 0, __v: 0 },
      },
    ];

    const details = await mongoService.aggregation("Users", pipeline);

    return details;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getStudentReportData = async (query) => {
  try {
    let pipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(query.studentId) } },
      {
        $lookup: {
          from: "instruments",
          localField: "instruments",
          foreignField: "_id",
          as: "instruments",
          pipeline: [{ $project: { name: 1 } }],
        },
      },
      {
        $unwind: {
          path: "$instruments",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "studentdetails",
          localField: "_id",
          foreignField: "studentId",
          as: "studentInfo",
          pipeline: [
            {
              $project: {
                studentId: 1,
                RBA_ACCOUNT: 1,
                RBA_PROFILE: 1,
                pro_rate_charge: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$studentInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "location",
          pipeline: [{ $project: { name: 1 } }],
        },
      },
      {
        $unwind: {
          path: "$location",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "plans",
          localField: "selectedPlan",
          foreignField: "_id",
          as: "selectedPlan",
          pipeline: [{ $project: { title: 1, price: 1 } }],
        },
      },
      {
        $unwind: {
          path: "$selectedPlan",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "studentteachers",
          localField: "_id",
          foreignField: "studentId",
          as: "teachers",
          pipeline: [
            {
              $match: {
                teacherId: new mongoose.Types.ObjectId(query.teacherId),
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "teacherId",
                foreignField: "_id",
                as: "teacherId",
                pipeline: [
                  { $project: { firstName: 1, lastName: 1, email: 1 } },
                ],
              },
            },
            { $unwind: "$teacherId" },
            {
              $project: {
                _id: 1,
                teacherId: 1,
                status: { $ifNull: ["$status", "active"] },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "studentparents",
          localField: "_id",
          foreignField: "studentId",
          as: "studentParents",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "parentId",
                foreignField: "_id",
                as: "parentId",
                pipeline: [
                  {
                    $project: {
                      firstName: 1,
                      lastName: 1,
                      email: 1,
                      phoneNumber: 1,
                    },
                  },
                ],
              },
            },
            { $unwind: "$parentId" },
            {
              $project: {
                _id: 1,
                parentId: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$studentParents",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: { password: 0, updatedAt: 0, __v: 0 },
      },
    ];

    const details = await mongoService.aggregation("Users", pipeline);

    return details;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateStudentReport = async (query, payload) => {
  try {
    return await mongoService.updateOne("Users", query, payload);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateStudentDetails = async (query, payload) => {
  try {
    return await mongoService.updateOne("StudentDetails", query, payload);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getStudentCount = async (query) => {
  try {
    return await mongoService.countDocument("StudentTeacher", query);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const fetchAllStudentsOfTeacher = async (query) => {
  try {
    return await mongoService.findAll("StudentTeacher", query);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const fetchYearlyData = async (signUpStudentList) => {
  try {
    let signUpStudentCount = [],
      monthCounts = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
    const currentYear = moment().year();
    for (let month = 0; month < 12; month++) {
      const startDate = moment()
        .year(currentYear)
        .month(month)
        .startOf("month")
        .format("YYYY-MM-DD");
      const endDate = moment()
        .year(currentYear)
        .month(month)
        .endOf("month")
        .format("YYYY-MM-DD");

      if (signUpStudentList.length) {
        const studentData = signUpStudentList.filter((val) => {
          const formattedDate = moment(val.createdAt).format("YYYY-MM-DD");
          return formattedDate >= startDate && formattedDate <= endDate;
        });
        signUpStudentCount.push(studentData.length);
      }
    }

    return (yearlyData = monthCounts.map((ele, i) => {
      return {
        month: ele,
        signupStudentCounts: signUpStudentCount[i] || 0,
      };
    }));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  storeStudent,
  checkStudent,
  teachersStudentIds,
  studentList,
  updateStudent,
  checkIsExits,
  skillDetails,
  removeDocuments,
  updateSkillDetails,
  teacherList,
  studentsTeacherIds,
  store_skill,
  teachersSkillIds,
  skillList,
  update_teacher_skill,
  deleteTeacherSkill,
  deleteSkill,
  manageAssignedSkill,
  get_skill_templates,
  get_assigned_skills,
  get_single_assigned,
  update_assigned_skill,
  getAllTeachersStudentIds,
  deleteStudentTeacher,
  get_all_skill_templates,
  getStudentInfo,
  updateStudentReport,
  updateStudentDetails,
  getStudentReport,
  getStudentReportData,
  get_single_teacher_skill,
  removeAssignedSkill,
  getStudentCount,
  fetchAllStudentsOfTeacher,
  fetchYearlyData,
  studentData,
};
