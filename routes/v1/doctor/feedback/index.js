const express = require("express");
const router = express.Router();
const {

  addDoctorFeedback,
  getDoctorFeedback,
} = require("../../../../controllers/v1/doctor/feedback/feedback.controller.js");



router.get("/get/:doctor_id", (req, res) => {
  getDoctorFeedback(req, res);
});
router.post("/add/:doctor_id", (req, res) => {
  addDoctorFeedback(req, res);
});



module.exports = router;
