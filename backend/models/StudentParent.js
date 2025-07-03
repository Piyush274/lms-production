const mongoose = require("mongoose");

const studentParentSchema = mongoose.Schema({
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    // relation:{
    //     type:String,
    // },
    status: {
        type: String,
        enum: ["active", "deleted"],
    },
    deletedAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model("StudentParent", studentParentSchema)