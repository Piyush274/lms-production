const mongoose = require("mongoose");
const mongoService = require("../config/mongoService");

const checkUser = async (payload) => {
  try {
    return await mongoService.findOne("Users", {
      ...payload,
      isDeleted: false,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const notificationList = async (payload) => {
  try {
    return await mongoService.findAll(
      "Notification",
      {
        ...payload,
        isDeleted: false,
      },
      {},
      { sort: { createdAt: -1 } }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateUser = async (query, payload) => {
  try {
    return await mongoService.updateMany("Users", query, payload);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const checkTeachers = async (payload) => {
  try {
    return await mongoService.findAll("Users", {
      ...payload,
      isDeleted: false,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const userDetailsForLogin = async (payload) => {
  try {
    return await mongoService.findOne("Users", { ...payload });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const registerUser = async (payload) => {
  try {
    return await mongoService.createOne("Users", payload);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addStudentInfo = async (payload) => {
  try {
    return await mongoService.createOne("StudentDetails", payload);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const userDetails = async (payload) => {
  try {
    let populateQuery = [
      {
        path: "location",
        select: "name locationType",
      },
      {
        path: "selectedPlan",
        select: "title price",
      },
      {
        path: "instruments",
        select: "name instrumentImage",
      },
      {
        path: "studentParent", // Reference to the StudentParent model
        select: "parentId",
        populate: {
          path: "parentId", // Populate parentId from StudentParent
          select: "email firstName lastName phoneNumber profileImage role", // Select desired fields from Users
        },
      },
    ];
    return await mongoService.findOne(
      "Users",
      payload,
      {},
      {
        select:
          "email firstName role isActive createdAt phoneNumber profileImage location lastName date_of_birth parentName parentNumber relation paymentStatus selectedPlan hasSubscriptionPlan isFirstLogin",
      },
      populateQuery
    );

    // return await mongoService.findOne("Users", payload, {}, { select: "email name role isActive createdAt phoneNumber profileImage location lastName age date_of_birth parentName parentNumber relation paymentStatus selectedPlan hasSubscriptionPlan" }, populateQuery);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const scheduleLessons = async (payload) => {
  try {
    const pipeline = [
      { $match: payload },
      {
        $lookup: {
          from: "lessons",
          localField: "lessonId",
          foreignField: "_id",
          as: "lessonId",
          pipeline: [{ $project: { title: 1, colorCode: 1, type: 1 } }],
        },
      },
      { $unwind: "$lessonId" },
      {
        $lookup: {
          from: "users",
          localField: "teachers",
          foreignField: "_id",
          as: "teachers",
          pipeline: [{ $project: { firstName: 1, lastName: 1, location: 1 } }],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "studentId",
          pipeline: [{ $project: { firstName: 1, lastName: 1 } }],
        },
      },
      { $unwind: "$studentId" },
      {
        $lookup: {
          from: "attendedlessons",
          localField: "_id",
          foreignField: "studentLessonId",
          as: "attendance",
          pipeline: [{ $project: { date: 1, status: 1 } }],
        },
      },
      {
        $project: {
          lessonId: 1,
          createdAt: 1,
          studentId: 1,
          date: 1,
          day: 1,
          startTime: 1,
          endTime: 1,
          teachers: 1,
          attendance: 1
        },
      },
    ];

    return await mongoService.aggregation("StudentLesson", pipeline);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const scheduleLessonDetails = async (id) => {
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
            { $project: { firstName: 1, lastName: 1, email: 1, role: 1 } },
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
        },
      },
    ];
    return await mongoService.aggregation("StudentLesson", pipeline);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const dateValidation = (lessonDate) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const formattedLessonDate = new Date(lessonDate).toISOString().split("T")[0];

  return currentDate === formattedLessonDate;
};

const getFcmToken = async (payload) => {
  try {
    const data = await mongoService.findAll("Users", {
      ...payload,
      isDeleted: false,
    });
    const id = data.filter((val) => val?.fcm_token).map((val) => val.fcm_token);
    return id;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
module.exports = {
  checkUser,
  checkTeachers,
  registerUser,
  addStudentInfo,
  userDetails,
  scheduleLessons,
  scheduleLessonDetails,
  dateValidation,
  userDetailsForLogin,
  updateUser,
  getFcmToken,
  notificationList,
};
