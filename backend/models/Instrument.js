const mongoose = require("mongoose");

const instrumentSchema = mongoose.Schema({
    name: {
        type: String,
    },
    instrumentImage: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model("Instruments", instrumentSchema)