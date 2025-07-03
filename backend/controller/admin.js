const {
  adminService,
  userService,
  teacherService,
  authorizeService,
  studentService,
} = require("../service");
const {
  response400,
  response200,
  response500,
} = require("../lib/response-messages");
const catchAsyncError = require("../middleware/catchAsyncError");
const { uploadFile, deleteImage } = require("../lib/uploader/upload");
const bcrypt = require("bcryptjs");
const { invitationMail } = require("../utils/emailTemplates");
const multer = require("multer");
const moment = require("moment");
const { addPlanValidator } = require("../utils/validations/admin.validation");
const { isValidObjectId } = require("../config/mongoService");
const { generateShortUUID, location_type } = require("../utils/constants");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { default: mongoose } = require("mongoose");
const { sendNotification } = require("../utils/pushFirebase");
const mongoService = require("../config/mongoService");


// Get Dashboard Data
const getDashboard = catchAsyncError(async (req, res) => {

  var data = await adminService.fetchAllRecords();

  const noShowsArray = data
  .map(item => item.noShows)
  .filter(val => typeof val === "number");

  let minNoShows = 0, maxNoShows = 0;

  if (noShowsArray.length > 0) {
    minNoShows = Math.min(...noShowsArray);
    maxNoShows = Math.max(...noShowsArray);
  }

  const lcxlArray = data
  .map(item => item.lcxl)
  .filter(val => typeof val === "number");

  let minLcxl = 0, maxLcxl = 0;

  if(lcxlArray.length > 0){
    minLcxl = Math.min(...lcxlArray);
    maxLcxl = Math.max(...lcxlArray);
  }

  const performanceArray = data.map(item => item.performance).filter(val => typeof val === "number");
  const minPerformance = Math.min(...performanceArray);

  const assessments = data.map(item => item.instructorAccessment).filter(val => typeof val === "number");
  const totalAssessments = assessments.reduce((sum, val) => sum + val, 0);
  const avgAssessments = assessments.length > 0 ? totalAssessments / assessments.length : 0;

  const today = new Date();
  const past31Days = new Date();
  past31Days.setDate(today.getDate() - 31);

  await Promise.all(
    data.map(async element => {
      element.j = 30;
      element.accBalance = "No";

      let userTransaction;
      userTransaction = await adminService.fetchTransaction({ userId: element.studentId, paymentStatus: "failed", createdAt: { $gte: past31Days, $lte: today } });

      if (userTransaction) {
        element.j = 0;
        element.accBalance = "Yes";
      }

      if (element.noShows) {
        element.k = 100 - (100 * ((element.noShows - minNoShows) / (maxNoShows - minNoShows)));
      }
      else {
        element.noShows = 0;
        element.k = 0;
      }


      if (element.lcxl) {
        element.l = 100 - (100 * ((element.lcxl - minLcxl) / (maxLcxl - minLcxl)));
      }
      else {
        element.lcxl = 0;
        element.l = 0;
      }

      if (!element.ecxl) {
        element.ecxl = 0;
      }

      if(!element.lastLogin){
        element.lastLogin = 0;
      }

      element.o = element.lastLogin <= 7 ? 40 : (element.lastLogin <= 28 ? 20 : 0);

      if (element.actionTaken) {
        element.q = (element.actionTaken) ? (element.actionTaken * 8) : 0
      }
      else {
        element.actionTaken = 0;
        element.q = 0;
      }

      if (element.outReach) {
        element.r = (element.outReach) ? (element.outReach * 20) : 0
      }
      else {
        element.outReach = 0;
        element.r = 0;
      }

      if(!element.performance){
        element.performance = 0;
      }

      var result = 100 * ((element.performance - minPerformance) / 4);
      element.w = result;
      if (result > 150) {
        element.w = 150;
      }

      var calAss = avgAssessments;
      if (element.instructorAccessment != "" && element.instructorAccessment != null && element.instructorAccessment != 0 && element.instructorAccessment != '0') {
        calAss = element.instructorAccessment;
      }
      else{
        element.instructorAccessment = 0;
      }
      element.p = (calAss * 100) / 5;

      element.cumulative = parseFloat(element.j + element.k + element.l + element.o + element.q + element.r + (2 * element.w) + (2 * element.p)).toFixed(2)
    })
  )

  const cumulativeArray = data.map(item => item.cumulative);
  const minCumulative = Math.min(...cumulativeArray);
  const maxCumulative = Math.max(...cumulativeArray);

  data.forEach(element => {
    element.overallhealth = parseFloat(100 * ((element.cumulative - minCumulative) / (maxCumulative - minCumulative))).toFixed(2)
    element.flight_risk = "";
    if (element.overallhealth < 31) {
      element.flight_risk = "Flight Risk";
    }
  })

  return response200(res, "Location added successfully.", data);
});



// add location
const addLocation = catchAsyncError(async (req, res) => {
  let { name } = req.body;
  if (!name) return response400(res, "name is required.");

  let isMatch = await adminService.checkOption("Locations", { name });
  if (isMatch) return response400(res, "Location already exits.");

  await adminService.storeOption("Locations", { ...req.body });
  return response200(res, "Location added successfully.", []);
});

// update location
const updateLocation = catchAsyncError(async (req, res) => {
  let { id, name, authorizeLoginId, authorizeTransactionKey } = req.body;
  if (!id) return response400(res, "Location id is required");
  if (!isValidObjectId(id))
    return response400(res, "Please enter valid location id");

  let location = await adminService.checkOption("Locations", { _id: id });
  if (!location) return response400(res, "Location details not found");

  if (name) {
    const isMatch = await adminService.checkOption("Locations", {
      name,
      _id: { $ne: id },
    });
    if (isMatch) return response400(res, "Location already exits.");
    location.name = name;
  }
  location.authorizeLoginId = authorizeLoginId;
  location.authorizeTransactionKey = authorizeTransactionKey;

  await location.save();
  return response200(res, "Location updated successfully", []);
});

