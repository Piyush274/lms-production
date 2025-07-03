const mongoose = require("mongoose");

const teacherSkillSchema = mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    skillId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skills"
    },
    status: {
        type: String,
        enum: ["active", "deleted"],
        default: "active"
    },
    deletedAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model("TeacherSkill", teacherSkillSchema)