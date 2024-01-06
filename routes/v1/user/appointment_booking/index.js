const express = require("express");
const router = express.Router();
const {
  addAppointment,
  checkAppointmentAvailability
 
} = require("../../../../controllers/v1/user/appointment_booking/appointment_booking.controller.js");

router.post("/add_appointment/:user_id", (req, res) => {
  addAppointment(req, res);
});

router.post("/add_appointment/:user_id", (req, res) => {
  addAppointment(req, res);
});
router.get("/check_availability/", (req, res) => {
  checkAppointmentAvailability(req, res);
});


module.exports = router;