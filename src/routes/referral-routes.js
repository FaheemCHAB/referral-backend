const referralController = require("../controllers/referral-controller");

const router = require("express").Router();

router.get("/", referralController.getAllReferrals);
router.get("/search-by-referred-by", referralController.searchByReferredBy);
router.get("/search-by-name", referralController.searchByName);
router.get("/search-by-user",referralController.searchReferralsByUserId);
router.post("/", referralController.createReferral);
router.get("/:userId", referralController.getReferralsByUserId);
router.patch("/:userId", referralController.toggleReferralStatus);

module.exports = router