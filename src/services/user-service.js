const User = require("../models/user");
const bcrypt = require("bcrypt");

// Fetch all users
const getAllUsers = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        throw new Error("Error occurred while fetching users: " + error.message);
    }
};

// Create a new user
const createUser = async (userData) => {
    try {
        // Hash the password before saving
        // const hashedPassword = await bcrypt.hash(userData.password, 10);
        // Validate and extract the mobile number
        if (!userData.mobile || typeof userData.mobile !== 'object' || !userData.mobile.e164Number) {
            throw new Error("A valid mobile number is required.");
        }
        userData.mobile = userData.mobile.e164Number; // Use the E.164 format

        // Checking existing user
        const existingUser = await User.findOne({ $or: [{ mobile: userData.mobile }, { email: userData.email }, { username: userData.username }] });
        if (existingUser) {
            throw new Error("User Already Exists.");
        }
        const user = await User.create(userData);

        if (user) {
            console.log("User created successfully", user);
            return user;
        } else {
            console.log("User not created");
            return null;
        }
    } catch (error) {
        throw new Error("Error occurred while creating user: " + error.message);
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


module.exports = {
    createUser,
    getAllUsers,
    authenticateUser,
    toggleUserStatus
};