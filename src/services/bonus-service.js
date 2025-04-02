const Bonus = require("../models/bonus");
const mongoose = require("mongoose");

const getAllBonuses = async () => {
    try {
        const bonuses = await Bonus.find().populate({
            path: "user", // Reference the "user" field
            select: "name email" // Fetch specific user fields
        });
        return bonuses;
    } catch (error) {
        throw new Error("Error occurred while fetching bonuses: " + error.message);
    }
};

const getBonusesByUserId = async (userId) => {
    try {
        const bonuses = await Bonus.find({ user: userId });
        return bonuses;
    } catch (error) {
        throw new Error("Error occurred while fetching bonuses: " + error.message);
    }
};

// Convert bonus points to rupees (1 point = 10 rupees)
const calculateAmount = (bonusPoints) => {
    return bonusPoints * 10;
};

const createOrUpdateBonus = async (userId, bonusPointsToAdd, status, remarks) => { 
    try {
        let bonus = await Bonus.findOne({ user: userId }).populate({
            path: "user", // Reference the "user" field
            select: "name email" // Fetch specific user fields
        });;
        
        // Calculate amount based on bonus points (1 point = 10 rupees)
        const amountToAdd = calculateAmount(bonusPointsToAdd);

        if (!bonus) {
            // Create new bonus record with an initial history entry
            bonus = new Bonus({
                user: userId,
                bonusPoints: bonusPointsToAdd,
                amount: amountToAdd,
                status: status || "pending",
                history: [
                    {
                        bonusPoints: bonusPointsToAdd,
                        amount: amountToAdd,
                        status: status || "pending",
                        remarks: remarks || "",
                        date: new Date()
                    }
                ]
            });
        } else {
            // Add new entry to history
            bonus.history.push({
                bonusPoints: bonusPointsToAdd,
                amount: amountToAdd,
                status: status || "pending",
                remarks: remarks || "",
                date: new Date()
            });

            // Recalculate total bonus points and amount based on history
            bonus.bonusPoints = bonus.history.reduce((total, entry) => {
                return total + (parseInt(entry.bonusPoints) || 0);
            }, 0);
            
            // Update total amount
            bonus.amount = bonus.history.reduce((total, entry) => {
                return total + (entry.amount || 0);
            }, 0);
            
            // Update status if a new status is provided
            if (status) {
                bonus.status = status;
            }
        }

        await bonus.save();
        return bonus;
    } catch (error) {
        throw new Error("Error occurred while updating bonus: " + error.message);
    }  
};


const updateBonusStatus = async (bonusId, newStatus) => {
    try {
        console.log("History ID received:", bonusId);
        console.log("Status received:", newStatus);
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(bonusId)) {
            console.log("Invalid ObjectId format!");
            return null;
        }
        
        // Find reward containing the history item ID
        const reward = await Bonus.findOne({
            "history._id": bonusId
        });
        
        console.log("Found reward:", reward);
        
        if (!reward) {
            console.log("No reward found with this history ID");
            
            // DEBUG: List all rewards to help troubleshoot
            const allRewards = await Bonus.find({}).select('_id');
            console.log("Available reward IDs:", allRewards.map(r => r._id));
            
            return null;
        }

        // Validate new status
        if (!["pending", "processing", "paid"].includes(newStatus)) {
            throw new Error("Invalid status value");
        }

        // Find the history item in the array and update its status
        const historyItem = reward.history.id(bonusId);
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

const updateBonusByUserId = async (bonusId, data) => {
    try {
        console.log("Updating bonus history with ID:", bonusId);
        
        // Find the bonus document containing the history entry
        const bonus = await Bonus.findOne({ "history._id": bonusId });
        
        if (!bonus) {
            console.log("No bonus contains history with ID:", bonusId);
            return null;
        }
        
        // Find the specific history entry in the array
        const historyIndex = bonus.history.findIndex(
            item => item._id.toString() === bonusId
        );
        
        if (historyIndex === -1) {
            console.log("History entry not found in bonus");
            return null;
        }
        
        // Calculate amount based on bonus points if needed
        if (data.bonusPoints) {
            data.amount = calculateAmount(data.bonusPoints);
        }
        
        // Update the specific history entry
        Object.keys(data).forEach(key => {
            bonus.history[historyIndex][key] = data[key];
        });
        
        // Update the parent document's total values
        bonus.bonusPoints = bonus.history.reduce(
            (total, item) => total + item.bonusPoints, 0
        );
        
        bonus.amount = bonus.history.reduce(
            (total, item) => total + item.amount, 0
        );
        
        // Save the parent document
        await bonus.save();
        
        // Return the updated history entry
        return bonus.history[historyIndex];
    } catch (error) {
        console.error("Error updating bonus history:", error);
        throw new Error("Error occurred while updating bonus history: " + error.message);
    }
};

module.exports = { getAllBonuses, getBonusesByUserId, createOrUpdateBonus, updateBonusStatus, updateBonusByUserId };