// get all location
const getAllLocation = catchAsyncError(async (req, res) => {
  const { limit, offset, search } = req.query;
  const query = { isDeleted: false };

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  let data = await adminService.fetchOptions(
    "Locations",
    query,
    {},
    { select: "name createdAt authorizeLoginId authorizeTransactionKey" },
    limit,
    offset
  );
  return response200(res, "Data fetched successfully", data);
});

// delete location
const deleteLocation = catchAsyncError(async (req, res) => {
  const { locationId, transferLocationId } = req.body;
  if (!isValidObjectId(locationId))
    return response400(res, "Please enter valid location id");

  if (transferLocationId) {
    if (!isValidObjectId(transferLocationId))
      return response400(res, "Please enter valid transfer location id");
  }

  const locationData = await adminService.checkOption("Locations", {
    _id: locationId,
  });
  if (locationData && locationData?.locationType === location_type.online) {
    return response200(res, "Online location is not allowed to be delete");
  }

  const location = await adminService.deleteOption("Locations", {
    _id: locationId,
  });
  if (!location) return response400(res, "Location details not found.");

  if (transferLocationId) {
    await userService.updateUser(
      { location: locationId },
      { location: transferLocationId }
    );
  }

  return response200(res, "Location deleted successfully", []);
});

// add instrument
const addInstrument = catchAsyncError(async (req, res) => {
  upload.fields([
    { name: "name", maxCount: 1 },
    { name: "instrumentImage", maxCount: 1 },
  ])(req, res, async (error) => {
    try {
      if (error) return response400(res, "Something went wrong.");

      let { name } = req.body;
      if (!name) return response400(res, "name is required.");
      if (!req?.files?.instrumentImage)
        return response400(res, "instrumentImage is required.");

      let isMatch = await adminService.checkOption("Instruments", { name });
      if (isMatch) return response400(res, "Instrument already exits.");

      const file = req.files.instrumentImage[0];
      req.body.instrumentImage = await uploadFile(file);

      await adminService.storeOption("Instruments", req.body);
      return response200(res, "Instrument added successfully.", []);
    } catch (error) {
      console.log("✌️error --->", error);
      response500(res, "Something went wrong");
    }
  });
});

// update instrument
const updateInstrument = catchAsyncError(async (req, res) => {
  upload.fields([
    { name: "id", maxCount: 1 },
    { name: "name", maxCount: 1 },
    { name: "instrumentImage", maxCount: 1 },
  ])(req, res, async (error) => {
    try {
      if (error) return response400(res, "Something went wrong.");

      let { id, name } = req.body;
      if (!id) return response400(res, "instrument id is required.");
      if (!isValidObjectId(id))
        return response400(res, "Please enter valid instrument id");

      let instrument = await adminService.checkOption("Instruments", {
        _id: id,
      });
      if (!instrument) return response400(res, "Instrument details not found");

      if (name) {
        const isMatch = await adminService.checkOption("Instruments", {
          name,
          _id: { $ne: id },
        });
        if (isMatch) return response400(res, "Instrument already exits.");
        instrument.name = name;
      }

      const imgPath = instrument.instrumentImage;
      if (req?.files?.instrumentImage) {
        const file = req.files.instrumentImage[0];
        instrument.instrumentImage = await uploadFile(file);
        if (imgPath) await deleteImage(imgPath);
      }
      await instrument.save();
      return response200(res, "Instrument updated successfully", []);
    } catch (error) {
      response500(res, "Something went wrong");
    }
  });
});

// get all instrument
const getAllInstrument = catchAsyncError(async (req, res) => {
  const { limit, offset, search } = req.query;
  const query = { isDeleted: false };

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  let data = await adminService.fetchOptions(
    "Instruments",
    query,
    {},
    { select: "name createdAt instrumentImage" },
    limit,
    offset
  );
  return response200(res, "Data fetched successfully", data);
});

// delete instrument
const deleteInstrument = catchAsyncError(async (req, res) => {
  const { instrumentId } = req.params;
  if (!isValidObjectId(instrumentId))
    return response400(res, "Please enter valid instrument id");

  const instrument = await adminService.deleteOption("Instruments", {
    _id: instrumentId,
  });
  if (!instrument) return response400(res, "Instrument details not found.");

  return response200(res, "Instrument deleted successfully", []);
});

