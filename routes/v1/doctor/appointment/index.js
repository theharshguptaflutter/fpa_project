const express = require("express");
const router = express.Router();
const {

  getAppointmentDoctorHistory
 
} = require("../../../../controllers/v1/doctor/appointment/appointment.controller.js");



router.get("/get_appointment_history/:doctor_id", (req, res) => {
  getAppointmentDoctorHistory(req, res);
});
module.exports = router;