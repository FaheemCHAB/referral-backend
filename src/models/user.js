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
        number: { type: String, required: true },
        internationalNumber: { type: String },
        nationalNumber: { type: String },
        e164Number: { type: String },
        countryCode: { type: String },
        dialCode: { type: String },
        required: [true, "Mobile number is required"],
        // validate: {
        //   validator: (v) => /^\d{10}$/.test(v),
        //   message: "Mobile number must be 10 digits",
        // },
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
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
    { timestamps: true }
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