const express = require("express");
const router = express.Router();
const {getUserFeedback,userFeedbackUpdate,userFeedbackDelete} = require("../../../../controllers/v1/admin/user_feedback/user_feedback.controller.js");




router.get("/get", (req, res) => {
  getUserFeedback(req, res);
});
router.patch("/update/:user_booking_feedback_id", (req, res) => {
  userFeedbackUpdate(req, res);
});

router.delete("/delete/:user_booking_feedback_id", (req, res) => {
  userFeedbackDelete(req, res);
});


module.exports = router;
