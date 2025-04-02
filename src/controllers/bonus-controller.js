const bonusService = require("../services/bonus-service");

const getAllBonuses = async (req, res) => {
    try {
        const bonuses = await bonusService.getAllBonuses();
        res.status(200).json(bonuses);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch bonuses", error: error.message });
    }
};

const getBonusesByUserId = async (req, res) => {
    try {
        const bonuses = await bonusService.getBonusesByUserId(req.params.userId);
        res.status(200).json(bonuses);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch bonuses", error: error.message });
    }
};

const createOrUpdateBonus = async (req, res) => {
    try {
        const { userId, bonusPoints, status, remarks } = req.body;
        
        // Validate required fields
        if (!userId || !bonusPoints) {
            return res.status(400).json({ message: "User ID and bonus points are required" });
        }
        
        const bonus = await bonusService.createOrUpdateBonus(
            userId, 
            parseInt(bonusPoints), 
            status, 
            remarks
        );
        
        res.status(201).json(bonus);
    } catch (error) {
        res.status(500).json({ message: "Failed to create/update bonus", error: error.message });
    }
};

const updateBonusStatus = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        
        const { status } = req.body;
        const { bonusId } = req.params;
        
        
        // Validate required fields
        if (!bonusId || !status) {
            return res.status(400).json({ message: "Bonus ID and status are required" });
        }
        
        const bonus = await bonusService.updateBonusStatus(bonusId, status);
        res.status(200).json(bonus);
    } catch (error) {
        res.status(500).json({ message: "Failed to update bonus status", error: error.message });
    }
};

const updateBonusByUserId = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("Request params:", req.params);
        
        const { data } = req.body;
        const bonusHistoryId = req.params.bonusId;
        
        // Get the updated history entry
        const updatedHistory = await bonusService.updateBonusByUserId(bonusHistoryId, data);
        
        if (!updatedHistory) {
            return res.status(404).json({ message: "Bonus history entry not found" });
        }
        
        res.status(200).json(updatedHistory);
    } catch (error) {
        res.status(500).json({ 
            message: "Failed to update bonus history", 
            error: error.message 
        });
    }
};

module.exports = {
    getAllBonuses,
    getBonusesByUserId,
    createOrUpdateBonus,
    updateBonusStatus,
    updateBonusByUserId
};