const referralController = require("../controllers/referral-controller");

const router = require("express").Router();

router.get("/", referralController.getAllReferrals);
router.post("/", referralController.createReferral);
router.get("/:userId", referralController.getReferralsByUserId);

module.exports = router