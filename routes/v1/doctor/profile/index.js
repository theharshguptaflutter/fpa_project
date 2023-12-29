const express = require("express");
const router = express.Router();
const {
  userProfileUpdate,
  getUserProfile,
} = require("../../../../controllers/v1/doctor/profile/profile.controller.js");

router.patch("/update/:doctor_id", (req, res) => {
  userProfileUpdate(req, res);
});

router.get("/get/:doctor_id", (req, res) => {
  
  getUserProfile(req, res);
});

module.exports = router;