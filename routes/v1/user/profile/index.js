const express = require("express");
const router = express.Router();
const {
  userProfileUpdate,
  getUserProfile,
} = require("../../../../controllers/v1/user/profile/profile.controller");

router.patch("/update/:user_id", (req, res) => {
  userProfileUpdate(req, res);
});

router.get("/get/:user_id", (req, res) => {
  getUserProfile(req, res);
});

module.exports = router;
