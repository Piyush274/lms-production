const mongoose = require("mongoose");

const virtualConsultationSchema = mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    date: {
        type: String,
        required:true
    },
    day: {
        type: String,
        required:true
    },
    startTime: {
        type: String,
        required:true,
    },
    endTime: {
        type: String,
        required:true
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model("VirtualConsultation", virtualConsultationSchema)