const mongoose = require("mongoose");

const studentDetailSchema = mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    RBA_ACCOUNT:{
        type:Boolean,
        default:true,
    },
    RBA_PROFILE:{
        type:Boolean,
        default:false,
    },
    pro_rate_charge:{
        type:Boolean,
        default:false,
    },
}, { timestamps: true });

module.exports = mongoose.model("StudentDetails", studentDetailSchema)