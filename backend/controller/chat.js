const { response200 } = require("../lib/response-messages");
const catchAsyncError = require("../middleware/catchAsyncError");
const { chatService, teacherService, userService } = require("../service");
const { sendNotification } = require("../utils/pushFirebase");

const getUserData = catchAsyncError(async (req, res) => {
  const { userId } = req.params;

  const data = await chatService.memberData(userId);
  console.log("✌️data --->", data);
  const groupData = await chatService.get_all_group_data(userId);
  console.log("✌️groupData --->", groupData);

  let finalData = [];
  if (data?.length && groupData?.length) {
    finalData = [...data, ...groupData];
  }
  return response200(res, "Data fetched successfully", finalData);
});

const getStudentData = catchAsyncError(async (req, res) => {
  const userId = req.user;
  const data = await teacherService.studentData(userId);
  return response200(res, "Data fetched successfully", data);
});

const createChatGroup = catchAsyncError(async (req, res) => {
  const userId = req.user;
  let { groupName, members, type } = req.body;
  const data = await chatService.create_chat_group({
    groupName,
    members,
    userId,
    type,
  });

  return response200(res, "Team group created successfully", data);
});

const getAllGroup = catchAsyncError(async (req, res) => {
  const userId = req.user;

  const data = await chatService.get_all_group(userId);

  return response200(res, "Group data fetched successfully", data);
});

const createMessage = catchAsyncError(async (req, res) => {
  const { group_id, user_id, message_type, message, media_file } = req.body;
  // Create a new message

  const data = await chatService.create_message({
    group_id,
    user_id,
    message_type,
    message,
    media_file,
  });

  // const token = "user token"
  const groupMembers = await chatService.get_group_members({
    group_id,
    user_id,
  });
  const deviceIds = await userService.getFcmToken({
    _id: { $in: groupMembers },
  });
  if (deviceIds.length > 0) {
    let message = {
      title: "New Message",
      message: `You have a new message.`,
    };
    await sendNotification(message, deviceIds);
  }

  return response200(res, "Message Added successfully");
});

const getMessages = catchAsyncError(async (req, res) => {
  const userId = req.user;
  const { group_id } = req.query;
  const data = await chatService.get_messages(group_id);
  return response200(res, "Messages fetched successfully", data);
});

module.exports = {
  getUserData,
  createChatGroup,
  getAllGroup,
  createMessage,
  getMessages,
  getStudentData,
};
