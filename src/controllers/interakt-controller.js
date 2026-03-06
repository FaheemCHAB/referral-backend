const interaktService = require("../utils/interaktService");

const getTemplates = async (req, res) => {
    try {
        // Clean up query parameters - remove empty values
        const filters = {};
        
        // Object.keys(req.query).forEach(key => {
        //     const value = req.query[key];
        //     if (value && value.trim() !== '') {
        //         // Special handling for offset
        //         if (key === 'offset') {
        //             const offsetNum = parseInt(value, 10);
        //             if (!isNaN(offsetNum) && offsetNum >= 0) {
        //                 filters[key] = offsetNum;
        //             }
        //         } else {
        //             filters[key] = value.trim();
        //         }
        //     }
        // });

        const templates = await interaktService.getTemplates(filters);
        res.status(200).json(templates);
    } catch (error) {
        console.error('Controller error:', error);
        res.status(500).json({ 
            message: "Failed to fetch templates", 
            error: error.message 
        });
    }
}

const createCampaign = async (req, res) => {
    try {
        const campaignData = req.body;
        if (!campaignData || Object.keys(campaignData).length === 0) {
            return res.status(400).json({ message: "Campaign data is required" });
        }

        const campaign = await interaktService.createCampaign(campaignData);
        res.status(201).json(campaign);
    }
    catch (error) {
        console.error('Controller error:', error);
        res.status(500).json({ 
            message: "Failed to create campaign", 
            error: error.message 
        });
    }
}

const getAllCampaigns = async (req, res) => {
    try {   
        const campaigns = await interaktService.getAllCampaigns();
        res.status(200).json(campaigns);
    }

    catch (error) {
        console.error('Controller error:', error);
        res.status(500).json({ 
            message: "Failed to fetch campaigns", 
            error: error.message 
        });
    }

}

const sendTemplate = async (req, res) => {
    try {

        const  messageData  = req.body;
        console.log("Message Data:", messageData);
        
        if (!messageData || Object.keys(messageData).length === 0) {    
            return res.status(400).json({ message: "Message data is required" });
        }
        const message = await interaktService.sendTemplate(messageData);
        res.status(201).json(message);
    }
    catch (error) {
        console.error('Controller error:', error);
        res.status(500).json({ 
            message: "Failed to send message", 
            error: error.message 
        });
    }

}


module.exports = {
    getTemplates,
    createCampaign,
    getAllCampaigns,
    sendTemplate
};