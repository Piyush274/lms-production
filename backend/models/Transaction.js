const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscriptionId: {
      type: mongoose.Schema.ObjectId,
      ref: "Plan",
    },
    title: {
      type: String,
      required: true,
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
    paymentStatus: {
      enum: ["failed", "success", "cancelled"],
      type: String,
      //  0 = failed, 1 = success
    },
    subscriptionStatus: {
      enum: ["active", "expired", "cancelled"],
      type: String,
      default: "active",
    },
    failedReason: {
      type: String,
    },
    paymentId: {
      type: String,
    },
    authSubscriptionId: {
      type: String,
    },
    expiredDate: {
      type: Date,
    },
    isDeleted: {
      enum: [0, 1],
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
