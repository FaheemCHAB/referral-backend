const mongoose = require("mongoose");
const { Schema } = require("mongoose");


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
    { timestamps: true }
)

const User = mongoose.model("User", userSchema)

module.exports = User