// add user
const addUser = catchAsyncError(async (req, res) => {
  let {
    type,
    email,
    password,
    phoneNumber,
    location,
    teacherId,
    selectedPlan,
    parentEmail,
    parentFirstName,
    parentNumber,
    parentLastName,
    parentPassword,
    relation,
  } = req.body;

  if (!isValidObjectId(location))
    return response400(res, "Please enter valid location id");

  let user = await userService.checkUser({ email });
  if (user) return response400(res, "User is already register with us");

  if (parentEmail) {
    if (email === parentEmail)
      return response400(res, "Parent and Student email must be unique");
  }

  if (parentNumber) {
    if (phoneNumber === parentNumber)
      return response400(res, "Parent and Student Phone number must be unique");
  }

  const isExits = await userService.checkUser({ phoneNumber });
  if (isExits) return response400(res, "Phone number is already exits.");

  let locationDetails = await adminService.checkOption("Locations", {
    _id: location,
  });
  if (!locationDetails) return response400(res, "Location details not found");

  if (selectedPlan) {
    let planDetails = await adminService.checkOption("Plans", {
      _id: selectedPlan,
    });
    if (!planDetails)
      return response400(res, "Selected plan details not found");
  } else {
    req.body.selectedPlan = null;
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const UUID =
    type === "student" ? generateShortUUID("STU") : generateShortUUID("TEA");
  user = await userService.registerUser({
    ...req.body,
    role: type,
    password: hashedPassword,
    addedBy: req.user,
    uuid: UUID,
  });

  if (parentEmail && parentFirstName && parentLastName && parentPassword) {
    const parentExists = await userService.checkUser({
      email: parentEmail,
      role: "parent",
    });
    if (parentExists) {
      await adminService.addStudentParent({
        parentId: parentExists?._id,
        studentId: user?._id,
      });
    } else {
      const ParentUUID = generateShortUUID("PAR");
      const hashedParentPassword = bcrypt.hashSync(parentPassword, 10);
      const parentData = await userService.registerUser({
        email: parentEmail,
        firstName: parentFirstName,
        lastName: parentLastName,
        role: "parent",
        password: hashedParentPassword,
        addedBy: req.user,
        uuid: ParentUUID,
        phoneNumber: parentNumber,
        location,
        selectedPlan,
        activePlan: selectedPlan,
      });
      await adminService.addStudentParent({
        parentId: parentData?._id,
        studentId: user?._id,
      });
    }
  }

  if (type === "student") {
    await userService.addStudentInfo({ studentId: user?._id });

    await studentService.addStudentReport({ studentId: user._id, lengthOfStay: "", accBalance: "", noShows: "", lcxl: "", ecxl: "", performance: "", lastLogin: "", actionTaken: "", outReach: "", instructorAccessment: "", isDeleted: false });
  }

  if (teacherId) {
    const teacher = await userService.checkUser({
      _id: teacherId,
      role: "teacher",
    });
    if (!teacher) return response400(res, "Teacher details not found.");
    await teacherService.storeStudent({
      teacherId,
      studentId: user?._id,
      is_follow: true,
    });

    let message = {
      title: "New Student",
      message: `Admin has assigned you one new student.`,
    };
    await sendNotification(message, teacher.fcm_token);

    var notificationData = {
      userId: teacherId,
      message: message.message,
      title: message.title,
      redirect_url: "studentList",
    };

    const saveNotification = await mongoService.createOne(
      "Notification",
      notificationData
    );
  }

  await invitationMail({ email: user.email, name: user.name, password });

  let data;
  if (type === "student") {
    data = await teacherService.getStudentInfo(user?._id);
  }
  if (type === "teacher") {
    data = await userService.userDetails({ _id: user?._id });
  }
  return response200(res, "Invitation mail send successfully", data);
});

// const planPayment = catchAsyncError(async (req, res) => {
//   let { userId, planId, paymentStatus, cardNumber, ExpirationDate, cvv } =
//     req.body;

//   if (!isValidObjectId(userId))
//     return response400(res, "Please enter valid user id");
//   if (!isValidObjectId(planId))
//     return response400(res, "Please enter valid plan id");

//   let user = await userService.checkUser({ _id: userId });
//   if (!user) return response400(res, "User details not found");

//   let plan = await adminService.checkOption("Plans", { _id: planId });
//   if (!plan) return response400(res, "Plan details not found");

//   const payment = await authorizeService.processPayment({
//     cardNumber,
//     ExpirationDate,
//     cvv,
//     amount: plan?.price,
//   });

//   console.log("payment-----------****", payment);
//   // console.log("payment message-----------****", payment.messages);

//   if (payment?.status === "success") {
//     const expirationDate = moment().add(1, "month").endOf("day").utcOffset(0);
//     expirationDate.set({ hour: 23, minute: 59, second: 59, millisecond: 999 });

//     // Create a new transaction record
//     const transaction = await adminService.createTransaction({
//       userId,
//       subscriptionId: planId,
//       title: plan.title,
//       description: plan.description,
//       price: plan.price,
//       keyPoints: plan.keyPoints,
//       location: plan.location,
//       isPopular: plan.isPopular,
//       paymentStatus: "success",
//       expiredDate: expirationDate.toDate(),
//       paymentId: payment.transactionId,
//     });
//     console.log("Transaction created-----------****", transaction);

//     // If the transaction was successful, update the user’s subscription details
//     if (transaction) {
//       user.paymentStatus = "completed";
//       user.activePlan = planId;
//       user.hasSubscriptionPlan = true;
//       user.selectedPlan = planId;
//       await user.save();
//     }

//     return response200(res, "Payment completed successfully.", {
//       paymentStatus: user.paymentStatus,
//       userId: user._id,
//     });
//   }

//   if (payment?.status === "failed") {
//     user.paymentStatus = "failed";
//     user.hasSubscriptionPlan = false;
//     await user.save();

//     return response200(res, "Payment Failed due to some reasons", {
//       paymentStatus: user.paymentStatus,
//       userId: user._id,
//     });
//   }
// });

const planPayment = catchAsyncError(async (req, res) => {
  let { userId, planId, cardNumber, ExpirationDate, cvv } = req.body;
  if (!isValidObjectId(userId)) return response400(res, "Invalid user ID");
  if (!isValidObjectId(planId)) return response400(res, "Invalid plan ID");

  let user = await userService.checkUser({ _id: userId });
  if (!user) return response400(res, "User not found");

  let plan = await adminService.checkOption("Plans", { _id: planId });
  if (!plan) return response400(res, "Plan not found");

  const location = await adminService.checkOption("Locations", {
    _id: user?.location,
  });

  if (!location?.authorizeLoginId || !location?.authorizeTransactionKey) {
    return response400(res, "Please add authorize net keys");
  }

  let isActivePlan = await adminService.fetchTransaction({
    userId: userId,
    subscriptionStatus: "active",
    expiredDate: { $gt: new Date() }, // Ensures the plan is not expired
  });

  if (isActivePlan) {
    return response400(res, "User already has an active subscription plan");
  }
  const payment = await authorizeService.processPayment({
    cardNumber,
    ExpirationDate,
    cvv,
    amount: plan?.price * 12,
    loginId: location?.authorizeLoginId,
    transactionKey: location?.authorizeTransactionKey,
  });

  console.log(payment)

  if (payment?.status === "success") {
    let planExpirationDate = moment()
      .add(12, "months")
      .endOf("day")
      .utcOffset(0);
    planExpirationDate.set({
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 999,
    });

    const transaction = await adminService.createTransaction({
      userId,
      subscriptionId: planId,
      title: plan.title,
      description: plan.description,
      price: plan?.price * 12,
      keyPoints: plan.keyPoints,
      location: plan.location,
      paymentStatus: "success",
      expiredDate: planExpirationDate.toDate(),
      paymentId: payment.transactionId,
    });

    user.paymentStatus = "completed";
    user.activePlan = planId;
    user.hasSubscriptionPlan = true;
    await user.save();

    let authCustomerId;
    let authCustomerProfileId;
    if (
      user.authorizeCustomerProfileId &&
      user.authorizeCustomerPaymentProfileId
    ) {
      authCustomerId = user.authorizeCustomerProfileId;
      authCustomerProfileId = user.authorizeCustomerPaymentProfileId;
    } else {
      const customerProfile = await authorizeService.createCustomerProfile({
        userId,
        email: user.email,
        cardNumber,
        expirationDate: ExpirationDate,
        firstName: user?.firstName,
        lastName: user?.lastName,
        loginId: location?.authorizeLoginId,
        transactionKey: location?.authorizeTransactionKey,
      });
      if (customerProfile?.status === "success") {
        user.authorizeCustomerProfileId = customerProfile.customerProfileId;
        user.authorizeCustomerPaymentProfileId =
          customerProfile.customerPaymentProfileId;
        await user.save();
        authCustomerId = customerProfile.customerProfileId;
        authCustomerProfileId = customerProfile.customerPaymentProfileId;
      } else {
        return response400(
          res,
          "Your plan has been activated, but auto-payment setup failed due to a technical issue. Please update it in future"
        );
      }
    }

    const subscription =
      await authorizeService.createSubscriptionFromCustomerProfile(
        authCustomerId,
        authCustomerProfileId,
        plan.price,
        location?.authorizeLoginId,
        location?.authorizeTransactionKey
      );
    if (subscription?.status === "success") {
      transaction.authSubscriptionId = subscription.subscriptionId;
      user.recurringPlanId = subscription.subscriptionId;
      await transaction.save();
      await user.save();
      return response200(res, "Payment & Subscription created successfully.", {
        paymentStatus: "completed",
        userId: user._id,
        subscriptionId: subscription.subscriptionId,
      });
    } else {
      return response400(
        res,
        "Your plan has been activated, but auto-payment setup failed due to a technical issue. Please update it in future"
      );
    }
  } else {
    const transaction = await adminService.createTransaction({
      userId,
      title: plan.title,
      description: plan.description,
      price: plan?.price * 12,
      keyPoints: plan.keyPoints,
      location: plan.location,
      paymentStatus: "failed",
      expiredDate: "",
      paymentId: payment.transactionId,
    });
    return response400(res, "Payment failed");
  }
});

const updateUser = catchAsyncError(async (req, res) => {
  let {
    firstName,
    lastName,
    email,
    phoneNumber,
    location,
    userId,
    date_of_birth,
    parentFirstName,
    parentLastName,
    parentNumber,
    parentEmail,
    parentId,
    relation,
    teachers,
    selectedPlan,
  } = req.body;
  // let { lastName, email, phoneNumber, location, userId, age,date_of_birth, parentName, parentNumber, relation, teachers, selectedPlan } = req.body
  if (!isValidObjectId(userId))
    return response400(res, "Please enter valid user id");

  let userDetails = await userService.checkUser({ _id: userId });
  if (!userDetails) return response400(res, "User details not found");

  if (location) {
    if (!isValidObjectId(location))
      return response400(res, "Please enter valid location id");
    let locationDetails = await adminService.checkOption("Locations", {
      _id: location,
    });
    if (!locationDetails) return response400(res, "Location details not found");
    if (
      userDetails.role === "student" &&
      userDetails.location.toString() !== location &&
      userDetails.activePlan
    ) {
      const transaction = await adminService.fetchTransaction({
        userId,
        subscriptionId: userDetails.activePlan,
        paymentStatus: "success",
      });
      if (transaction.authSubscriptionId) {
        const cancelSubscription = await authorizeService.cancelSubscription(
          transaction.authSubscriptionId,
          locationDetails?.authorizeLoginId,
          locationDetails?.authorizeTransactionKey
        );
        if (cancelSubscription.status === "success") {
          transaction.paymentStatus = "cancelled";
          transaction.subscriptionStatus = "cancelled";
          await transaction.save();
          userDetails.activePlan = null;
          userDetails.selectedPlan = null;
          userDetails.hasSubscriptionPlan = false;
          // await userDetails.save();
        }
      }
    }
    userDetails.location = location;
  }

  if (email) {
    let user = await userService.checkUser({ email, _id: { $ne: userId } });
    if (user) return response400(res, "User is already register with us");
    userDetails.email = email;
  }

  if (phoneNumber) {
    const isExits = await userService.checkUser({
      phoneNumber,
      _id: { $ne: userId },
    });
    if (isExits) return response400(res, "Phone number is already exits.");
    userDetails.phoneNumber = phoneNumber;
  }
  if (selectedPlan) {
    let planDetails = await adminService.checkOption("Plans", {
      _id: selectedPlan,
    });
    if (!planDetails)
      return response400(res, "Selected plan details not found");
    userDetails.selectedPlan = selectedPlan;
  }

  if (teachers) {
    let tempTeachers = [teachers];
    const teacher = await userService.checkTeachers({
      _id: { $in: tempTeachers },
      role: "teacher",
    });
    if (!teacher || teacher.length !== tempTeachers.length)
      return response400(res, "Teacher details not found.");

    if (!teacher) return response400(res, "Teacher details not found.");
    const currentStudentTeacherLinks = await teacherService.studentsTeacherIds({
      studentId: userId,
    });
    await adminService.handleStudentTeacherUpdate(
      tempTeachers,
      currentStudentTeacherLinks,
      userId
    );
  }

  // here edit parent details
  if (parentId) {
    const parentData = await userService.checkUser({
      _id: parentId,
      isDeleted: false,
    });
    if (!parentData) return response400(res, "Parent details not found");

    if (parentEmail) {
      let user = await userService.checkUser({
        email: parentEmail,
        _id: { $ne: parentId },
      });
      if (user) return response400(res, "User is already register with us");
      parentData.email = parentEmail;
    }

    if (parentNumber) {
      const isExits = await userService.checkUser({
        phoneNumber: parentNumber,
        _id: { $ne: parentId },
      });
      if (isExits) return response400(res, "Phone number is already exits.");
      parentData.phoneNumber = parentNumber;
    }

    parentData.firstName = parentFirstName || parentData.firstName;
    parentData.lastName = parentLastName || parentData.lastName;

    await parentData.save();
  }

  userDetails.firstName = firstName;
  userDetails.lastName = lastName;
  userDetails.date_of_birth = date_of_birth || userDetails.date_of_birth;
  userDetails.relation = relation || userDetails.relation;
  await userDetails.save();
  // await invitationMail({ email: user.email, name: user.name, password });
  return response200(res, "User details updated successfully", []);
});

const getSingleUserDetails = catchAsyncError(async (req, res) => {
  let { userId } = req.params;
  if (!isValidObjectId(userId))
    return response400(res, "Please enter valid user id");

  let data = await userService.userDetails({ _id: userId });
  if (!data) return response400(res, "User details not found");
  return response200(res, "Data fetched successfully", data);
});

// delete instrument
const deleteUser = catchAsyncError(async (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId))
    return response400(res, "Please enter valid user id");

  const user = await adminService.deleteOption("Users", { _id: userId });
  if (!user) return response400(res, "User details not found.");

  return response200(res, "User deleted successfully", []);
});

