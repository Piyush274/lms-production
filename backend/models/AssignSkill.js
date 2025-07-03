const mongoose = require("mongoose");
const { skill_history } = require("../utils/constants");

const studentResponseVideoSchema = mongoose.Schema({
    url: {
        type: String,
    },
    title: {
        type: String,
    },
}, { timestamps: true });

const assignedSkillSchema = mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    skillId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skills"
    },
    studentResponseVideo:[studentResponseVideoSchema],
    is_active: {
        type: Boolean,
        default: true
    },
    is_completed: {
        type: Boolean,
        default: false
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    status:{
        type:String,
        enum:[skill_history.pending,skill_history.submitted,skill_history.completed],
        default:skill_history.pending,
    },
    meetId:{
        type: String,
    },
    deletedAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model("AssignSkill", assignedSkillSchema)