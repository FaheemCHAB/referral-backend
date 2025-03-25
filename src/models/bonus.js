const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const bonusSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    bonusPoints: {
        type: Number,
        default: 0,
    },
    
    amount: {
        type: Number,
        default: 0,
    },
    // status: {
    //     type: String,
    //     enum: ["pending", "processing", "paid"], // Reward status options
    // },
    history: [
        {
            amount: Number,
            bonusPoints: Number,
            date: { type: Date, default: Date.now },
            remarks: {
                type: String,
                required: false
            },
            status: {   
                type: String,
                enum: ["pending", "processing", "paid"], // Same enum for history status            
            },
        },
    ],
},
    { timestamps: true }
);

module.exports = mongoose.model("Bonus", bonusSchema);