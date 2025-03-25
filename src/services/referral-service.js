const Referral = require("../models/referral");
const User = require("../models/user");

const getAllReferrals = async () => {
  try {
    const referrals = await Referral.find()
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .populate('referredBy', 'name');
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
    // Validate mobile format
    if (!referralData.mobile || typeof referralData.mobile !== 'string' || !referralData.mobile.startsWith('+')) {
      throw new Error("A valid mobile number in E.164 format is required.");
    }

    // Set default status
    referralData.attendanceStatus = "Not-Attended";

    // validate mobile exists
    const existingUser = await Referral.findOne({ mobile: referralData.mobile });
    if (existingUser) {
      throw new Error("Mobile number already exists.");
    }

    // Create referral
    const referral = await Referral.create(referralData);
    console.log("Referral created successfully", referral);

    // Update referral count in User model
    const user = await User.findById(referral.referredBy);
    if (user) {
      if (!user.statusCounts) {
        user.statusCounts = { totalLeads: 0, attended: 0, notAttended: 0, registered: 0, joined: 0 };
      }

      // **Increment only totalLeads & notAttended (default status)**
      user.statusCounts.totalLeads += 1;
      user.statusCounts.notAttended += 1;

      user.markModified('statusCounts');
      await user.save();

      console.log("Updated user statusCounts:", user.statusCounts);
    }

    return referral;
  } catch (error) {
    throw new Error("Error occurred while creating referral: " + error.message);
  }
}

const updateReferralStatus = async (referralId, newStatus) => {
  const validStatuses = ["Attended", "Not-Attended", "Registered", "Joined"];

  if (!newStatus || !validStatuses.includes(newStatus)) {
    console.log("Invalid status:", newStatus);
    throw new Error("Invalid status");
  }

  try {
    const referral = await Referral.findById(referralId);
    if (!referral) {
      throw new Error("Referral not found");
    }

    const oldStatus = referral.attendanceStatus;

    if (oldStatus === newStatus) {
      return referral; // No change needed
    }

    // Update the referral status
    referral.attendanceStatus = newStatus;
    await referral.save();
    console.log("Referral updated successfully:", referral);

    if (referral.referredBy) {
      const user = await User.findById(referral.referredBy);
      if (user) {
        if (!user.statusCounts) {
          user.statusCounts = { totalLeads: 0, attended: 0, notAttended: 0, registered: 0, joined: 0 };
        }

        // **Map status names to object keys correctly**
        const statusKeyMap = {
          "Attended": "attended",
          "Not-Attended": "notAttended",
          "Registered": "registered",
          "Joined": "joined"
        };

        const oldKey = statusKeyMap[oldStatus];
        const newKey = statusKeyMap[newStatus];

        if (oldKey) user.statusCounts[oldKey] = Math.max(0, user.statusCounts[oldKey] - 1);
        if (newKey) user.statusCounts[newKey] += 1;

        // **DO NOT UPDATE `totalLeads` HERE**
        user.markModified('statusCounts');

        await user.save();
        console.log("Updated user statusCounts:", user.statusCounts);
      } else {
        console.log("Referring user not found, cannot update counts");
      }
    }

    return referral;
  } catch (error) {
    console.error('Error in updateReferralStatus service:', error);
    throw error;
  }
};

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


// Referral count
const getReferralCount = async () => {
  try {
    const count = await Referral.countDocuments();
    return count;
  } catch (error) {
    throw new Error("Error occurred while fetching referral count: " + error.message);
  }
}

const getReferralStatusCounts = async () => {
  try {
    const counts = await Referral.aggregate([
      {
        $group: {
          _id: "$attendanceStatus",
          count: { $sum: 1 }
        }
      }
    ]);

    // Initialize with all possible statuses set to 0
    const formattedCounts = {
      "Attended": 0,
      "Not-Attended": 0,
      "Registered": 0,
      "Joined": 0
    };

    // Update with actual counts
    counts.forEach(item => {
      formattedCounts[item._id] = item.count;
    });

    return formattedCounts;
  } catch (error) {
    throw new Error("Error occurred while fetching referral status counts: " + error.message);
  }
};

const getRecentReferrals = async () => {
  try {
    const referrals = await Referral.find().sort({ createdAt: -1 }).limit(3).populate('referredBy', 'name');
    return referrals;
  } catch (error) {
    throw new Error("Error occurred while fetching recent referrals: " + error.message);
  }
}

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
}