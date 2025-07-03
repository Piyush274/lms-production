const { default: mongoose } = require("mongoose");
const mongoService = require("../config/mongoService");
const { ChatGroup, Notification } = require("../models");
const { userService } = require(".");
const { sendNotification } = require("../utils/pushFirebase");

// Function to set a user offline based on socket ID
const set_offline = async (socketId) => {
  try {
    if (!socketId) {
      throw new Error("Socket ID is required.");
    }

    // Add your logic to handle offline status (e.g., update user status in the database)
    console.log(`${socketId} is now offline.`);
    return { success: true, message: `Socket ${socketId} set to offline.` };
  } catch (error) {
    console.error("Error setting user offline:", error);
    return { success: false, message: error.message };
  }
};

const memberData = async (userId) => {
  try {
    const userData = await mongoService.findOne("Users", { _id: userId });
    let query = {};
    if (userData.role === "teacher") {
      query = {
        teacherId: new mongoose.Types.ObjectId(userId),
      };
    }

    if (userData.role === "student") {
      query = {
        studentId: new mongoose.Types.ObjectId(userId),
      };
    }

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
          user_id: "$studentDetails._id",
          groupName: {
            $concat: [
              "$studentDetails.firstName",
              " ",
              "$studentDetails.lastName",
            ],
          },
          profileImage: "$studentDetails.profileImage",
          group_type: "direct",
        },
      },
    ];

    let data = await mongoService.aggregation("StudentTeacher", pipeline);

    let temp = [];
    if (data?.length) {
      data?.map((val) => {
        if (
          !temp?.some(
            (item) => item?.user_id?.toString() === val?.user_id?.toString()
          )
        ) {
          temp.push(val);
        }
      });
      data = temp;
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

// Function to create a team group
const create_chat_group = async (payload) => {
  try {
    const { groupName, members, userId, type } = payload;

    if (!members || !userId) {
      throw new Error(
        "Members and userId are required to create a chat group."
      );
    }

    if (type === "direct" && members.length !== 1) {
      throw new Error("Direct chats must have exactly 1 other member.");
    }

    const groupType = type || (members.length > 1 ? "group" : "direct");

    if (groupType === "direct") {
      const existingDirectChat = await mongoService.findOne("ChatGroup", {
        type: "direct",
        members: { $all: [userId, ...members] },
      });

      if (existingDirectChat) {
        console.log("Direct chat already exists.");
        return existingDirectChat;
      }
    }

    // Create the chat group payload
    const chatGroupPayload = {
      group_name: groupType === "group" ? groupName : null,
      members: [...new Set([...members, userId])],
      type: groupType,
      user_id: userId,
      isDeleted: false,
    };

    // Save chat group
    const savedGroup = await mongoService.createOne(
      "ChatGroup",
      chatGroupPayload
    );

    if (!savedGroup) {
      throw new Error("Failed to create chat group.");
    }

    // Prepare group members payload
    const groupMembers = chatGroupPayload.members.map((memberId) => ({
      group_id: savedGroup._id,
      user_id: memberId,
      group_type: groupType,
      createdAt: new Date(),
      unread_counts: 0,
      isDeleted: false,
    }));

    // Save group members
    await mongoService.createMany("GroupMember", groupMembers);

    return savedGroup;
  } catch (error) {
    console.error("Error creating chat group:", error.message);
    throw error;
  }
};

const get_all_group_data = async (userId) => {
  try {
    const groupQuery = {
      members: { $in: [userId] }, // Check if userId is included in members
      type: "group",
      isDeleted: false,
    };

    const groups = await mongoService.findAll("ChatGroup", groupQuery);

    const transformedGroups = groups
      .map((group) => {
        const memberId = group.members.find(
          (member) => member.toString() === userId.toString()
        );

        if (!memberId) return null;

        return {
          _id: group._id,
          user_id: group.user_id,
          groupName: group.group_name,
          profileImage: "",
          group_type: "group",
        };
      })
      .filter(Boolean); // Remove null values

    return transformedGroups;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const get_all_group = async (userId) => {
  try {
    const groupQuery = {
      user_id: userId,
      isDeleted: false,
    };

    const groups = await mongoService.findAll("ChatGroup", groupQuery);

    return groups;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const create_message = async (payload) => {
  try {
    const { group_id, user_id, message_type, message } = payload;

    console.log(
      "✌️group_id, user_id, message_type, message --->",
      group_id,
      user_id,
      message_type,
      message
    );

    const newMessage = {
      chatRoomId: group_id,
      message_type: message_type,
      message: message,
      // media_url: message,
      senderId: user_id,
      receiverId: null,
      isDeleted: false,
    };

    const savedMessage = await mongoService.createOne("Messages", newMessage);
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

      for (const member of groupMembers) {
        console.log("✌️member --->", member);
        var data = {
          userId: member,
          message: message.message,
          title: message.title,
          redirect_url: "chat",
          redirect_id: group_id,
        };

        console.log(data);
        const saveNotification = await mongoService.createOne(
          "Notification",
          data
        );
        console.log("✌️saveNotification --->", saveNotification);
      }
    }
    return savedMessage;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const get_messages = async (group_id) => {
  try {
    if (!group_id) {
      throw new Error("Group ID is required to fetch messages.");
    }

    // Fetch messages from the database using aggregation
    const pipeline = [
      {
        $match: {
          chatRoomId: new mongoose.Types.ObjectId(group_id),
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "sender",
        },
      },
      {
        $unwind: {
          path: "$sender",
          preserveNullAndEmptyArrays: true, // If no matching sender found, set to null
        },
      },
      {
        $project: {
          createdAt: 1,
          // avatar: { $ifNull: ["$sender.avatar", null] },
          msg_type: { $ifNull: ["$message_type", "text"] }, // Default message type if null
          text: { $ifNull: ["$message", ""] },
          senderId: "$senderId",
          senderFirstName: { $ifNull: ["$sender.firstName", "Unknown"] },
          senderLastName: { $ifNull: ["$sender.lastName", "Unknown"] },
          file: {
            $cond: [
              { $eq: ["$media_url", null] },
              null,
              { name: "$message", url: "$media_url" },
            ],
          },
        },
      },
    ];

    let messages = await mongoService.aggregation("Messages", pipeline);

    console.log("✌️messages --->", messages);
    if (!messages.length) {
      console.log("No messages found.");
      return [];
    }

    // Format the messages to match the frontend array structure
    const formattedMessages = messages.map((msg, index) => {
      const messageObj = {
        time: msg.createdAt || "Unknown",
        msg_type: msg.msg_type || "text",
        text: msg.text || "",
        senderId: msg.senderId,
        sender: `${msg.senderFirstName} ${msg.senderLastName}`, // Concatenate first and last names
        file: null,
        // avatar:msg.avatar
      };

      // Handling skill type messages (if needed)
      if (msg.msg_type === "skill") {
        messageObj.type = "skill";
        messageObj.title = msg.text;
        messageObj.category = "Some Category"; // Add actual category if needed
        messageObj.progress = "0%"; // Add actual progress if available
        messageObj.addedBy = msg.senderId ? msg.senderId.toString() : "Unknown";
      }

      return messageObj;
    });

    console.log("Messages fetched:", formattedMessages);
    return formattedMessages;
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    throw error;
  }
};

const get_group_members = async (payload) => {
  try {
    const { group_id, user_id } = payload;

    const members = await mongoService.findAll("GroupMember", {
      isDeleted: false,
      group_id: group_id,
      user_id: { $ne: user_id },
    });
    const userIds = members.map((val) => val.user_id);
    return userIds;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Export the service
const chatService = {
  set_offline,
  memberData,
  create_chat_group,
  get_all_group,
  create_message,
  get_messages,
  get_all_group_data,
  get_group_members,
};

module.exports = chatService;
