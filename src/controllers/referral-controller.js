const referralService = require("../services/referral-service");
const asyncHandler = require("../utils/asyncHandler");

const getAllReferrals = asyncHandler (async (req, res) => {
    try {
        const referrals = await referralService.getAllReferrals();
        res.status(200).json(referrals);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch referrals", error: error.message });
    }
});

const getReferralsByUserId = asyncHandler( async (req, res) => {
    try {
        const referrals = await referralService.getReferralsByUserId(req.params.userId);
        res.status(200).json(referrals);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch referrals", error: error.message });
    }
});

const createReferral =  asyncHandler(async (req, res) => {
    try {
        const referral = await referralService.createReferral(req.body);
        res.status(201).json(referral);
    } catch (error) {
        res.status(500).json({ message: "Failed to create referral", error: error.message });
    }
});


const toggleReferralStatus = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;
        const referral = await referralService.toggleReferralStatus(userId);
        if (referral) {
            res.status(200).json({ message: "Referral status updated successfully", referral });
        } else {
            res.status(404).json({ message: "Referral not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to update referral status", error: error.message });
    }
});

module.exports = {
    getAllReferrals,
    createReferral,
    getReferralsByUserId,
    toggleReferralStatus
};