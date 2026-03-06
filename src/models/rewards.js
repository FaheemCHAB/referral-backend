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
          createdAt: { type: Date, default: Date.now },
          updatedAt: { type: Date, default: Date.now}
          
        },

      ],
      statusHistory: [
        {
            historyItemId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true // References the history item that was updated
            },
            previousStatus: {
                type: String,
                enum: ["pending", "processing", "paid"],
            },
            newStatus: {
                type: String,
                enum: ["pending", "processing", "paid"],
            },
            updatedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", // Admin who made the change
            },
            remarks: String,
            updatedAt: { type: Date, default: Date.now }
        }
    ]
},
    {timestamps : true,versionKey: false} // Disable versioning
);

rewardSchema.add({
  history: [{
      amount: Number,
      date: { type: Date, default: Date.now },
      referralId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Referral",
      },
      remarks: {
          type: String,
          required: false
      },
      status: {
          type: String,
          enum: ["pending", "processing", "paid"],
      },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
  }]
});

const Reward = mongoose.model("Reward", rewardSchema);

module.exports = Reward