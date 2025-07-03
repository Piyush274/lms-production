const router = require("express").Router();
const authRoutes = require("./auth.routes");
const adminRoutes = require("./admin.routes");
const optionsRoutes = require("./options.routes");
const teacherRoutes = require("./teacher.routes");
const studentRoutes = require("./student.routes");
const chatRoutes = require("./chat.routes");
const parentRoutes = require("./parent.routes");
const webhookRoutes = require("./webhook.routes");

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/", optionsRoutes);
router.use("/teachers", teacherRoutes);
router.use("/students", studentRoutes);
router.use("/chat", chatRoutes);
router.use("/parents", parentRoutes);
router.use("/webhooks", webhookRoutes);

module.exports = router;
