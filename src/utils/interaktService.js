const axios = require('axios');
const Campaign = require('../models/campaign');
const Message = require('../models/message');
const User = require('../models/user'); // Import User model

const sendUserToInterakt = async (userData) => {
    try {
        const interaktData = {
            phoneNumber: userData.mobile,
            countryCode: "+91",
            traits: {
                name: userData.name,
                email: userData.email,
                userId: userData._id.toString(),
                source: 'web_application',
            },
            add_to_sales_cycle: true,
            createdAt: new Date().toISOString(),
            tags: ["referral"]
        };

        const response = await axios.post('https://api.interakt.ai/v1/public/track/users/', interaktData, {
            headers: {
                'Authorization': `Basic ${process.env.INTERAKT_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('User successfully sent to Interakt:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending user to Interakt:', error.response?.data || error.message);
        return null;
    }
}

const getTemplates = async (filters = {}) => {
    try {
        const defaultFilters = {
            autosubmitted_for: 'all',
            approval_status: 'APPROVED',
            variable_present: 'Yes/No',
            language: 'all'
        };

        const mergedFilters = { ...defaultFilters, ...filters };
        const cleanFilters = {};

        Object.keys(mergedFilters).forEach(key => {
            const value = mergedFilters[key];
            if (value !== '' && value !== null && value !== undefined) {
                if (key === 'offset') {
                    const offsetNum = parseInt(value, 10);
                    if (!isNaN(offsetNum) && offsetNum >= 0) {
                        cleanFilters[key] = offsetNum;
                    }
                } else {
                    cleanFilters[key] = value;
                }
            }
        });

        const queryString = new URLSearchParams(cleanFilters).toString();

        const response = await axios.get(`https://api.interakt.ai/v1/public/track/organization/templates`, {
            headers: {
                'Authorization': `Basic ${process.env.INTERAKT_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Templates retrieved successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting templates from Interakt:', error.response?.data || error.message);
        throw error;
    }
};

const createCampaign = async (campaignData) => {
    try {
        const response = await axios.post('https://api.interakt.ai/v1/public/create-campaign/', campaignData, {
            headers: {
                'Authorization': `Basic ${process.env.INTERAKT_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const { data } = response.data;

        const newCampaign = new Campaign({
            campaign_id: data.campaign_id,
            name: data.name,
            type: data.type,
            template: {
                name: campaignData.template.name,
                languageCode: campaignData.template.languageCode,
                headerValues: campaignData.template?.headerValues || [],
                bodyValues: campaignData.template?.bodyValues || []
            }
        });

        await newCampaign.save();

        console.log('Campaign created successfully:', newCampaign);

        return newCampaign;

    } catch (error) {
        console.error('Error creating campaign in Interakt:', error.response?.data || error.message);
        throw error;
    }
};

const getAllCampaigns = async () => {
    try {
        const campaigns = await Campaign.find({});
        return campaigns;
    } catch (error) {
        console.error('Error fetching campaigns from database:', error.message);
        throw error;
    }
};

// Helper function to generate referral link
const generateReferralLink = (userId) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    return `${frontendUrl}/user/refer?ref=${userId}`;
};

// Helper function to process body values and replace referral_url placeholder
const processBodyValues = async (bodyValues, phoneNumber) => {
    try {
        // Find user by phone number to get their _id for referral link
        const user = await User.findOne({ mobile: phoneNumber.replace(/^\+91/, '') });
        
        if (!user) {
            console.warn(`User not found for phone: ${phoneNumber}`);
            return bodyValues; // Return original values if user not found
        }

        // Generate referral link for this user
        const referralLink = generateReferralLink(user._id);

        // Process each body value
        const processedValues = bodyValues.map(value => {
            // If the value is 'referral_url' (placeholder), replace with actual link
            if (value === 'referral_url') {
                return referralLink;
            }
            return value; // Keep other values as-is
        });

        return processedValues;
    } catch (error) {
        console.error('Error processing body values:', error);
        return bodyValues; // Return original values on error
    }
};

const sendTemplate = async (messageData) => {
    try {
        // Process body values - replace 'referral_url' with actual generated link if needed
        let processedBodyValues = messageData.template.bodyValues;
        
        if (messageData.template.bodyValues && messageData.template.bodyValues.includes('referral_url')) {
            processedBodyValues = await processBodyValues(
                messageData.template.bodyValues,
                messageData.fullPhoneNumber
            );
        }

        // Create payload for Interakt with processed body values
        const interaktPayload = {
            countryCode: messageData.countryCode,
            fullPhoneNumber: messageData.fullPhoneNumber,
            campaignId: messageData.campaignId,
            callbackData: messageData.callbackData,
            type: "Template",
            template: {
                name: messageData.template.name,
                languageCode: messageData.template.languageCode,
                bodyValues: processedBodyValues
            }
        };

        // Add headerValues if present
        if (messageData.template.headerValues && messageData.template.headerValues.length > 0) {
            interaktPayload.template.headerValues = messageData.template.headerValues;
        }

        // Add buttonValues if present (for clickable URL buttons)
        if (messageData.template.buttonValues) {
            interaktPayload.template.buttonValues = messageData.template.buttonValues;
        }

        console.log('Sending to Interakt:', JSON.stringify(interaktPayload, null, 2));

        // Send to Interakt API
        const response = await axios.post('https://api.interakt.ai/v1/public/message/', interaktPayload, {
            headers: {
                'Authorization': `Basic ${process.env.INTERAKT_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const { data } = response.data;

        // Save message to database with processed values
        const messageTemplate = new Message({
            countryCode: messageData.countryCode,
            fullPhoneNumber: messageData.fullPhoneNumber,
            campaignId: messageData.campaignId,
            callbackData: messageData.callbackData,
            type: "Template",
            template: {
                name: messageData.template.name,
                languageCode: messageData.template.languageCode,
                headerValues: messageData.template?.headerValues || [],
                bodyValues: processedBodyValues,
                buttonValues: messageData.template?.buttonValues || null
            }
        });

        await messageTemplate.save();

        console.log('Message sent successfully:', messageTemplate);

        return {
            success: true,
            message: messageTemplate,
            interaktResponse: data
        };
    } catch (error) {
        console.error('Error sending message to Interakt:', error.response?.data || error.message);
        throw error;
    }
};


module.exports = {
    sendUserToInterakt,
    getTemplates,
    createCampaign,
    getAllCampaigns,
    sendTemplate,
    generateReferralLink // Export if needed elsewhere
};