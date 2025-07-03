const mongoose = require("mongoose");
const { skill_history } = require("../utils/constants");

const assignedSkillHistorySchema = mongoose.Schema({
    teacherId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    skillId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skills"
    },
    status:{
        type:String,
        enum:[skill_history.pending,skill_history.submitted,skill_history.completed],
        default:skill_history.pending,
    },
}, { timestamps: true });

module.exports = mongoose.model("assignedSkillHistory", assignedSkillHistorySchema)