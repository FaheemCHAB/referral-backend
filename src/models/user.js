const mongoose = require("mongoose");
const { Schema } = require("mongoose");


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
        type: Number,
        required: [true, "Mobile number is required"],
        validate: {
          validator: (v) => /^\d{10}$/.test(v),
          message: "Mobile number must be 10 digits",
        },
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
},
    { timestamps: true }
);

const User = mongoose.model("User", userSchema)

module.exports = User