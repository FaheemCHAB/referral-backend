const Reward = require("../models/rewards");
const mongoose = require("mongoose");
const getAllRewards = async () => {
    try {
        const rewards = await Reward.find().populate({
            path: "user", // Reference the "user" field
            select: "name email" // Fetch specific user fields
        }).populate({
            path: "history.referralId", // Change this to populate referralId inside history
            select: "name email mobile" // Select fields you want from the Referral model
        });

        if(!rewards || rewards.length === 0) {  
            console.log("No rewards found");
            return null;
        }

        return rewards;
        
    } catch (error) {
        throw new Error("Error occurred while fetching rewards: " + error.message);
    }
};              

const createOrUpdateReward = async (userId, referralId, amountToAdd, status, remarks) => {
    console.log("createOrUpdateReward started");
  try {
    console.log("User ID received:", userId);
    console.log("Referral ID received:", referralId);
    console.log("Amount received:", amountToAdd);
    
    if (!referralId) {
      console.log("referralId is missing");
      throw new Error("ReferralId is missing");
    }

    // Check if this referral has already been rewarded
    const existingReward = await Reward.findOne({
      user: userId,
      "history.referralId": referralId
    });

    if (existingReward) {
      console.log("This referral has already been rewarded");
      throw new Error("This referral has already been rewarded");
    }

    let reward = await Reward.findOne({ user: userId });
    console.log("reward found:", reward);

    if (!reward) {
      console.log("No reward found, creating a new one");
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
            referralId: referralId  // Store referralId in history
          }
        ]
      });
    } else {
      console.log("Reward found, updating it");
      // Add new entry to history with the referralId
      reward.history.push({
        amount: amountToAdd,
        status: status || reward.status,
        date: new Date(),
        remarks: remarks || "",
        referralId: referralId  // Store referralId in history
      });
      
      reward.amount = reward.history.reduce((total, entry) => total + (entry.amount || 0), 0);

      // Update status if a new status is provided
      if (status) {
        reward.status = status;
      }
    }
    
    console.log("Before reward save");
    await reward.save();
    console.log("reward saved");
    return reward;
  } catch (error) {
    console.log("Error occurred while updating reward:", error);
    throw new Error("Error occurred while updating reward: " + error.message);
  } finally {
    console.log("createOrUpdateReward ended");
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
        const rewards = await Reward.find({ user: userId })
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

const updateRewardByrewardId = async (rewardId, data) => {
    try {
        console.log("Updating reward history with ID:", rewardId);
        
        // Find the bonus document containing the history entry
        const reward = await Reward.findOne({ "history._id": rewardId });
        
        if (!reward) {
            console.log("No reward contains history with ID:", rewardId);
            return null;
        }
        
        // Find the specific history entry in the array
        const historyIndex = reward.history.findIndex(
            item => item._id.toString() === rewardId
        );
        
        if (historyIndex === -1) {
            console.log("History entry not found in reward");
            return null;
        }
        
        // Calculate amount based on reward points if needed
        // if (data.rewardPoints) {
        //     data.amount = calculateAmount(data.rewardPoints);
        // }
        
        // Update the specific history entry
        Object.keys(data).forEach(key => {
            reward.history[historyIndex][key] = data[key];
        });
        
        // Update the parent document's total values
        reward.rewardPoints = reward.history.reduce(
            (total, item) => total + item.rewardPoints, 0
        );
        
        reward.amount = reward.history.reduce(
            (total, item) => total + item.amount, 0
        );
        
        // Save the parent document
        await reward.save();
        
        // Return the updated history entry
        return reward.history[historyIndex];
    } catch (error) {
        console.error("Error updating reward history:", error);
        throw new Error("Error occurred while updating reward history: " + error.message);
    }
};



module.exports = {
    getAllRewards,
    createOrUpdateReward,
    getRewardsByUserId,
    searchRewards,
    updateRewardStatus,
    getAllUserBonusPoints,
    updateRewardByrewardId
 
};