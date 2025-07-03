const mongoose = require("mongoose");

const outREachSchema = mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    comment: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("OutReach", outREachSchema)