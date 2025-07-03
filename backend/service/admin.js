const { default: mongoose } = require("mongoose");
const mongoService = require("../config/mongoService");
const moment = require("moment");
const ReportModel = require("../models/report");

const fetchAllRecords = async () => {
  try {
    const result = await ReportModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "studentInfo",
        },
      },
      {
        $unwind: {
          path: "$studentInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          studentName: "$studentInfo.name",
        },
      },
    ]);

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const getAllrecords = async (model, payload) => {
  try {
    return await mongoService.findAll(model, { ...payload });
  } catch (error) {
    throw error;
  }
};

const checkOption = async (model, payload) => {
  try {
    // return await mongoService.findOne(model, { ...payload, isDeleted: false });
    return await mongoService.findOne(model, { ...payload });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const storeOption = async (model, payload) => {
  try {
    return await mongoService.createOne(model, payload);
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const storeActionTake = async (model, payload) => {
  try {
    return await mongoService.createOne(model, payload);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const fetchOptions = async (
  model,
  match,
  populateQuery,
  options,
  limit,
  offset
) => {
  try {
    return await mongoService.optionalPagination(
      model,
      match,
      {},
      options,
      populateQuery,
      limit,
      offset,
      { createdAt: -1 }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteOption = async (model, match) => {
  try {
    return await mongoService.deleteOne(model, match);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateOption = async (model, match, payload) => {
  try {
    return await mongoService.updateOne(model, match, payload);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const fetchAllUsers = async (reqBody) => {
  try {
    const { limit, offset, search, role, sortBy, order } = reqBody;
    const limitData = parseInt(limit, 10) || 10;
    const offsetData = parseInt(offset, 10) || 0;

    let query = { isDeleted: false, role: { $ne: "admin" } };
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      query.role = role;
    }

    const orderBy = order || -1;

    let pipeline = [
      { $match: query },
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
          from: "studentteachers",
          localField: "_id",
          foreignField: "teacherId",
          as: "teacherActiveStudent",
          pipeline: [
            // Fetch only active students
            { $match: { status: "active", is_follow: true } },
            {
              $group: {
                _id: "$teacherId",
                activeStudentCount: { $sum: 1 }, // Count active students
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "plans",
          localField: "selectedPlan",
          foreignField: "_id",
          as: "selectedPlan",
          pipeline: [
            { $project: { title: 1, planImage: 1, description: 1, price: 1 } },
          ],
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
          from: "transactions",
          localField: "activePlan",
          foreignField: "subscriptionId",
          as: "activePlan",
          pipeline: [
            { $match: { isDeleted: 0 } },
            { $sort: { createdAt: -1 } }, // Sort by createdAt to get the latest plan
            { $limit: 1 }, // Get only the most recent plan
            {
              $addFields: {
                daysUntilRenewal: {
                  $cond: [
                    { $gte: ["$expiredDate", new Date()] }, // If expireDate is in the future
                    {
                      $round: [
                        {
                          $divide: [
                            {
                              $subtract: [
                                { $toDate: "$expiredDate" },
                                new Date(),
                              ],
                            }, // Ensure proper date comparison
                            1000 * 60 * 60 * 24, // Convert milliseconds to days
                          ],
                        },
                        0, // Round to the nearest whole number
                      ],
                    },
                    0, // If expiredDate has already passed, set to 0
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$activePlan",
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
            // { $match: { status: "active" } },
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
                status: 1,
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
        $lookup: {
          from: "studentlessons",
          localField: "_id",
          foreignField: "teachers",
          as: "lessons",
          pipeline: [
            {
              $match: {
                date: {
                  $gte: moment().startOf("month").format("YYYY-MM-DD"),
                  $lte: moment().endOf("month").format("YYYY-MM-DD"),
                },
              },
            },
            {
              $addFields: {
                lessonDuration: {
                  $divide: [
                    {
                      $subtract: [
                        { $toDate: { $concat: ["$date", " ", "$endTime"] } },
                        { $toDate: { $concat: ["$date", " ", "$startTime"] } },
                      ],
                    },
                    1000 * 60 * 60, // Convert milliseconds to hours
                  ],
                },
              },
            },
            {
              $group: {
                _id: "$teachers",
                totalWorkingHours: { $sum: "$lessonDuration" },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$lessons",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          totalWorkingHours: "$lessons.totalWorkingHours",
        },
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          profileImage: 1,
          phoneNumber: 1,
          isActive: 1,
          location: 1,
          role: 1,
          // age:1,
          date_of_birth: 1,
          studentParents: 1,
          relation: 1,
          teachers: 1,
          paymentStatus: 1,
          selectedPlan: 1,
          hasSubscriptionPlan: 1,
          createdAt: 1,
          lessons: 1,
          activePlan: 1,
          totalWorkingHours: 1,
          activeStudentCount: {
            $arrayElemAt: ["$teacherActiveStudent.activeStudentCount", 0], // Extract the active student count
          },
          sortField: {
            $cond: [
              { $ifNull: ["$firstName", false] },
              {
                $concat: [
                  {
                    $toUpper: {
                      $substrCP: ["$firstName", 0, 1],
                    },
                  },
                  {
                    $substrCP: [
                      "$firstName",
                      1,
                      { $subtract: [{ $strLenCP: "$firstName" }, 1] },
                    ],
                  },
                ],
              },
              {
                $concat: [
                  {
                    $toUpper: {
                      $substrCP: ["$lastName", 0, 1],
                    },
                  },
                  {
                    $substrCP: [
                      "$lastName",
                      1,
                      { $subtract: [{ $strLenCP: "$lastName" }, 1] },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      { $sort: { sortField: orderBy } },
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
    console.log(
      "...",
      new Date(moment().startOf("month").format("YYYY-MM-DD"))
    );

    //     let pipeline = [
    //       { $match: query },
    //       {
    //         $lookup: {
    //           from: "locations",
    //           localField: "location",
    //           foreignField: "_id",
    //           as: "location",
    //           pipeline: [{ $project: { name: 1 } }],
    //         },
    //       },
    //       {
    //         $unwind: {
    //           path: "$location",
    //           preserveNullAndEmptyArrays: true,
    //         },
    //       },
    //       {
    //         $lookup: {
    //           from: "plans",
    //           localField: "selectedPlan",
    //           foreignField: "_id",
    //           as: "selectedPlan",
    //           pipeline: [
    //             { $project: { title: 1, planImage: 1, description: 1, price: 1 } },
    //           ],
    //         },
    //       },
    //       {
    //         $unwind: {
    //           path: "$selectedPlan",
    //           preserveNullAndEmptyArrays: true,
    //         },
    //       },
    //       {
    //         $lookup: {
    //           from: "transactions",
    //           localField: "activePlan",
    //           foreignField: "subscriptionId",
    //           as: "activePlan",
    //           pipeline: [
    //             { $match: { isDeleted: 0 } },
    //             { $sort: { createdAt: -1 } },
    //             { $limit: 1 },
    //             {
    //               $addFields: {
    //                 daysUntilRenewal: {
    //                   $cond: [
    //                     { $gte: ["$expiredDate", new Date()] },
    //                     {
    //                       $round: [
    //                         {
    //                           $divide: [
    //                             { $subtract: [{$toDate: "$expiredDate"}, new Date()] },
    //                             1000 * 60 * 60 * 24,
    //                           ],
    //                         },
    //                         0,
    //                       ],
    //                     },
    //                     0,
    //                   ],
    //                 },
    //               },
    //             },
    //           ],
    //         },
    //       },
    //       {
    //         $unwind: {
    //           path: "$activePlan",
    //           preserveNullAndEmptyArrays: true,
    //         },
    //       },
    //       {
    //         $lookup: {
    //           from: "studentteachers",
    //           localField: "_id",
    //           foreignField: "studentId",
    //           as: "teachers",
    //           pipeline: [
    //             {
    //               $lookup: {
    //                 from: "users",
    //                 localField: "teacherId",
    //                 foreignField: "_id",
    //                 as: "teacherId",
    //                 pipeline: [
    //                   { $project: { firstName: 1, lastName: 1, email: 1 } },
    //                 ],
    //               },
    //             },
    //             { $unwind: "$teacherId" },
    //             {
    //               $project: {
    //                 _id: 1,
    //                 teacherId: 1,
    //                 status: 1,
    //               },
    //             },
    //           ],
    //         },
    //       },
    //       {
    //         $lookup: {
    //           from: "studentparents",
    //           localField: "_id",
    //           foreignField: "studentId",
    //           as: "studentParents",
    //           pipeline: [
    //             {
    //               $lookup: {
    //                 from: "users",
    //                 localField: "parentId",
    //                 foreignField: "_id",
    //                 as: "parentId",
    //                 pipeline: [
    //                   {
    //                     $project: {
    //                       firstName: 1,
    //                       lastName: 1,
    //                       email: 1,
    //                       phoneNumber: 1,
    //                     },
    //                   },
    //                 ],
    //               },
    //             },
    //             { $unwind: "$parentId" },
    //             {
    //               $project: {
    //                 _id: 1,
    //                 parentId: 1,
    //               },
    //             },
    //           ],
    //         },
    //       },
    //       {
    //         $unwind: {
    //           path: "$studentParents",
    //           preserveNullAndEmptyArrays: true,
    //         },
    //       },
    //       {
    //         $lookup: {
    //           from: "studentlessons",
    //           localField: "_id",
    //           foreignField: "teachers",
    //           as: "teacherLessons",
    //           pipeline: [
    //             {
    //               $match: {
    //                 date: {
    //                   $gte: currentMonthStart.toISOString(),
    //                   $lt: nextMonthStart.toISOString(),
    //                 },
    //               },
    //             },
    //             {
    //               $addFields: {
    //                 lessonDuration: {
    //                   $divide: [
    //                     {
    //                       $subtract: [
    //                         {
    //                           $dateFromString: {
    //                             dateString: {
    //                               $concat: [
    //                                 "$date",
    //                                 "T",
    //                                 { $trim: { input: "$endTime" } }, // Trim spaces from endTime
    //                               ],
    //                             },
    //                             format: "%Y-%m-%dT%I:%M %p",
    //                           },
    //                         },
    //                         {
    //                           $dateFromString: {
    //                             dateString: {
    //                               $concat: [
    //                                 "$date",
    //                                 "T",
    //                                 { $trim: { input: "$startTime" } }, // Trim spaces from startTime
    //                               ],
    //                             },
    //                             format: "%Y-%m-%dT%I:%M %p",
    //                           },
    //                         },
    //                       ],
    //                     },
    //                     1000 * 60, // Convert milliseconds to minutes
    //                   ],
    //                 },
    //               },
    //             },
    //             {
    //               $project: {
    //                 _id: 0,
    //                 lessonDuration: 1,
    //               },
    //             },
    //           ],
    //         },
    //       }

    // ,
    //       {
    //         $unwind: {
    //           path: "$teacherLessons",
    //           preserveNullAndEmptyArrays: true,
    //         },
    //       },
    //       // Calculate total working minutes for lessons
    //       {
    //         $group: {
    //           _id: "$_id",
    //           totalWorkingMinutes: { $sum: "$teacherLessons.lessonDuration" },
    //           data: { $first: "$$ROOT" }, // Retain original document
    //         },
    //       },
    //       {
    //         $addFields: {
    //           "data.totalWorkingHours": { $divide: ["$totalWorkingMinutes", 60] },
    //           "data.totalMinutesRemaining": { $mod: ["$totalWorkingMinutes", 60] },
    //         },
    //       },
    //       {
    //         $replaceRoot: { newRoot: "$data" }, // Restore original document structure
    //       },
    //       {
    //         $project: {
    //           totalWorkingMinutes: 0,
    //         },
    //       },
    //       {
    //         $addFields: {
    //           sortField: {
    //             $cond: [
    //               { $ifNull: ["$firstName", false] },
    //               { $toUpper: "$firstName" },
    //               { $toUpper: "$lastName" },
    //             ],
    //           },
    //         },
    //       },
    //       { $sort: { sortField: orderBy } },
    //       {
    //         $group: {
    //           _id: null,
    //           totalCount: { $sum: 1 },
    //           results: { $push: "$$ROOT" },
    //         },
    //       },
    //       {
    //         $project: {
    //           _id: 0,
    //           totalCount: 1,
    //           data: { $slice: ["$results", offsetData, limitData] },
    //         },
    //       },
    //     ];

    let data = await mongoService.aggregation("Users", pipeline);

    return (data = !data.length ? [{ totalCount: 0, data: [] }] : data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const lessonList = async (payload, limit, offset) => {
  try {
    let populate = [
      {
        path: "location",
        select: "name locationType",
      },
      {
        path: "teachers",
        select: "firstName lastName email phoneNumber",
      },
    ];

    return await mongoService.optionalPagination(
      "Lessons",
      payload,
      {},
      {
        select:
          "colorCode title type meetLink startTime endTime day description createdAt",
      },
      populate,
      limit,
      offset,
      { createdAt: -1 }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const lessonWiseStudent = async () => {
  try {
    let pipeline = [
      { $match: { isDeleted: false } },
      {
        $lookup: {
          from: "studentlessons",
          localField: "_id",
          foreignField: "lessonId",
          as: "studentLesson",
          pipeline: [
            { $match: { isDeleted: false } },
            {
              $lookup: {
                from: "users",
                localField: "studentId",
                foreignField: "_id",
                as: "student",
                pipeline: [
                  {
                    $project: {
                      firstName: 1,
                      lastName: 1,
                      email: 1,
                      role: 1,
                      phoneNumber: 1,
                    },
                  },
                ],
              },
            },
            { $unwind: "$student" },
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
                from: "users",
                localField: "teachers",
                foreignField: "_id",
                as: "teachers",
                pipeline: [
                  {
                    $project: {
                      firstName: 1,
                      lastName: 1,
                      email: 1,
                      role: 1,
                      phoneNumber: 1,
                    },
                  },
                ],
              },
            },
            {
              $project: {
                day: 1,
                teachers: 1,
                student: 1,
                studentPresent: 1,
                teacherPresent: 1,
                location: 1,
                appointmentNote: 1,
                clientNote: 1,
                studentShow: 1,
                date: 1,
                endTime: 1,
                startTime: 1,
                meetLink: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          studentLesson: 1,
          colorCode: 1,
          title: 1,
          type: 1,
          description: 1,
        },
      },
    ];
    return await mongoService.aggregation("Lessons", pipeline);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const studentLessonDetails = async (id) => {
  try {
    let pipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "student",
          pipeline: [
            {
              $project: {
                firstName: 1,
                lastName: 1,
                email: 1,
                role: 1,
                phoneNumber: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$student",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "lessons",
          localField: "lessonId",
          foreignField: "_id",
          as: "lesson",
          pipeline: [
            { $project: { title: 1, type: 1, colorCode: 1, description: 1 } },
          ],
        },
      },
      {
        $unwind: {
          path: "$lesson",
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
          from: "users",
          localField: "teachers",
          foreignField: "_id",
          as: "teachers",
          pipeline: [
            { $project: { firstName: 1, lastName: 1, email: 1, role: 1 } },
          ],
        },
      },
      {
        $lookup: {
          from: "studentlessons",
          let: { appointmentDate: "$date", studentId: "$studentId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$studentId", "$$studentId"] },
                    { $lt: ["$date", "$$appointmentDate"] },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: "lessons",
                localField: "lessonId",
                foreignField: "_id",
                as: "lesson",
                pipeline: [{ $project: { title: 1, type: 1 } }],
              },
            },
            {
              $unwind: {
                path: "$lesson",
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
            { $sort: { date: -1 } },
            { $limit: 1 },
            {
              $project: {
                lesson: 1,
                location: 1,
                date: 1,
                startTime: 1,
                endTime: 1,
              },
            },
          ],
          as: "previousAppointment",
        },
      },
      {
        $lookup: {
          from: "studentlessons",
          let: { appointmentDate: "$date", studentId: "$studentId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$studentId", "$$studentId"] },
                    { $gt: ["$date", "$$appointmentDate"] },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: "lessons",
                localField: "lessonId",
                foreignField: "_id",
                as: "lesson",
                pipeline: [{ $project: { title: 1, type: 1 } }],
              },
            },
            {
              $unwind: {
                path: "$lesson",
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
            { $sort: { date: 1 } },
            { $limit: 1 },
            {
              $project: {
                lesson: 1,
                location: 1,
                date: 1,
                startTime: 1,
                endTime: 1,
              },
            },
          ],
          as: "nextAppointment",
        },
      },
      {
        $project: {
          lesson: 1,
          student: 1,
          date: 1,
          day: 1,
          startTime: 1,
          endTime: 1,
          teachers: 1,
          meetLink: 1,
          studentPresent: 1,
          teacherPresent: 1,
          studentShow: 1,
          location: 1,
          previousAppointment: { $arrayElemAt: ["$previousAppointment", 0] },
          nextAppointment: { $arrayElemAt: ["$nextAppointment", 0] },
        },
      },
    ];
    return await mongoService.aggregation("StudentLesson", pipeline);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const handleStudentTeacherUpdate = async (
  newTeacherIds,
  currentTeacherIds,
  studentId
) => {
  try {
    const teachersToAdd = newTeacherIds.filter(
      (id) => !currentTeacherIds.includes(id)
    );
    const teachersToRemove = currentTeacherIds.filter(
      (id) => !newTeacherIds.includes(id)
    );

    // Add new teachers
    const addPromises = teachersToAdd?.map(
      (teacherId) =>
        mongoService.updateOne(
          "StudentTeacher",
          { studentId, teacherId },
          { is_follow: false },
          { upsert: true, new: true }
        )
      // mongoService.updateOne("StudentTeacher", { studentId, teacherId }, { status: "active" }, { upsert: true, new: true })
    );

    // Mark removed teachers as 'deleted'
    const removePromises = teachersToRemove?.map((teacherId) =>
      // await teacherService.deleteStudentTeacher({ teacherId: userId, studentId },)
      mongoService.deleteData("StudentTeacher", { studentId, teacherId })
    );

    return await Promise.all([...addPromises, ...removePromises]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createTransaction = async (payload) => {
  try {
    return await mongoService.createOne("Transaction", payload);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateTransaction = async (payload, data) => {
  try {
    return await mongoService.updateOne("Transaction", payload, data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const fetchTransaction = async (query) => {
  try {
    return await mongoService.findOne(
      "Transaction",
      query,
      {},
      { sort: { createdAt: -1 } }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const get_virtual_consultation = async (query) => {
  const { limit, offset, search } = query;
  const limitData = parseInt(limit, 10) || 10;
  const offsetData = parseInt(offset, 10) || 0;

  let searchQuery = {};
  if (search) {
    searchQuery.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  let pipeline = [
    {
      $lookup: {
        from: "users",
        localField: "studentId",
        foreignField: "_id",
        as: "studentDetails",
        pipeline: [
          { $match: searchQuery },
          { $project: { firstName: 1, lastName: 1, email: 1 } },
        ],
      },
    },
    {
      $match: { studentDetails: { $gt: [] } },
    },
    {
      $unwind: {
        path: "$studentDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    { $sort: { createdAt: -1 } },
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

  let data = await mongoService.aggregation("VirtualConsultation", pipeline);
  return (data = !data.length ? [{ totalCount: 0, data: [] }] : data);
};

const addStudentParent = async (payload) => {
  try {
    return await mongoService.createOne("StudentParent", payload);
  } catch (error) {
    throw error;
  }
};

const studentList = async (match) => {
  try {
    let query = { isDeleted: false, role: "student", ...match };

    let pipeline = [
      { $match: query },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          role: 1,
          date_of_birth: 1,
          phoneNumber: 1,
          isActive: 1,
          createdAt: 1,
          profileImage: 1,
        },
      },
    ];
    return await mongoService.aggregation("Users", pipeline);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  checkOption,
  storeOption,
  fetchOptions,
  deleteOption,
  updateOption,
  fetchAllUsers,
  lessonList,
  studentLessonDetails,
  lessonWiseStudent,
  handleStudentTeacherUpdate,
  createTransaction,
  get_virtual_consultation,
  addStudentParent,
  studentList,
  fetchTransaction,
  updateTransaction,
  fetchAllRecords,
  storeActionTake,
  getAllrecords
};