// get all users
const getAllUsers = catchAsyncError(async (req, res) => {
  const data = await adminService.fetchAllUsers(req.body);

  return response200(res, "User list loaded successfully.", data);
});

// add plan
const addPlan = catchAsyncError(async (req, res) => {
  upload.fields([
    { name: "planImage", maxCount: 1 },
    { name: "title", maxCount: 1 },
    { name: "description", maxCount: 1 },
    { name: "price", maxCount: 1 },
    { name: "keyPoints", maxCount: 1 },
    { name: "isPopular", maxCount: 1 },
    { name: "location", maxCount: 1 },
    { name: "lessonPerWeek", maxCount: 1 },
  ])(req, res, async (error) => {
    try {
      if (error) return response400(res, "Something went wrong.");

      let { title, location } = req.body;
      if (!req?.files?.planImage)
        return response400(res, "planImage is required.");

      const validation = addPlanValidator?.filter((field) => !req.body[field]);
      if (validation.length > 0)
        return response400(res, `${validation.join(", ")} is required`);

      let isMatch = await adminService.checkOption("Plans", { title });
      if (isMatch) return response400(res, "Plan already exits.");

      let locationDetails = await adminService.checkOption("Locations", {
        _id: location,
      });
      if (!locationDetails)
        return response400(res, "Location details not found");

      const file = req.files.planImage[0];
      req.body.planImage = await uploadFile(file);

      await adminService.storeOption("Plans", req.body);
      return response200(res, "Plan added successfully.", []);
    } catch (error) {
      console.log("✌️error --->", error);
      response500(res, "Something went wrong");
    }
  });
});

