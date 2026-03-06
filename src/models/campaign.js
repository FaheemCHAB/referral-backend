const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema(
  {
    campaign_id: { type: String, required: true },
    name: { type: String },
    type: { type: String, required: true, default: "PublicAPI" },
    template: {
      name: String,
      languageCode: String,
      headerValues: [String],
      bodyValues: [String]
    } 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", CampaignSchema);
