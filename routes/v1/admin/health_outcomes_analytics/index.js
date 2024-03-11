const express = require("express");
const router = express.Router();
const {
  getTreatmentSuccessRate,
} = require("../../../../controllers/v1/admin/health_outcomes_analytics/health_outcomes_analytics.controller.js");

router.get("/get_treatment_success_rate", (req, res) => {
  getTreatmentSuccessRate(req, res);
});

module.exports = router;