// update plan
const updatePlan = catchAsyncError(async (req, res) => {
  upload.fields([
    { name: "id", maxCount: 1 },
    { name: "planImage", maxCount: 1 },
    { name: "title", maxCount: 1 },
    { name: "description", maxCount: 1 },
    { name: "price", maxCount: 1 },
    { name: "keyPoints", maxCount: 1 },
    { name: "isPopular", maxCount: 1 },
    { name: "location", maxCount: 1 },
    { name: "lessonPerWeek", maxCount: 1 },
  ])(req, res, async (error) => {
    try {
      if (error) return response400(res, "Something went wrong.");

      let {
        id,
        title,
        description,
        price,
        keyPoints,
        isPopular,
        location,
        lessonPerWeek,
      } = req.body;
      if (!id) return response400(res, "plan id is required.");
      if (!isValidObjectId(id))
        return response400(res, "Please enter valid plan id");

      const validation = addPlanValidator?.filter((field) => !req.body[field]);
      if (validation.length > 0)
        return response400(res, `${validation.join(", ")} is required`);

      let plan = await adminService.checkOption("Plans", { _id: id });
      if (!plan) return response400(res, "Plan details not found");

      if (title) {
        let isMatch = await adminService.checkOption("Plans", {
          title,
          _id: { $ne: id },
        });
        if (isMatch) return response400(res, "Plan already exits.");
        plan.title = title;
      }
      if (location) {
        let locationDetails = await adminService.checkOption("Locations", {
          _id: location,
        });
        if (!locationDetails)
          return response400(res, "Location details not found");
        plan.location = location;
      }

      const imgPath = plan.planImage;
      if (req?.files?.planImage) {
        const file = req.files.planImage[0];
        plan.planImage = await uploadFile(file);
        if (imgPath) await deleteImage(imgPath);
      }

      plan.description = description;
      plan.price = price;
      plan.keyPoints = keyPoints;
      plan.isPopular = isPopular;
      plan.lessonPerWeek = lessonPerWeek;

      await plan.save();
      return response200(res, "Plan updated successfully", []);
    } catch (error) {
      response500(res, "Something went wrong");
    }
  });
});

