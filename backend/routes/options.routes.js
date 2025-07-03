const router = require("express").Router();
const { adminController, optionController } = require("../controller");

router
    .get("/locations", adminController.getAllLocation)
    .get("/instruments", adminController.getAllInstrument)
    .get("/plans", adminController.getAllPlan)
    .get("/categories", adminController.getAllCategory)
    .get("/teachers", optionController.fetchLocationBaseTeacher)
    .post("/skill-history", optionController.fetchLocationBaseTeacher)

module.exports = router;