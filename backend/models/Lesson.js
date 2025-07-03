const mongoose = require("mongoose");

const lessonSchema = mongoose.Schema({
    colorCode: {
        type: String,
    },
    title: {
        type: String,
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Locations"
    },
    type: {
        type: String,
        enum: ["virtual", "on_location"]
    },
    meetLink: {
        type: String,
    },
    startTime: {
        type: String,
    },
    endTime: {
        type: String,
    },
    day: { type: String },
    teachers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        }
    ],
    description: {
        type: String,
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model("Lessons", lessonSchema)