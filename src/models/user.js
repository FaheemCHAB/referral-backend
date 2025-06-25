const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const jwt = require('jsonwebtoken');


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/\S+@\S+\.\S+/, "Invalid email address"],
    },
    mobile: {
        type: String,
        required: [true, "Mobile number is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
    },
    statusCounts: {
        type: Object,
        default: {
            totalLeads: 0,
            attended: 0,
            notAttended: 0,
            registered: 0,
            joined: 0
        }
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    refreshToken: {
        type: String,
        default: null
    }
},
    { timestamps: true, versionKey: false }
);

userSchema.methods.generateAcessToken = function () {
    const token = jwt.sign({
        _id: this._id
    },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    return token;
}

userSchema.methods.generateRefreshToken = function () {
    const token = jwt.sign({
        _id: this._id
    },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
    return token;
}

const User = mongoose.model("User", userSchema)

module.exports = User