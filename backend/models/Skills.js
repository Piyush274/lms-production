const mongoose = require("mongoose");

const filesSchema = mongoose.Schema({
    url: {
        type: String,
    },
    title: {
        type: String,
    },
}, { timestamps: true });

const ExternalVideosSchema = mongoose.Schema({
    title: {
        type: String,
    },
    link: {
        type: String,
    },
    description: {
        type: String,
    },
}, { timestamps: true });

const skillSchema = mongoose.Schema({
    title: {
        type: String,
    },
    instrument: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instruments"
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    description: {
        type: String,
    },
    personalTutorials: [filesSchema],
    studentResponseVideos: [filesSchema],
    tutorialVideos: [filesSchema],
    supportingDocuments: [filesSchema],
    externalVideos: [ExternalVideosSchema],
    notes: [String],
    status: {
        type: String,
        enum: ["active", "inactive", "completed", "deleted"],
        default: "active"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    deletedAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model("Skills", skillSchema)