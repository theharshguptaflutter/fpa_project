const express = require("express");
const router = express.Router();
const {
  getAppointmentsOfUser,
  getAppointmentById,
  getAllAppointments,
  cancelAppointment,
  appointmentReschedule,
} = require("../../../../controllers/v1/admin/appointments/appointments.controller");

router.get("/get_user_appointments", (req, res) => {
  getAppointmentsOfUser(req, res);
});

router.get("/get_appointment_details/:appointment_booking_id", (req, res) => {
  getAppointmentById(req, res);
});

router.get("/get_all_appointmen/:admin_id", (req, res) => {
  getAllAppointments(req, res);
});

router.patch("/cancel/:appointment_booking_id", (req, res) => {
  cancelAppointment(req, res);
});

router.patch("/reschedule/:appointment_booking_id", (req, res) => {
  appointmentReschedule(req, res);
});

module.exports = router;
