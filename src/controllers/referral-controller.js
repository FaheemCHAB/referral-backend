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


const updateReferralStatus = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params; // This is actually the referralId in your case
        const { attendanceStatus } = req.body; // Match the frontend's field name
        
        console.log('Referral ID received:', userId); // Log for debugging
        console.log('New status received:', attendanceStatus); // Log for debugging
        
        if (!attendanceStatus) {
            return res.status(400).json({ message: "Attendance status is required" });
        }
        
        // Calling service function with corrected parameter names
        const referral = await referralService.updateReferralStatus(userId, attendanceStatus);
        
        if (referral) {
            res.status(200).json({ 
                message: "Referral status updated successfully", 
                referral 
            });
        } else {
            res.status(404).json({ message: "Referral not found" });
        }
    } catch (error) {
        console.error("Error in updateReferralStatus controller:", error);
        res.status(500).json({ 
            message: "Failed to update referral status", 
            error: error.message 
        });
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

const getReferralCount = asyncHandler(async (req, res) => {
    try {
        const count = await referralService.getReferralCount();
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch referral count", error: error.message });
    }
}); 

const getReferralStatusCounts = asyncHandler(async (req, res) => {
    try {
        const counts = await referralService.getReferralStatusCounts();
        res.status(200).json(counts);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch referral status counts", error: error.message });
    }
});

const getRecentReferrals = asyncHandler(async (req, res) => {
    try {
        const referrals = await referralService.getRecentReferrals();
        res.status(200).json(referrals);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch recent referrals", error: error.message });
    }
}); 

module.exports = {
    getAllReferrals,
    createReferral,
    getReferralsByUserId,
    updateReferralStatus,
    searchByReferredBy,
    searchByName,
    searchReferralsByUserId,
    getReferralCount,
    getReferralStatusCounts,
    getRecentReferrals
};