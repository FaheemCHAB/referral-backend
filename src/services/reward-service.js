const Reward = require("../models/rewards");
const mongoose = require("mongoose");
const getAllRewards = async () => {
    try {
        const rewards = await Reward.find().populate({
            path: "user", // Reference the "user" field
            select: "name email" // Fetch specific user fields
        });
        return rewards;
        
    } catch (error) {
        throw new Error("Error occurred while fetching rewards: " + error.message);
    }
};              

const createOrUpdateReward = async (userId, amountToAdd, status,remarks) => { 
    try {
        let reward = await Reward.findOne({ user: userId });

        if (!reward) {
            // Create new reward with an initial history entry
            reward = new Reward({
                user: userId,
                amount: amountToAdd,
                status: status || "pending",
                history: [
                    {
                        amount: amountToAdd,
                        status: status || "pending",
                        date: new Date(),
                        remarks: remarks || "",
                    }
                ]
            });
        } else {
            // Add new entry to history
            reward.history.push({
                amount: amountToAdd,
                status: status || reward.status,
                date: new Date(),
                remarks: remarks || "",
            });

            // Recalculate total bonus points and amount based on history
            // reward.bonusPoints = reward.history.reduce((total, entry) => {
            //     // Ensure we're adding the actual bonus points, not concatenating
            //     return total + (entry.bonusPoints || 0);
            // }, 0);
            
            reward.amount = reward.history.reduce((total, entry) => total + (entry.amount || 0), 0);

            // Update status if a new status is provided
            if (status) {
                reward.status = status;
            }
        }

        await reward.save();
        return reward;
    } catch (error) {
        throw new Error("Error occurred while updating reward: " + error.message);
    }  
};


const updateRewardStatus = async (historyItemId, newStatus) => {
    try {
        console.log("History ID received:", historyItemId);
        console.log("Status received:", newStatus);
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(historyItemId)) {
            console.log("Invalid ObjectId format!");
            return null;
        }
        
        // Find reward containing the history item ID
        const reward = await Reward.findOne({
            "history._id": historyItemId
        });
        
        console.log("Found reward:", reward);
        
        if (!reward) {
            console.log("No reward found with this history ID");
            
            // DEBUG: List all rewards to help troubleshoot
            const allRewards = await Reward.find({}).select('_id');
            console.log("Available reward IDs:", allRewards.map(r => r._id));
            
            return null;
        }

        // Validate new status
        if (!["pending", "processing", "paid"].includes(newStatus)) {
            throw new Error("Invalid status value");
        }

        // Find the history item in the array and update its status
        const historyItem = reward.history.id(historyItemId);
        if (!historyItem) {
            throw new Error("History item not found in reward");
        }
        
        historyItem.status = newStatus;
        
        // You may also want to update the parent reward's status
        // depending on your business logic
        reward.status = newStatus;

        await reward.save();
        return reward;
    } catch (error) {
        console.error("Error in service:", error);
        throw new Error("Error updating reward status: " + error.message);
    }
};

const getRewardsByUserId = async (userId) => {
    try {
        const rewards = await Reward.find({ user: userId });
        return rewards;
        
    } catch (error) {
        throw new Error("Error occurred while fetching rewards: " + error.message);
    }
};  

const searchRewards = async (query) => {
    try {
        const rewards = await Reward.find({ $text: { $search: query } });
        return rewards;
        
    } catch (error) {
        throw new Error("Error occurred while searching rewards: " + error.message);
    }
};

const getAllUserBonusPoints = async () => {
    try {
        // Find all rewards with valid user ObjectIds
        const rewards = await Reward.find({})
            .populate('user', 'name email username') // Populate user details
            .lean(); // Convert to plain JavaScript objects
            console.log(rewards, "+++++++++++++++++++++++++++++++++++++++++++++++++++");
            
        
        // Filter out any rewards with invalid user references
        const validRewards = rewards.filter(reward => 
            reward.user && typeof reward.user === 'object');
            console.log(validRewards);
            
        
        // Transform data into the format needed for the leaderboard
        const leaderboard = [];
        const userMap = {};
        
        // Group bonus points by user
        validRewards.forEach(reward => {
            const userId = reward.user._id.toString();
            
            if (!userMap[userId]) {
                userMap[userId] = {
                    _id: reward.user._id,
                    name: reward.user.name,
                    username: reward.user.username,
                    email: reward.user.email,
                    totalBonusPoints: 0
                };
                leaderboard.push(userMap[userId]);
            }
            
            userMap[userId].totalBonusPoints += reward.bonusPoints || 0;
        });
        
        // Sort by bonus points in descending order
        leaderboard.sort((a, b) => b.totalBonusPoints - a.totalBonusPoints);
        
        return leaderboard;
    } catch (error) {
        throw new Error("Error occurred while fetching rewards: " + error.message);
    }
};



module.exports = {
    getAllRewards,
    createOrUpdateReward,
    getRewardsByUserId,
    searchRewards,
    updateRewardStatus,
    getAllUserBonusPoints,
 
};