const Referral = require("../models/referral");

const getAllReferrals = async () => {
    try { 
        const referrals = await Referral.find().populate('referredBy', 'name');
        return referrals;
    } catch (error) {    
        throw new Error("Error occurred while fetching referrals: " + error.message);
    }
}

const getReferralsByUserId = async (userId) => {
    try {
        console.log("UserID:", userId);
        const referrals = await Referral.find({ referredBy: userId }).populate('referredBy', 'name');
        console.log("Raw query result:", referrals);
        
        return referrals;
    } catch (error) {
        console.error("Error:", error.message);
        throw new Error("Error occurred while fetching referrals: " + error.message);
    }
}

const createReferral = async (referralData) => {
    try {
        console.log("hi");
        if (!referralData.mobile || typeof referralData.mobile !== 'object' || !referralData.mobile.e164Number) {
            throw new Error("A valid mobile number is required.");
        }
        referralData.mobile = referralData.mobile.e164Number; // Use the E.164 format
        const referral = await Referral.create(referralData);
        console.log("Referral created successfully", referral);
        
        return referral;
    } catch (error) {
        throw new Error("Error occurred while creating referral: " + error.message);
    }
}

const toggleReferralStatus = async (userId) => {
    try {
        const referral = await Referral.findById(userId);
        if (referral) {
            referral.isActive = !referral.isActive; // Toggle the status
            await referral.save();
            console.log("Referral status updated successfully", referral.isActive);
            return referral;
        } else {
            return null; // Referral not found
        }
    } catch (error) {
        throw new Error("Error occurred while toggling referral status: " + error.message);
    }
}

module.exports = {
    getAllReferrals,
    createReferral,
    getReferralsByUserId,
    toggleReferralStatus
}