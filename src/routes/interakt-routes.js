const router = require("express").Router();
const interaktController = require("../controllers/interakt-controller");    

router.post("/create-campaign", interaktController.createCampaign);
// Route to get templates from Interakt
router.get("/templates", interaktController.getTemplates);
// Route to create a campaign in Interakt
router.get("/campaigns", interaktController.getAllCampaigns);

router.post("/send-template", interaktController.sendTemplate);

module.exports = router;
