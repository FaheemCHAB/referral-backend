const rewardService = require("../services/reward-service");
const asyncHandler = require("../utils/asyncHandler");

const getAllRewards = asyncHandler(async (req, res) => {
    try {
        const rewards = await rewardService.getAllRewards();
        res.status(200).json(rewards);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch rewards", error: error.message });
    }
});

const createOrUpdateReward = asyncHandler(async (req, res) => {
    try {
        const { userId, amount, status, remarks } = req.body;

        if (!userId  || amount == null) {
            return res.status(400).json({ message: "Missing required fields (userId, amount)" });
        }

        const reward = await rewardService.createOrUpdateReward(userId, amount, status, remarks);
        res.status(201).json({ 
            message: "Reward updated successfully", 
            reward 
        });     
    } catch (error) {    
        res.status(500).json({ 
            message: "Failed to create/update reward", 
            error: error.message 
        });
    } 
});

const getRewardsByUserId = asyncHandler(async (req, res) => {
    try {
        const rewards = await rewardService.getRewardsByUserId(req.params.userId);  
        res.status(200).json(rewards);
    } catch (error) {    
        res.status(500).json({ message: "Failed to fetch rewards", error: error.message });
    }
}); 


const updateRewardStatus = asyncHandler(async (req, res) => {
    try {
        const { rewardId } = req.params; // Changed from userId to rewardId
        const { status } = req.body; // Get status from request body
        
        const reward = await rewardService.updateRewardStatus(rewardId, status);
        
        if (reward) {
            res.status(200).json({ message: "Reward status updated successfully", reward });
        } else {
            res.status(404).json({ message: "Reward not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to update reward status", error: error.message });
    }
});

const getAllUserBonusPoints = asyncHandler(async (req, res) => {
    try {
        const leaderboard = await rewardService.getAllUserBonusPoints();
        
        // Extract top performers (only if there are any)
        const topPerformers = leaderboard.slice(0, Math.min(3, leaderboard.length));
        
        res.status(200).json({
            leaderboard,
            topPerformers,
            totalParticipants: leaderboard.length
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch leaderboard", error: error.message });
    }
});


module.exports = {
    getAllRewards,
    createOrUpdateReward,   
    getRewardsByUserId,
    updateRewardStatus,
    getAllUserBonusPoints,
    
};