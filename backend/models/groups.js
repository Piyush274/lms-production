const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the ChatGroup Schema
const chatGroupsSchema = new Schema(
  {
    group_name: {
      type: String,
      required: function () {
        return this.type === "group"; // Name is required for group chats
      },
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    type: {
      type: String,
      enum: ["direct", "group"],
      default: "direct",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ChatGroup = mongoose.model("ChatGroup", chatGroupsSchema);
module.exports = ChatGroup;
