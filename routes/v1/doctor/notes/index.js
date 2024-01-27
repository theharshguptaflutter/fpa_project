const express = require("express");
const router = express.Router();
const {
  addNotes,
  getNotes,
  updateNotes
} = require("../../../../controllers/v1/doctor/notes/notes.controller.js");



router.get("/get/:appointment_booking_id", (req, res) => {
  getNotes(req, res);
});
router.post("/add/:appointment_booking_id", (req, res) => {
  addNotes(req, res);
});
router.patch("/update/:appointment_booking_id", (req, res) => {
  updateNotes(req, res);
});


module.exports = router;
