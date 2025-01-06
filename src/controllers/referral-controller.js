const referralService = require("../services/referral-service");

const getAllReferrals = async (req, res) => {
    try {
        const referrals = await referralService.getAllReferrals();
        res.status(200).json(referrals);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch referrals", error: error.message });
    }
};

const getReferralsByUserId = async (req, res) => {
    try {
        const referrals = await referralService.getReferralsByUserId(req.params.userId);
        res.status(200).json(referrals);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch referrals", error: error.message });
    }
};

const createReferral = async (req, res) => {
    try {
        const referral = await referralService.createReferral(req.body);
        res.status(201).json(referral);
    } catch (error) {
        res.status(500).json({ message: "Failed to create referral", error: error.message });
    }
};

module.exports = {
    getAllReferrals,
    createReferral,
    getReferralsByUserId
};