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
        // Find a user based on username and password
        const user = await User.findOne({
            username: userData.username,
            password: userData.password,
        });

        if (user) {
            if (!user.isActive) {
                console.log("User account is deactivated");
                return null; // Prevent login for deactivated users
            }
            console.log("User authenticated successfully");
            return user;
        } else {
            console.log("Invalid username or password");
            return null;
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


module.exports = {
    createUser,
    getAllUsers,
    authenticateUser,
    toggleUserStatus
};