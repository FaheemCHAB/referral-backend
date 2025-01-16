const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const User = require("./user");

const referralSchema =  new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    mobile : {
        type : String,
        number: { type: String, required: true },
        internationalNumber: { type: String },
        nationalNumber: { type: String },
        e164Number: { type: String },
        countryCode: { type: String },
        dialCode: { type: String },
        required: [true, "Mobile number is required"],

    },
    place : {
        type : String,
        required : true
    },
    qualification : {
        type : String,
        required : true
    },
    age: {
        type : Number,
        required : true,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    referredBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : User,
        required : true
    }
},
    {timestamps : true});

const Referral = mongoose.model("Referral", referralSchema)

module.exports = Referral