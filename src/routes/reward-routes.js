const router = require("express").Router();
const rewardController = require("../controllers/reward-controller");

router.get("/", rewardController.getAllRewards);
router.post("/", rewardController.createOrUpdateReward);
router.get("/bonus-count",rewardController.getAllUserBonusPoints);
router.patch("/change-status/:rewardId", rewardController.updateRewardStatus);
router.get("/:userId", rewardController.getRewardsByUserId);
// router.get("/search", rewardController.searchRewards);

module.exports = router