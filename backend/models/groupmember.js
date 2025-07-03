const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the GroupMember Schema
const groupMemberSchema = new Schema(
  {
    group_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatGroup",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    group_type: {
      type: String,
      enum: ["direct", "group"],
      default: "direct",
    },
    unreadCounts: {
      type: Number,
      default: 0,
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

const GroupMember = mongoose.model("GroupMember", groupMemberSchema);
module.exports = GroupMember;
