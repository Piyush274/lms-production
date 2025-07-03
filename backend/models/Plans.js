const mongoose = require("mongoose");

const planSchema = mongoose.Schema(
  {
    planImage: {
      type: String,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    keyPoints: [String],
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Locations",
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    lessonPerWeek: {
      type: Number,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plans", planSchema);
