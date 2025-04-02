const router = require("express").Router();
const bonusController = require("../controllers/bonus-controller")

router.get("/", bonusController.getAllBonuses);
router.post("/", bonusController.createOrUpdateBonus);
router.patch("/change-status/:bonusId", bonusController.updateBonusStatus);
router.get("/:userId", bonusController.getBonusesByUserId);
router.put("/:bonusId", bonusController.updateBonusByUserId);

module.exports = router 