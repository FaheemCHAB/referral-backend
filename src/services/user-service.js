const User = require("../models/user");
const { sendWelcomeEmail } = require('../utils/emailService');

// Fetch all users
const getAllUsers = async () => {
    try {
        const users = await User.find({})
            .select("-password -refreshToken") // Exclude sensitive fields
            .sort({ createdAt: -1 }); // Sort by creation date, most recent first
        return users;
    } catch (error) {
        throw new Error("Error occurred while fetching users: " + error.message);
    }
};

// Create a new user
const createUser = async (userData) => {
    try {
        // Remove `_id` if it's an empty string or invalid
        if (!userData._id || userData._id === "") {
          delete userData._id;
        }
        
        // Check for existing user
        const existingUser = await User.findOne({
          $or: [
            { mobile: userData.mobile },
            { email: userData.email },
            { username: userData.username }
          ],
        });
        
        if (existingUser) {
          const fieldErrors = {};
          if (existingUser.mobile === userData.mobile) fieldErrors.mobile = "Mobile number already exists.";
          if (existingUser.email === userData.email) fieldErrors.email = "Email already exists.";
          if (existingUser.username === userData.username) fieldErrors.username = "Username already exists.";
          
          throw { status: 400, message: "Validation failed", errors: fieldErrors };
        }
        
        // Create user
        userData.isActive = true;
        const user = await User.create(userData);
        
        // Send welcome email with credentials
        try {
            console.log("Sending welcome email...");
            
          await sendWelcomeEmail(user);
          console.log("Welcome email sent successfully");
        } catch (emailError) {
          console.error("Failed to send welcome email:", emailError);
        }
        
        return user;
      } catch (error) {
        if (error.status) throw error;
        throw { status: 500, message: error.message || "An unexpected error occurred." };
      }
};

// Authenticate user
const authenticateUser = async (userData) => {
    try {
        const user = await User.findOne({
            $or: [
                { username: userData.username },
                { email: userData.email }
            ],
        });

        if (user && userData.password === user.password) { // Replace with bcrypt comparison in production
            if (!user.isActive) {
                console.log("User account is deactivated");
                return { success: false, message: "User account is deactivated" };
            }

            const { accessToken, refreshToken } = await generateAccessToken(user._id);

            const loggedInUser = await User.findById(user._id)
                .select("-password -__v -refreshToken");

            console.log("User authenticated successfully");
            return { success: true, user: loggedInUser, accessToken, refreshToken };
        } else {
            console.log("Invalid username or password");
            return { success: false, message: "Invalid username or password" };
        }
    } catch (error) {
        throw new Error("Error occurred while authenticating user: " + error.message);
    }
};

const getUserReferralCounts = async (userId) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      console.log(user);
      
      console.log(user.statusCounts);
      
      return user.statusCounts;
    } catch (error) {
      throw new Error("Error fetching user referral counts: " + error.message);
    }
  };


const toggleUserStatus = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (user) {
            user.isActive = !user.isActive; // Toggle the status
            await user.save();
            console.log("User status updated successfully", user.isActive);
            return user;
        } else {
            return null; // User not found
        }
    } catch (error) {
        throw new Error("Error occurred while toggling user status: " + error.message);
    }
};


const generateAccessToken = async (userId) => {

    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const accessToken = user.generateAcessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save();

        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error("Error occurred while generating access token: " + error.message);
    }
};


const updateUser = async (userId, userData) => {
    try {
        // Validate mobile number
        // if (!userData.mobile || typeof userData.mobile !== 'object' || !userData.mobile.e164Number) {
        //     throw new Error("A valid mobile number is required.");
        // }

        // Use the E.164 format
        // userData.mobile = userData.mobile.e164Number;    

        // Find user by ID
        const user = await User.findById(userId);
        if (user) {
            // Assign new data to the user object
            Object.assign(user, userData);
            // Save the updated user
            await user.save();
            console.log("User updated successfully", user);
            return user;
        } else {
            return null; // User not found
        }
    } catch (error) {
        throw new Error("Error occurred while updating user: " + error.message);
    }
};

const searchUsers = async (query) => {
    try {
        const searchTerm = query.query || ""; // Extract the search term
        const users = await User.find({
            $or: [
                { name: { $regex: searchTerm, $options: "i" } },
                // { email: { $regex: searchTerm, $options: "i" } },
                // { username: { $regex: searchTerm, $options: "i" } }
            ]
        });
        return users;
    } catch (error) {
        throw new Error("Error occurred while searching users: " + error.message);
    }
};


const getUsersByDateRange = async (query) => {
    try {
        // Convert startDate and endDate to UTC
        const startDate = new Date(query.startDate);
        const endDate = new Date(query.endDate);

        // Adjust the endDate to include the full day in UTC
        endDate.setUTCHours(23, 59, 59, 999);

        // Fetch users within the date range
        const users = await User.find({ createdAt: { $gte: startDate, $lte: endDate } });
        return users;
    } catch (error) {
        throw new Error("Error occurred while searching users: " + error.message);
    }
};

module.exports = {
    createUser,
    getAllUsers,
    authenticateUser,
    toggleUserStatus,
    updateUser,
    searchUsers,
    getUsersByDateRange,
    getUserReferralCounts
};