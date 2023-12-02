const express = require("express");
const router = express.Router();
const {
  login,
  otpverify,
  logout,
  tokenReGenerate,
} = require("../../../controllers/v1/auth/login.controller");

router.post("/login", (req, res) => {
  login(req, res);
});

router.post("/otp-verify", (req, res) => {
  otpverify(req, res);
});

router.get("/logout/:user_id", (req, res) => {
  logout(req, res);
});

router.get("/token-regenerate/:user_id", (req, res) => {
  tokenReGenerate(req, res);
});

module.exports = router;
