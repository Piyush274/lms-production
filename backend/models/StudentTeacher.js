const mongoose = require("mongoose");

const studentTeacherSchema = mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    is_follow:{
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ["active", "deleted"],
        // default: "active"
    },
    meeting_link:{
        type:String,
    },
    deletedAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model("StudentTeacher", studentTeacherSchema)