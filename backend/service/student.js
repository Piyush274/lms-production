const { default: mongoose } = require("mongoose");
const mongoService = require("../config/mongoService");
const { userService } = require(".");
const { location_type } = require("../utils/constants");

const checkSkill = async (payload) => {
  try {
    return await mongoService.findOne("AssignSkill", payload);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const mySkills = async (query, sortQuery) => {
  try {
    // const limitData = parseInt(limit, 10) || 10;
    // const offsetData = parseInt(offset, 10) || 0;

    // switch (type) {
    //   case "active":
    //     query.is_active = true;
    //     break;
    //   case "inactive":
    //     query.is_active = false;
    //     break;
    //   case "completed":
    //     query.is_completed = true;
    //     break;
    //   default:
    // }

    let pipeline = [
      { $match: query },
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
      { $sort: sortQuery },
      // {
      //   $group: {
      //     _id: null,
      //     totalCount: { $sum: 1 },
      //     results: { $push: "$$ROOT" },
      //   },
      // },
      // {
      //   $project: {
      //     _id: 0,
      //     totalCount: 1,
      //     // data: { $slice: ["$results", offsetData, limitData] },
      //   },
      // },
    ];

    let data = await mongoService.aggregation("AssignSkill", pipeline);
    // return (data = !data.length ? [{ totalCount: 0, data: [] }] : data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const skillCounts = async (query) => {
  try {
    return await mongoService.countDocument("AssignSkill", query);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const fetchStudentInstruments = async (studentId) => {
  try {
    const pipeline = [
      {
        $match: {
          studentId: new mongoose.Types.ObjectId(studentId),
          is_deleted: false,
        },
      },
      {
        $lookup: {
          from: "skills",
          localField: "skillId",
          foreignField: "_id",
          as: "skill",
          pipeline: [{ $project: { instrument: 1 } }],
        },
      },
      { $unwind: "$skill" },
      {
        $group: {
          _id: "$skill.instrument",
        },
      },
      {
        $lookup: {
          from: "instruments",
          localField: "_id",
          foreignField: "_id",
          as: "instrument",
          pipeline: [{ $project: { name: 1, instrumentImage: 1 } }],
        },
      },
      { $unwind: "$instrument" },
      {
        $project: {
          _id: "$instrument._id",
          name: "$instrument.name",
          instrumentImage: "$instrument.instrumentImage",
        },
      },
    ];
    // 6735be79d215bd19f7073a4a
    let skillsInstruments = await mongoService.aggregation(
      "AssignSkill",
      pipeline
    );
    let primaryInstrument = await userService.userDetails({ _id: studentId });

    let primaryInstrumentData =
      primaryInstrument.instruments.length > 0
        ? primaryInstrument.instruments[0]
        : null;
    if (primaryInstrumentData) {
      skillsInstruments = skillsInstruments.filter(
        (instrument) => !instrument._id.equals(primaryInstrumentData._id)
      );
      return [primaryInstrumentData, ...skillsInstruments];
    }
    return skillsInstruments;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const add_virtual_consultation = async (payload) => {
  try {
    return await mongoService.createOne("VirtualConsultation", payload);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getChildData = async (query) => {
  try {
    let matchQuery = { parentId: query.parentId };
    let populate = [
      {
        path: "studentId",
        select: "firstName lastName",
      },
    ];
    return await mongoService.populate(
      "StudentParent",
      matchQuery,
      { select: { parentId: 1, studentId: 1 } },
      {},
      populate
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAssignedSkill = async (query) => {
  try {
    return await mongoService.findOne("AssignSkill", query);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const storeHistory = async (payload) => {
  try {
    return await mongoService.createOne("assignedSkillHistory", payload);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const studentAssignedSkillDetails = async (query) => {
  try {
    let populateQuery = [
      {
        path: "teacherId",
        select: "location",
        populate: [
          {
            path: "location",
            select: "name locationType",
          },
        ],
      },
      {
        path: "skillId",
        select:
          "title description personalTutorials tutorialVideos supportingDocuments externalVideos notes status isDeleted",
        populate: [
          {
            path: "instrument",
            select: "name",
          },
          {
            path: "category",
            select: "name",
          },
        ],
      },
      // {
      //     path: "studentId",
      //     select: "name",
      // },
    ];

    let data = await mongoService.findOneLean(
      "AssignSkill",
      { studentId: query.studentId, skillId: query.skillId },
      {},
      {
        select:
          "teacherId studentId studentResponseVideo is_active is_completed status is_deleted",
      },
      populateQuery
    );

    if (data?.teacherId?.location?.locationType === location_type.online) {
      const studentTeacher = await mongoService.findOne("StudentTeacher", {
        teacherId: data?.teacherId?._id,
        studentId: query.studentId,
      });

      if (studentTeacher) {
        data.meeting_link = studentTeacher?.meeting_link;
      }
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const teacherAssignedSkillDetails = async (query) => {
  try {
    return await mongoService.findOne("AssignSkill", query);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getStudentSkillHistory = async (query) => {
  try {
    let matchQuery = {
      studentId: new mongoose.Types.ObjectId(query.studentId),
    };

    if (query?.status) {
      matchQuery = {
        ...matchQuery,
        status: query?.status,
      };
    }

    let pipeline = [
      { $match: matchQuery },
      {
        $lookup: {
          from: "skills",
          localField: "skillId",
          foreignField: "_id",
          as: "skillDetails",
          pipeline: [
            {
              $project: {
                title: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$skillDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
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
          teacherId: 1,
          studentId: 1,
          skillId: 1,
          status: 1,
          studentName: {
            $concat: [
              { $ifNull: ["$studentDetails.firstName", ""] },
              " ",
              { $ifNull: ["$studentDetails.lastName", ""] },
            ],
          },
          title: "$skillDetails.title",
          createdAt: 1,
        },
      },
      { $sort: query.sortQuery },
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
          data: "$results",
        },
      },
    ];
    let data = await mongoService.aggregation("assignedSkillHistory", pipeline);
    return (data = !data.length ? [{ totalCount: 0, data: [] }] : data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getParentSkillHistory = async (query) => {
  try {
    const limitData = parseInt(query.limit, 10) || 10;
    const offsetData = parseInt(query.offset, 10) || 0;

    let populate = [
      {
        path: "studentId",
        select: "firstName lastName",
      },
    ];

    const studentList = await mongoService.populate(
      "StudentParent",
      { parentId: query.parentId },
      { select: { parentId: 1, studentId: 1 } },
      {},
      populate
    );

    let studentIds = [];
    if (studentList?.length) {
      studentList.map((val) => {
        studentIds.push(new mongoose.Types.ObjectId(val.studentId._id));
      });
    }

    if (studentIds?.length) {
      let matchQuery = {
        studentId: { $in: studentIds },
      };

      if (query.search) {
        matchQuery.$or = [
          { "skillDetails.title": { $regex: query.search, $options: "i" } },
          {
            "studentDetails.firstName": { $regex: query.search, $options: "i" },
          },
          {
            "studentDetails.lastName": { $regex: query.search, $options: "i" },
          },
        ];
      }

      let pipeline = [
        {
          $lookup: {
            from: "skills",
            localField: "skillId",
            foreignField: "_id",
            as: "skillDetails",
            pipeline: [
              {
                $project: {
                  title: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$skillDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
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
        { $match: matchQuery },
        {
          $project: {
            teacherId: 1,
            studentId: 1,
            skillId: 1,
            status: 1,
            studentName: {
              $concat: [
                { $ifNull: ["$studentDetails.firstName", ""] },
                " ",
                { $ifNull: ["$studentDetails.lastName", ""] },
              ],
            },
            title: "$skillDetails.title",
            createdAt: 1,
          },
        },
        { $sort: query.sortQuery },
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
            data: "$results",
            data: { $slice: ["$results", offsetData, limitData] },
          },
        },
      ];

      let data = await mongoService.aggregation(
        "assignedSkillHistory",
        pipeline
      );
      return (data = !data.length ? [{ totalCount: 0, data: [] }] : data);
    } else {
      return (data = [{ totalCount: 0, data: [] }]);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getTeacherSkillHistory = async (query) => {
  const limitData = parseInt(query.limit, 10) || 10;
  const offsetData = parseInt(query.offset, 10) || 0;

  let matchQuery = {
    teacherId: new mongoose.Types.ObjectId(query.teacherId),
  };

  if (query?.status) {
    matchQuery = {
      ...matchQuery,
      status: query?.status,
    };
  }

  if (query.search) {
    matchQuery.$or = [
      { "skillDetails.title": { $regex: query.search, $options: "i" } },
      { "studentDetails.firstName": { $regex: query.search, $options: "i" } },
      { "studentDetails.lastName": { $regex: query.search, $options: "i" } },
    ];
  }
  let pipeline = [
    {
      $lookup: {
        from: "skills",
        localField: "skillId",
        foreignField: "_id",
        as: "skillDetails",
        pipeline: [
          {
            $project: {
              title: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$skillDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
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
    { $match: matchQuery },
    {
      $project: {
        teacherId: 1,
        studentId: 1,
        skillId: 1,
        status: 1,
        studentName: {
          $concat: [
            { $ifNull: ["$studentDetails.firstName", ""] },
            " ",
            { $ifNull: ["$studentDetails.lastName", ""] },
          ],
        },
        title: "$skillDetails.title",
        createdAt: 1,
      },
    },
    { $sort: query.sortQuery },
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
        data: "$results",
        data: { $slice: ["$results", offsetData, limitData] },
      },
    },
  ];
  let data = await mongoService.aggregation("assignedSkillHistory", pipeline);
  return (data = !data.length ? [{ totalCount: 0, data: [] }] : data);
};

const getChildSkillsCount = async (query) => {
  try {
    const studentList = await mongoService.findAll("StudentParent", {
      parentId: query.parentId,
    });

    let studentIds = [];
    if (studentList?.length) {
      studentList.map((val) => {
        studentIds.push(new mongoose.Types.ObjectId(val.studentId));
      });
    }

    const data = await mongoService.countDocument("AssignSkill", {
      studentId: { $in: studentIds },
    });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const fetchStudentDetails = async (query) => {
  try {
    let pipeline = [
      { $match: query },
      {
        $lookup: {
          from: "studentteachers",
          localField: "_id",
          foreignField: "studentId",
          as: "studentTeacher",
        },
      },
    ];

    const data = await mongoService.aggregation("Users", pipeline);
    return data.length ? data[0] : {};
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addStudentReport = async (payload) => {
  try {
    return await mongoService.createOne("Report", payload);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  checkSkill,
  mySkills,
  skillCounts,
  fetchStudentInstruments,
  add_virtual_consultation,
  add_virtual_consultation,
  getChildData,
  getAssignedSkill,
  storeHistory,
  getStudentSkillHistory,
  getParentSkillHistory,
  getTeacherSkillHistory,
  studentAssignedSkillDetails,
  teacherAssignedSkillDetails,
  getChildSkillsCount,
  fetchStudentDetails,
  addStudentReport,
};
