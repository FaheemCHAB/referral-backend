const mongoose = require("mongoose");
const { Schema } = require("mongoose");


const referralSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false, 
    },
    mobile: {
        type: String,
        required: [true, "Mobile number is required"],
        validate: {
            validator: function (v) {
                // Basic E.164 format validation (starts with + followed by digits)
                return /^\+\d+$/.test(v);
            },
            message: props => `${props.value} is not a valid mobile number!`
        }
    },
    place: {
        type: String,
        required: false,
    },
    qualification: {
        type: String,
        required: false,
    },
    passOutYear: {
        type: Date,
        required: false,
    },
    attendanceStatus: {
        type: String,
        enum: ["Attended", "Not-Attended", "Registered", "Joined"], // Enum-like behavior
        default: "Not-Attended",
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    remarks: {
        type: String,
        required: false,
    },
    areaOfInterest: {
        type: String,
        required: false,
    },
    otherInterest: {
        type: String,
        required: false,
    },
    careerStage: {
        type: Object,
        default: {
            nonIT: false,
            backlog: false,
            careerBreak: false,
            fresher: false,
            unskilled: false,
            careerSwitch: false
        }
    },

},
    { timestamps: true , versionKey: false } // Disable versioning
);

const Referral = mongoose.model("Referral", referralSchema);

module.exports = Referral;