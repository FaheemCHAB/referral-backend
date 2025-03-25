const userController = require("../controllers/user-controller");

const router = require("express").Router();

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.post("/authenticate", userController.authenticateUser);
router.patch("/:userId", userController.toggleUserStatus);
router.put("/:userId", userController.updateUser);
// search by query
router.get("/search", userController.searchUsers);
router.get("/date-range", userController.getUsersByDateRange);
router.get("/referral-counts/:userId", userController.getUserReferralCounts);

module.exports = router