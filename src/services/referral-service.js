const Referral = require("../models/referral");

const getAllReferrals = async () => {
    try { 
        const referrals = await Referral.find().populate('referredBy', 'name');
        return referrals;
    } catch (error) {    
        throw new Error("Error occurred while fetching referrals: " + error.message);
    }
}

const getReferralsByUserId = async (userId) => {
    try {
        console.log("UserID:", userId);
        const referrals = await Referral.find({ referredBy: userId }).populate('referredBy', 'name');
        console.log("Raw query result:", referrals);
        
        return referrals;
    } catch (error) {
        console.error("Error:", error.message);
        throw new Error("Error occurred while fetching referrals: " + error.message);
    }
}

const createReferral = async (referralData) => {
    try {
        console.log("hi");
        if (!referralData.mobile || typeof referralData.mobile !== 'object' || !referralData.mobile.e164Number) {
            throw new Error("A valid mobile number is required.");
        }
        referralData.mobile = referralData.mobile.e164Number; // Use the E.164 format
        const referral = await Referral.create(referralData);
        console.log("Referral created successfully", referral);
        
        return referral;
    } catch (error) {
        throw new Error("Error occurred while creating referral: " + error.message);
    }
}

const toggleReferralStatus = async (userId) => {
    try {
        const referral = await Referral.findById(userId);
        if (referral) {
            referral.isActive = !referral.isActive; // Toggle the status
            await referral.save();
            console.log("Referral status updated successfully", referral.isActive);
            return referral;
        } else {
            return null; // Referral not found
        }
    } catch (error) {
        throw new Error("Error occurred while toggling referral status: " + error.message);
    }
}

const searchByReferredBy = async (referredBy, startDate, endDate) => {
    try {
        const query = [];
    
        // Join with the User collection
        query.push({
          $lookup: {
            from: 'users',
            localField: 'referredBy',
            foreignField: '_id',
            as: 'referredBy',
          },
        });
    
        // Unwind the referredBy array
        query.push({
          $unwind: {
            path: '$referredBy',
            preserveNullAndEmptyArrays: true, // Handle cases where referredBy might be null
          },
        });
    
        // Filter by referredBy name
        if (referredBy) {
          query.push({
            $match: {
              'referredBy.name': { $regex: referredBy, $options: 'i' },
            },
          });
        }
    
        // Filter by date range
        if (startDate && endDate) {
          query.push({
            $match: {
              createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
            },
          });
        }
    
        // Project fields to include
        query.push({
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            mobile: 1,
            place: 1,
            qualification: 1,
            dob: 1,
            isActive: 1, // Ensure isActive is included
            referredBy: { _id: 1, name: 1 }, // Include only relevant fields for referredBy
            createdAt: 1,
            updatedAt: 1,
          },
        });
    
        const referrals = await Referral.aggregate(query);
        return referrals;
      } catch (error) {
        throw new Error('Error occurred while searching referrals: ' + error.message);
      }
};

const searchByName = async (name) => {
    try { 
        const referrals = await Referral.find({
          $or: [
            { name: { $regex: name, $options: "i" } }, // Search by referral's name
            { email: { $regex: name, $options: "i" } }, // Optionally search by email
            { mobile: { $regex: name, $options: "i" } }, // Optionally search by mobile
          ],
        }).populate('referredBy', 'name');
    
        return referrals; // Return the list of matched referrals
      } catch (error) {
        throw new Error("Error occurred while searching referrals: " + error.message);
      }
};

const searchReferralsByUserId = async (userId, name) => {
    try {
        const referrals = await Referral.find({
            referredBy: userId,
            $or: [
                { name: { $regex: name, $options: "i" } }, // Search by referral's name 
                { email: { $regex: name, $options: "i" } }, // Optionally search by email
                { mobile: { $regex: name, $options: "i" } }, // Optionally search by mobile            
            ],
        }).populate('referredBy', 'name');

        return referrals; // Return the list of matched referrals
    } catch (error) {    
        throw new Error("Error occurred while searching referrals: " + error.message);
    }
};

module.exports = {
    getAllReferrals,
    createReferral,
    getReferralsByUserId,
    toggleReferralStatus,
    searchByReferredBy,
    searchByName,
    searchReferralsByUserId
}