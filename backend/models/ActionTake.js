const mongoose = require("mongoose");

const actionTakeSchema = mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    comment: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("ActionTake", actionTakeSchema)