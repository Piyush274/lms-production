const mongoose = require("mongoose");
const { location_type } = require("../utils/constants");

const locationSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    locationType: {
      type: String,
      enum: [location_type.offline, location_type.online],
      default: location_type.offline,
    },
    authorizeLoginId: {
      type: String,
    },
    authorizeTransactionKey: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Locations", locationSchema);