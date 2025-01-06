const userService = require("../services/user-service");

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: "Failed to create user", error: error.message });
    }
};

const authenticateUser = async (req, res) => {
    try {
        const user = await userService.authenticateUser(req.body);
        if (user) {
            res.status(200).json({ success: true, user });
        } else if (user === null) {
            res.status(403).json({ success: false, message: "User account is deactivated" });
        } else {
            res.status(401).json({ success: false, message: "Invalid username or password" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to authenticate user", error: error.message });
    }
};

const toggleUserStatus = async (req, res) => {
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
};

module.exports = {
    createUser,
    getAllUsers,
    authenticateUser,
    toggleUserStatus
};
