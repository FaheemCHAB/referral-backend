const referralController = require("../controllers/referral-controller");

const router = require("express").Router();

router.get("/", referralController.getAllReferrals);
router.get("/search-by-referred-by", referralController.searchByReferredBy);
router.get("/search-by-name", referralController.searchByName);
router.get("/search-by-user",referralController.searchReferralsByUserId);
router.get("/count", referralController.getReferralCount);
router.get("/status-counts", referralController.getReferralStatusCounts);
router.get("/recent", referralController.getRecentReferrals);
router.post("/", referralController.createReferral);
router.get("/joined-referrals/:userId", referralController.getJoinedReferralsByUserId);
router.get("/:userId", referralController.getReferralsByUserId);
router.patch("/:userId", referralController.updateReferralStatus);  

module.exports = router