// get all plan
const getAllPlan = catchAsyncError(async (req, res) => {
  const { search, location } = req.query;
  const query = { isDeleted: false };

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  if (location) {
    query.location = location;
  }
  let populate = [
    {
      path: "location",
      select: "name locationType",
    },
  ];
  let data = await adminService.fetchOptions("Plans", query, populate, {
    select:
      "createdAt title description price keyPoints isPopular planImage lessonPerWeek",
  });
  return response200(res, "Data fetched successfully", data);
});

// delete plan
const deletePlan = catchAsyncError(async (req, res) => {
  const { planId } = req.params;
  if (!isValidObjectId(planId))
    return response400(res, "Please enter valid plan id");

  const plan = await adminService.deleteOption("Plans", { _id: planId });
  if (!plan) return response400(res, "Plan details not found.");

  return response200(res, "Plan deleted successfully", []);
});

// add lesson
const addLesson = catchAsyncError(async (req, res) => {
  let userId = req.user;
  let { title, location } = req.body;

  let isMatch = await adminService.checkOption("Lessons", { title });
  if (isMatch) return response400(res, "Lesson already exits for this title.");

  if (location) {
    let isMatch = await adminService.checkOption("Locations", {
      _id: location,
    });
    if (!isMatch) return response400(res, "Location details not found.");
  } else {
    delete req.body.location;
  }
  await adminService.storeOption("Lessons", { ...req.body, addedBy: userId });

  return response200(res, "Lesson added successfully.", []);
});

// update lesson
const updateLesson = catchAsyncError(async (req, res) => {
  let { id, title, location, startTime, endTime, day } = req.body;
  if (!isValidObjectId(id))
    return response400(res, "Please enter valid lesson id");

  let lesson = await adminService.checkOption("Lessons", { _id: id });
  if (!lesson) return response400(res, "Lesson details not found");

  if (title) {
    const isMatch = await adminService.checkOption("Lessons", {
      title,
      _id: { $ne: id },
    });
    if (isMatch)
      return response400(res, "Lesson already exits for this title.");
  }
  if (location) {
    let isMatch = await adminService.checkOption("Locations", {
      _id: location,
    });
    if (!isMatch) return response400(res, "Location details not found.");
  } else {
    delete req.body.location;
  }

  let isAssignedLesson = await adminService.checkOption("StudentLesson", {
    lessonId: id,
  });
  if (
    isAssignedLesson &&
    (startTime !== lesson.startTime ||
      endTime !== lesson.endTime ||
      day !== lesson.day)
  ) {
    return response400(
      res,
      "Unable to update lesson because it has been assigned to student with the current schedule"
    );
  }

  await adminService.updateOption("Lessons", { _id: id }, { ...req.body });
  return response200(res, "Lesson updated successfully", []);
});

//get all lessons
const getLessonList = catchAsyncError(async (req, res) => {
  let { search, limit, offset } = req.query;
  const query = { isDeleted: false };

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  let data = await adminService.lessonList(query, limit, offset);
  return response200(res, "Data fetched successfully", data);
});

// delete lesson
const deleteLesson = catchAsyncError(async (req, res) => {
  const { lessonId } = req.params;
  if (!isValidObjectId(lessonId))
    return response400(res, "Please enter valid lesson id");

  const lesson = await adminService.deleteOption("Lessons", { _id: lessonId });
  if (!lesson) return response400(res, "Lesson details not found.");

  return response200(res, "Lesson deleted successfully", []);
});

// assign lesson
const assignLesson = catchAsyncError(async (req, res) => {
  let userId = req.user;
  let { lessonId, studentId, date, appointmentNote, clientNote } = req.body;

  if (!isValidObjectId(lessonId))
    return response400(res, "Please enter valid lesson id");
  if (!isValidObjectId(studentId))
    return response400(res, "Please enter valid student id");

  let lesson = await adminService.checkOption("Lessons", { _id: lessonId });
  if (!lesson) return response400(res, "Lesson details not found.");

  let student = await userService.checkUser({ _id: studentId });
  if (!student) return response400(res, "Student details not found.");

  let isExits = await adminService.checkOption("StudentLesson", {
    studentId,
    date,
    startTime: lesson.startTime,
    endTime: lesson.endTime,
  });
  if (isExits)
    return response400(res, "Lesson is already assigned during this time");

  await adminService.storeOption("StudentLesson", {
    lessonId,
    studentId,
    date,
    day: lesson.day,
    startTime: lesson.startTime,
    endTime: lesson.endTime,
    teachers: lesson.teachers,
    meetLink: lesson.meetLink,
    location: lesson.location,
    appointmentNote,
    clientNote,
    assignBy: userId,
  });
  return response200(res, "Lesson assign successfully.", []);
});

// delete assign lesson
const deleteAssignLesson = catchAsyncError(async (req, res) => {
  const { studentLessonId } = req.params;
  if (!isValidObjectId(studentLessonId))
    return response400(res, "Please enter valid student lesson id");

  const studentLesson = await adminService.deleteOption("StudentLesson", {
    _id: studentLessonId,
  });
  if (!studentLesson) return response400(res, "Lesson details not found.");

  return response200(res, "Lesson deleted successfully", []);
});

