const mongoose = require("mongoose");
const { messageType } = require("../utils/constants");
const Schema = mongoose.Schema;

// Define the Message Schema
const messageSchema = new Schema(
  {
    chatRoomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatGroup",
      required: true,
    },
    message_type: {
      type: String,
      enum: [messageType.text, messageType.file],
      default: messageType.text,
    },
    message: {
      type: String,
      required: function () {
        return this.message_type === messageType.text;
      },
    },
    media_url: {
      type: String,
      required: function () {
        return ["image", "video", "document", "file"].includes(
          this.message_type
        );
      },
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Optional for group messages
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

// Pre-save validation or transformation logic (if needed)
messageSchema.pre("save", function (next) {
  if (this.message_type !== "text" && !this.media_url) {
    return next(new Error(`${this.message_type} requires a valid media_url.`));
  }
  next();
});

const Message = mongoose.model("Messages", messageSchema);
module.exports = Message;
