const userService = require("../services/user-service");
const asyncHandler = require("../utils/asyncHandler");

const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
});

const createUser = asyncHandler(async (req, res) => {
    console.log("Received user data:", req.body);
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        const statusCode = error.status || 500; // Default to 500 if no status is provided
        res.status(statusCode).json({
            message: error.message || "Failed to create user",
            errors: error.errors || {}, // Include field-specific errors if available
        });
    }
});

const authenticateUser = asyncHandler(async (req, res) => {
    try {
        const { success, user, accessToken, refreshToken, message } = await userService.authenticateUser(req.body);

        if (success) {
            res.status(200).json({
                success: true,
                user,
                accessToken,
                refreshToken,
            });
        } else {
            const statusCode = message === "User account is deactivated" ? 403 : 401;
            res.status(statusCode).json({ success: false, message });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to authenticate user",
            error: error.message,
        });
    }
});


const toggleUserStatus = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await userService.toggleUserStatus(userId);
        if (user) {
            res.status(200).json({ message: "User status updated successfully", user });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to update user status", error: error.message });
    }
});

const updateUser = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await userService.updateUser(userId, req.body);
        if (user) {
            res.status(200).json({ message: "User updated successfully", user });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to update user", error: error.message });
    }
});

const searchUsers = asyncHandler(async (req, res) => {
    try {
        const users = await userService.searchUsers(req.query);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to search users", error: error.message });
    }
});


const getUsersByDateRange = asyncHandler(async (req, res) => {
    try {
        const users = await userService.getUsersByDateRange(req.query);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to search users", error: error.message });
    }
});

const getUserReferralCounts = asyncHandler(async (req, res) => {
    try {
        const counts = await userService.getUserReferralCounts(req.params.userId);
        res.status(200).json(counts);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user referral counts", error: error.message });
    }
});


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
