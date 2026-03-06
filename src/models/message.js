const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const messageSchema = new Schema(

    {
        countryCode: String,
        phoneNumber: String,
        fullPhoneNumber: String,
        campaignId: String,
        callbackData: String,
        type: { type: String, default: "Template" },
        template: {
            name: String,
            languageCode: String,
            headerValues: [
                String
            ],
            bodyValues: [
                String
            ],
            buttonValues: {
                type: Object,
            }
        }

    });

module.exports = mongoose.model("Message", messageSchema);
