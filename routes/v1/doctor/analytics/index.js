const express = require("express");
const router = express.Router();
const {
  addDoctorAnalytics
 
} = require("../../../../controllers/v1/doctor/doctor_analytics/doctor_analytics.controller.js");

router.post("/add/:doctor_id", (req, res) => {
  addDoctorAnalytics(req, res);
});


module.exports = router;