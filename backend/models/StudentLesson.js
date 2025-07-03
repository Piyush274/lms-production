const mongoose = require("mongoose");

const studentLessonSchema = mongoose.Schema({
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lessons"
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    date: {
        type: String
    },
    day: {
        type: String
    },
    startTime: {
        type: String,
    },
    endTime: {
        type: String,
    },
    teachers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        },
    ],
    meetLink: {
        type: String,
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Locations"
    },
    appointmentNote: {
        type: String
    },
    clientNote: {
        type: String
    },
    isReschedule: {
        type: Boolean,
        default: false
    },
    rescheduleBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    studentPresent: {
        type: Boolean,
        default: false
    },
    teacherPresent: {
        type: Boolean,
        default: false
    },
    studentShow: {
        type: Boolean,
        default: false
    },
    assignBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model("StudentLesson", studentLessonSchema)