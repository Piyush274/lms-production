const mongoose = require("mongoose");

const reportSchema = mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    lengthOfStay: {
      type: Number,
    },
    accBalance: {
      type: String,
    },
    noShows: {
      type: Number,
    },
    lcxl: {
      type: Number,
    },
    ecxl: {
      type: Number,
    },
    performance: {
      type: Number,
    },
    lastLogin: {
      type: Number,
    },
    actionTaken: {
      type: Number,
    },
    outReach: {
      type: Number,
    },
    instructorAccessment: {
      type: Number,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
