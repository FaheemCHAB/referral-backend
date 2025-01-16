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

const createUser = asyncHandler( async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: "Failed to create user", error: error.message });
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

module.exports = {
    createUser,
    getAllUsers,
    authenticateUser,
    toggleUserStatus
};