//update assign lesson
const updateAssignLesson = catchAsyncError(async (req, res) => {
  let { studentLessonId, lessonId, appointmentNote, clientNote, location } =
    req.body;

  if (!studentLessonId) return response400(res, "studentLessonId is required");
  if (!isValidObjectId(studentLessonId))
    return response400(res, "Please enter valid student lesson id");

  let studentLesson = await adminService.checkOption("StudentLesson", {
    _id: studentLessonId,
  });
  if (!studentLesson)
    return response400(res, "Student lesson details not found.");

  if (lessonId) {
    if (!isValidObjectId(lessonId))
      return response400(res, "Please enter valid lesson id");
    let lesson = await adminService.checkOption("Lessons", { _id: lessonId });
    if (!lesson) return response400(res, "Lesson details not found.");
    studentLesson.lessonId = lessonId;
  }

  if (location) {
    if (!isValidObjectId(location))
      return response400(res, "Please enter valid location id");
    let locationDetails = await adminService.checkOption("Locations", {
      _id: location,
    });
    if (!locationDetails)
      return response400(res, "Location details not found.");
    studentLesson.location = location;
  }

  studentLesson.appointmentNote = appointmentNote;
  studentLesson.clientNote = clientNote;

  await studentLesson.save();
  return response200(res, "Details update successfully.", []);
});

// assign lesson details
const assignLessonDetails = catchAsyncError(async (req, res) => {
  let { studentLessonId } = req.params;
  if (!isValidObjectId(studentLessonId))
    return response400(res, "Please enter valid studentLessonId");

  let data = await adminService.studentLessonDetails(studentLessonId);

  return response200(res, "Details fetch successfully.", data);
});

const lessonWiseStudentList = catchAsyncError(async (req, res) => {
  let data = await adminService.lessonWiseStudent();
  return response200(res, "Data fetched successfully", data);
});

// add category
const addCategory = catchAsyncError(async (req, res) => {
  let { name } = req.body;
  if (!name) return response400(res, "name is required.");

  let isMatch = await adminService.checkOption("Category", { name });
  if (isMatch) return response400(res, "Category already exits.");

  await adminService.storeOption("Category", { name });
  return response200(res, "Category added successfully.", []);
});

// update category
const updateCategory = catchAsyncError(async (req, res) => {
  let { id, name } = req.body;
  if (!id) return response400(res, "Category id is required");
  if (!isValidObjectId(id))
    return response400(res, "Please enter valid category id");

  let category = await adminService.checkOption("Category", { _id: id });
  if (!category) return response400(res, "Category details not found");

  if (name) {
    const isMatch = await adminService.checkOption("Category", {
      name,
      _id: { $ne: id },
    });
    if (isMatch) return response400(res, "Category already exits.");
    category.name = name;
  }

  await category.save();
  return response200(res, "Category updated successfully", []);
});

// get all category
const getAllCategory = catchAsyncError(async (req, res) => {
  const { limit, offset, search } = req.query;
  const query = { isDeleted: false };

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  let data = await adminService.fetchOptions(
    "Category",
    query,
    {},
    { select: "name createdAt" },
    limit,
    offset
  );
  return response200(res, "Data fetched successfully", data);
});

// delete location
const deleteCategory = catchAsyncError(async (req, res) => {
  const { categoryId } = req.params;
  if (!isValidObjectId(categoryId))
    return response400(res, "Please enter valid category id");

  const category = await adminService.deleteOption("Category", {
    _id: categoryId,
  });
  if (!category) return response400(res, "Category details not found.");

  return response200(res, "Category deleted successfully", []);
});

const getVirtualConsultations = catchAsyncError(async (req, res) => {
  const userId = req.user;
  const data = await adminService.get_virtual_consultation(req.query);
  return response200(res, "fetched successfully", data);
});

const fetchScheduleLessonList = catchAsyncError(async (req, res) => {
  let { instructors, locations } = req.body;
  let query = { isDeleted: false };

  const currentDate = new Date();
  const oneYearAgoDate = new Date(currentDate);
  oneYearAgoDate.setFullYear(currentDate.getFullYear() - 1);
  oneYearAgoDate.setDate(oneYearAgoDate.getDate() - 1);
  query.date = { $gte: oneYearAgoDate.toISOString() };

  if (instructors && instructors?.length) {
    query = {
      ...query,
      teachers: {
        $elemMatch: {
          _id: {
            $in: instructors?.map((id) => new mongoose.Types.ObjectId(id)),
          },
        },
      },
    };
  }

  if (locations && locations?.length) {
    query = {
      ...query,
      teachers: {
        $elemMatch: {
          location: {
            $in: locations?.map((id) => new mongoose.Types.ObjectId(id)),
          },
        },
      },
    };
  }

  let data = await userService.scheduleLessons(query);
  return response200(res, "List fetch successfully.", data);
});


const getLocationTeacher = catchAsyncError(async (req, res) => {

  const { location } = req.params;
  let query = { isDeleted: false };

  let data = await teacherService.teacherList(location);

  return response200(res, "List fetch successfully.", data);

})


const getFilterTeacher = catchAsyncError(async (req, res) => {
  //   let { instructors, locations } = req.body;
  let query = { isDeleted: false };

  //   const currentDate = new Date();
  //   const oneYearAgoDate = new Date(currentDate);
  //   oneYearAgoDate.setFullYear(currentDate.getFullYear() - 1);
  //   oneYearAgoDate.setDate(oneYearAgoDate.getDate() - 1);
  //   query.date = { $gte: oneYearAgoDate.toISOString() };

  //   if (instructors && instructors?.length) {
  //     query = {
  //       ...query,
  //       teachers: {
  //         $elemMatch: {
  //           _id: {
  //             $in: instructors?.map((id) => new mongoose.Types.ObjectId(id)),
  //           },
  //         },
  //       },
  //     };
  //   }

  //   if (locations && locations?.length) {
  //     query = {
  //       ...query,
  //       teachers: {
  //         $elemMatch: {
  //           location: {
  //             $in: locations?.map((id) => new mongoose.Types.ObjectId(id)),
  //           },
  //         },
  //       },
  //     };
  //   }

  let data = await userService.scheduleLessons(query);

  let uniqueTeachers = [];
  if (data?.length) {
    data.forEach((lesson) => {
      lesson.teachers.forEach((teacher) => {
        if (
          !uniqueTeachers.some(
            (t) => t._id.toString() === teacher._id.toString()
          )
        ) {
          uniqueTeachers.push(teacher);
        }
      });
    });
  }
  return response200(res, "List fetch successfully.", uniqueTeachers);
});

