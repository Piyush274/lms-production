const mongoose = require("mongoose");

const attendedLessonSchema = mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lessons"
    },
    studentLessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudentLesson"
    },
    date: {
        type: String
    },
    time: {
        type: String
    },
    status: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("AttendedLesson", attendedLessonSchema)