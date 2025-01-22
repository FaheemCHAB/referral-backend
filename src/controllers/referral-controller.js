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

const searchByReferredBy = asyncHandler(async (req, res) => {
    try {
        const { referredBy, startDate, endDate } = req.query;
    
        // Convert date strings to date objects
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
    
        // Call the service method to search for referrals with filters
        const referrals = await referralService.searchByReferredBy(referredBy, start, end);
        res.status(200).json(referrals);
      } catch (error) {
        res.status(500).json({ message: "Failed to search referrals by referredBy", error: error.message });
      }
});

const searchByName = asyncHandler(async (req, res) => {
    try {
        const { name } = req.query; // Get the name parameter from the query
        const referrals = await referralService.searchByName(name); // Pass it to the service
        res.status(200).json(referrals); // Return the found referrals
      } catch (error) {
        res.status(500).json({ message: "Failed to search referrals by name", error: error.message });
      }
});

const searchReferralsByUserId = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;
        const { name } = req.query;
        const referrals = await referralService.searchReferralsByUserId(userId, name);
        res.status(200).json(referrals);
    } catch (error) {
        res.status(500).json({ message: "Failed to search referrals by userId", error: error.message });
    }
});

module.exports = {
    getAllReferrals,
    createReferral,
    getReferralsByUserId,
    toggleReferralStatus,
    searchByReferredBy,
    searchByName,
    searchReferralsByUserId
};