// teacher's active student list
const getTeachersActiveStudent = catchAsyncError(async (req, res) => {
  const { teacherId } = req.params;

  let studentIds = await teacherService.teachersStudentIds({
    teacherId: teacherId,
    status: "active",
    is_follow: true,
  });
  let query = { _id: { $in: studentIds } };

  const data = await adminService.studentList(query);

  return response200(res, "My students list loaded successfully.", data);
});

// Add Action Comment
const addActionTake = catchAsyncError(async (req, res) => {
  const { studentId, comment } = req.body;
  await adminService.storeActionTake("ActionTake", { studentId, comment });

  const dataReport = await mongoService.findOne("Report", { studentId: studentId });

  if (dataReport) {
    await adminService.updateOption("Report", { studentId: studentId }, [
      {
        $set: {
          actionTaken: {
            $add: [{ $ifNull: ["$actionTaken", 0] }, 1]
          }
        }
      }
    ]);
  }
  else {
    await adminService.storeOption("Report", {
      studentId: studentId,
      actionTaken: 1
    });
  }

  return response200(res, "Action Take added successfully.", []);
});

const getAllAction = catchAsyncError(async (req, res) => {
  const { studentId } = req.params;
  const data = await adminService.getAllrecords("ActionTake", { studentId });
  return response200(res, "Outreach fetched successfully.", data);
});

// Add Action Comment
const addOutReach = catchAsyncError(async (req, res) => {
  const { studentId, comment } = req.body;
  await adminService.storeActionTake("OutReach", { studentId, comment });

  const dataReport = await mongoService.findOne("Report", { studentId: studentId });

  if (dataReport) {
    await adminService.updateOption("Report", { studentId: studentId }, [
      {
        $set: {
          outReach: {
            $add: [{ $ifNull: ["$outReach", 0] }, 1]
          }
        }
      }
    ]);
  }
  else {
    await adminService.storeOption("Report", {
      studentId: studentId,
      outReach: 1
    });
  }

  return response200(res, "Outreach added successfully.", []);
});

const getAllOutReach = catchAsyncError(async (req, res) => {
  const { studentId } = req.params;
  const data = await adminService.getAllrecords("OutReach", { studentId });
  return response200(res, "Outreach fetched successfully.", data);
});

const addPerformance = catchAsyncError(async (req, res) => {
  const { studentId, score } = req.body;

  await adminService.updateOption(
    "Users",
    { _id: studentId },
    { $inc: { performance: Number(score) } }
  );

  const dataReport = await mongoService.findOne("Report", { studentId: studentId });

  if (dataReport) {
    await adminService.updateOption(
      "Report", 
      { studentId: studentId }, 
      { $inc: { performance: Number(score) } }
    );
  }
  else {
    await adminService.storeOption("Report", {
      studentId: studentId,
      performance: Number(score)
    });
  }

  return response200(res, "Performance added successfully.", []);
});

const getPerformance = catchAsyncError(async (req, res) => {
  const { studentId } = req.params;
  const data = await adminService.checkOption("Report", { studentId });
  return response200(res, "Performance fetched successfully.", data);
});

const addInstAssessment = catchAsyncError(async (req, res) => {
  const { studentId, score } = req.body;

  await adminService.updateOption(
    "Users",
    { _id: studentId },
    { $inc: { instAssessment: Number(score) } }
  );

  const dataReport = await mongoService.findOne("Report", { studentId: studentId });

  if (dataReport) {
    await adminService.updateOption(
      "Report", 
      { studentId: studentId }, 
      { $inc: { instructorAccessment: Number(score) } }
    );
  }
  else {
    await adminService.storeOption("Report", {
      studentId: studentId,
      instructorAccessment: Number(score)
    });
  }

  return response200(res, "Inst Assesment added successfully.", []);
});

const getInstAssessment = catchAsyncError(async (req, res) => {
  const { studentId } = req.params;
  const data = await adminService.checkOption("Report", { studentId });
  return response200(res, "Inst Assessment fetched successfully.", data);
});

module.exports = {
  // Dahsboard
  getDashboard,
  // location
  addLocation,
  updateLocation,
  getAllLocation,
  deleteLocation,
  // Instrument
  addInstrument,
  updateInstrument,
  getAllInstrument,
  deleteInstrument,
  // users
  addUser,
  getAllUsers,
  updateUser,
  getSingleUserDetails,
  deleteUser,
  planPayment,
  // plan
  addPlan,
  updatePlan,
  getAllPlan,
  deletePlan,
  // lesson
  addLesson,
  updateLesson,
  getLessonList,
  deleteLesson,
  // student lesson
  assignLesson,
  deleteAssignLesson,
  updateAssignLesson,
  assignLessonDetails,
  lessonWiseStudentList,
  fetchScheduleLessonList,
  //category
  addCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
  getVirtualConsultations,
  getFilterTeacher,
  getTeachersActiveStudent,
  getLocationTeacher,
  addActionTake,
  getAllAction,
  addOutReach,
  getAllOutReach,
  addPerformance,
  getPerformance,
  addInstAssessment,
  getInstAssessment
};
