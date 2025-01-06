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
        type : Number,
        required : true
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
    status : {
        type : String,
        required : true,
        default : "Pending" 
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