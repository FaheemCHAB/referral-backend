const userController = require("../controllers/user-controller");

const router = require("express").Router();

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.post("/authenticate", userController.authenticateUser);
router.patch("/:userId", userController.toggleUserStatus);

module.exports = router