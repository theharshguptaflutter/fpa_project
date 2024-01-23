const express = require("express");
const router = express.Router();
const {

  getUserfeedback,
  addUserfeedback
} = require("../../../../controllers/v1/user/feedback/feedback.controller.js");

router.patch("/update/:user_id", (req, res) => {
  userProfileUpdate(req, res);
});

router.get("/get/:user_id", (req, res) => {
  getUserfeedback(req, res);
});
router.post("/add/:user_id", (req, res) => {
  addUserfeedback(req, res);
});



module.exports = router;
