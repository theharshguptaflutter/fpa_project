const express = require("express");
const router = express.Router();
const {
  getPatientFeedback
} = require("../../../../controllers/v1/admin/patient_feedback_analytic/patient_feedback_analytic.controller");

router.get("/get", (req, res) => {
  getPatientFeedback(req, res);
});

module.exports = router;