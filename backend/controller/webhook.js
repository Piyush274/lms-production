const catchAsyncError = require("../middleware/catchAsyncError");
const { userService, adminService } = require("../service");

const handleRecurringSubscription = catchAsyncError(async (req, res) => {
  const event = req.body;

  console.log("📢 FULL EVENT:", JSON.stringify(event, null, 2));

  switch (event.eventType) {
    // Subscription Events
    case "net.authorize.customer.subscription.created":
      console.log("✅ Subscription Created  12:", event.payload);
      // Update DB: Mark subscription as active
      break;
    case "net.authorize.customer.subscription.cancelled":
      console.log("❌ Subscription Cancelled: 16", event.payload);
      const user = await userService.checkUser({
        recurringPlanId: event.payload.id,
      });
      console.log("❌ user:", user._id);
      await userService.updateUser(
        { _id: user._id },
        { recurringPlanId: null, hasSubscriptionPlan: false, activePlan: null }
      );

      await adminService.updateTransaction(
        { authSubscriptionId: event.payload.id, userId: user._id },
        { paymentStatus: "cancelled" }
      );
      // Update DB: Mark subscription as cancelled
      break;
    case "net.authorize.customer.subscription.expired":
      console.log("⚠️ Subscription Expired: 33", event.payload);
      // Update DB: Mark subscription as expired
      break;
    case "net.authorize.customer.subscription.expiring":
      console.log("⏳ Subscription Expiring Soon: 37", event.payload);
      // Notify user about expiration
      break;
    case "net.authorize.customer.subscription.failed":
      console.log("🚨 Subscription Payment Failed: 41", event.payload);
      // Update DB: Mark as failed and notify user
      break;
    case "net.authorize.customer.subscription.suspended":
      console.log("⚠️ Subscription Suspended: 45", event.payload);
      // Update DB: Mark as suspended and notify user
      break;
    case "net.authorize.customer.subscription.terminated":
      console.log("🔴 Subscription Terminated: 49", event.payload);
      // Update DB: Mark as terminated
      break;
    case "net.authorize.customer.subscription.updated":
      console.log("🔄 Subscription Updated: 53", event.payload);
      // Update subscription details in DB
      break;

    // Payment Events
    case "net.authorize.payment.authcapture.created":
      console.log("✅ Payment Captured: 59", event.payload);
      // Update DB: Payment successful
      break;
    case "net.authorize.payment.authorization.created":
      console.log("🔄 Payment Authorized: 63", event.payload);
      // Update DB: Payment authorized but not captured
      break;
    case "net.authorize.payment.capture.created":
      console.log("💰 Payment Captured: 67", event.payload);
      // Update DB: Payment fully captured
      break;
    case "net.authorize.payment.fraud.approved":
      console.log("🛡️ Payment Approved After Fraud Check: 71", event.payload);
      // Update DB: Payment marked as approved
      break;
    case "net.authorize.payment.fraud.declined":
      console.log("🚫 Payment Declined Due to Fraud: 75", event.payload);
      // Update DB: Payment declined
      break;
    case "net.authorize.payment.fraud.held":
      console.log("⏳ Payment Held for Fraud Review: 79", event.payload);
      // Update DB: Payment held, pending manual review
      break;
    case "net.authorize.payment.priorAuthCapture.created":
      console.log("🔄 Prior Authorization Captured: 83", event.payload);
      // Update DB: Payment captured after prior authorization
      break;
    case "net.authorize.payment.refund.created":
      console.log("🔙 Refund Issued: 87", event.payload);
      // Update DB: Payment refunded
      break;
    case "net.authorize.payment.void.created":
      console.log("🚫 Payment Voided: 91", event.payload);
      // Update DB: Payment voided
      break;

    default:
      console.log("⚠️ Unhandled Event Type:", event.eventType);
  }

  res.status(200).json({ success: true, message: "Event processed" });
});

module.exports = {
  handleRecurringSubscription,
};
