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
        
        const referral = await Referral.create(referralData);
        console.log("Referral created successfully", referral);
        
        return referral;
    } catch (error) {
        throw new Error("Error occurred while creating referral: " + error.message);
    }
}

module.exports = {
    getAllReferrals,
    createReferral,
    getReferralsByUserId
}