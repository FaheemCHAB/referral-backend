const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const rewardSchema = new Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    amount : {
        type: Number,
        default: 0, 
    },
    status: {
        type: String,
        enum: ["pending", "processing", "paid"], // Reward status options
    },
    history: [
        {
          amount: Number,
          date: { type: Date, default: Date.now },
          referralId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Referral",
        },
          remarks : {
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
    {timestamps : true}
);

const Reward = mongoose.model("Reward", rewardSchema);

module.exports = Reward