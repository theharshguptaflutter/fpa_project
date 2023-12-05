const express = require("express");
const router = express.Router();
const {
  userProfileUpdate,
} = require("../../../controllers/v1/profile/profile.controller");

router.patch("/update/:user_id", (req, res) => {
  userProfileUpdate(req, res);
});

module.exports = router;
