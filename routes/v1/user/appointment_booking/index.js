const express = require("express");
const router = express.Router();
const {
  addAppointment,
  checkAppointmentAvailability,
  getAppointmentUserHistory,
  addClientHistoryCard,
  appointmentCancel,
  appointmentReschedule,
  getAppointmentByIdHistory
 
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

router.get("/get_appointment_history/:user_id", (req, res) => {
  getAppointmentUserHistory(req, res);
});
router.get("/get_appointment_details/:appointment_booking_id", (req, res) => {
  getAppointmentByIdHistory(req, res);
});

router.post("/add_client_card/:user_id", (req, res) => {
  addClientHistoryCard(req, res);
});

router.patch("/cancel/:user_id", (req, res) => {
  appointmentCancel(req, res);
});
router.patch("/reschedule/:user_id", (req, res) => {
  appointmentReschedule(req, res);
});

module.exports = router;