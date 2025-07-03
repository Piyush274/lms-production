const router = require("express").Router();
const { webhookController } = require("../controller");

router.post(
  "/recurring-subscription-plan",
  webhookController.handleRecurringSubscription
);
module.exports = router;
