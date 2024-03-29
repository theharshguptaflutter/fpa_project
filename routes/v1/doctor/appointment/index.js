const express = require("express");
const router = express.Router();
const {
  getAppointmentDoctorHistory,
  getAppointmentByIdHistory,
  appointmentComplete
} = require("../../../../controllers/v1/doctor/appointment/appointment.controller.js");

router.get("/get_appointment_history/:doctor_id", (req, res) => {
  getAppointmentDoctorHistory(req, res);
});

router.get("/get_appointment_details/:appointment_booking_id", (req, res) => {
  getAppointmentByIdHistory(req, res);
});
router.get("/appointment_complete/:appointment_booking_id", (req, res) => {
  appointmentComplete(req, res);
});

module.exports = router;
