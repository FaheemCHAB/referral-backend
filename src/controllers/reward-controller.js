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
        const { userId, referralId, amount, status, remarks } = req.body;
        console.log("Request body:", req.body);
        
        if (!userId || amount == null) {
            return res.status(400).json({ 
                message: "Missing required fields (userId, amount)" 
            });
        }

        const reward = await rewardService.createOrUpdateReward(
            userId, 
            referralId, 
            amount, 
            status, 
            remarks
        );
        
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
        const { rewardId } = req.params; // This is actually the historyItemId
        const { status, remarks } = req.body; // Get status and optional remarks
        
        // Validate required fields
        if (!status) {
            return res.status(400).json({ 
                message: "Status is required" 
            });
        }

        // Validate status value
        if (!["pending", "processing", "paid"].includes(status)) {
            return res.status(400).json({ 
                message: "Invalid status. Must be pending, processing, or paid" 
            });
        }
        
        const reward = await rewardService.updateRewardStatus(rewardId, status, remarks);
        
        if (reward) {
            res.status(200).json({ 
                message: "Reward status updated successfully", 
                reward,
                info: "New history entry created to track the status change"
            });
        } else {
            res.status(404).json({ 
                message: "Reward history item not found" 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            message: "Failed to update reward status", 
            error: error.message 
        });
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

const updateRewardByrewardId = asyncHandler(async (req, res) => {
    try {
        const { rewardId } = req.params;
        const { data } = req.body; // Extract the data object
        
        console.log('Received request body:', req.body);
        console.log('Extracted data:', data);
        
        if (!data) {
            return res.status(400).json({ message: "Data is required" });
        }
        
        const reward = await rewardService.updateRewardByrewardId(rewardId, data);
        
        if (reward) {
            res.status(200).json({ message: "Reward updated successfully", reward });
        } else {
            res.status(404).json({ message: "Reward not found" });
        }
    } catch (error) {
        console.error('Controller error:', error);
        res.status(500).json({ message: "Failed to update reward", error: error.message });
    }
});


module.exports = {
    getAllRewards,
    createOrUpdateReward,   
    getRewardsByUserId,
    updateRewardStatus,
    getAllUserBonusPoints,
    updateRewardByrewardId
    
};