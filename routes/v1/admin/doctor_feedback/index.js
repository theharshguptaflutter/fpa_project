const express = require("express");
const router = express.Router();
const { 
  getDoctorFeedback,
  doctorFeedbackUpdate,
  doctorFeedbackDelete, 
} = require("../../../../controllers/v1/admin/doctor_feedback/doctor_feedback.controller.js");




router.get("/get", (req, res) => {
  getDoctorFeedback(req, res);
});
router.patch("/update/:doctor_booking_feedback_id", (req, res) => {
  doctorFeedbackUpdate(req, res);
});

router.delete("/delete/:doctor_booking_feedback_id", (req, res) => {
  doctorFeedbackDelete(req, res);
});


module.exports = router;
