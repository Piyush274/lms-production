const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    uuid: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Locations",
    },
    instruments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instruments",
      },
    ],
    // age: {
    //     type: Number,
    // },
    date_of_birth: {
      type: Date,
    },
    // parentName: {
    //     type: String,
    // },
    // parentNumber: {
    //     type: String,
    // },
    relation: {
      type: String,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "parent", "admin"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    selectedPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plans",
    },
    activePlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plans",
    },
    hasSubscriptionPlan: {
      type: Boolean,
      default: false,
    },
    isFirstLogin: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
    },
    changePasswordToken: {
      type: String,
    },
    resetPasswordTokenExpires: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    studentMeetId: {
      type: String,
    },
    fcm_token: {
      type: String,
    },
    recurringPlanId: {
      type: String,
    },
    authorizeCustomerProfileId: {
      type: String,
    },
    authorizeCustomerPaymentProfileId: {
      type: String,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    lastLogin: {
      type: Date,
    },
    performance: {
      type: Number,
    },
     instAssessment: {
      type: Number,
    },
  },
  { timestamps: true }
);

userSchema.virtual("studentParent", {
  ref: "StudentParent",
  localField: "_id",
  foreignField: "studentId",
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Users", userSchema);
