const express = require("express");
const router = express.Router();
const {
  login,
  otpverify,
  verifyemail,
  logout,
  tokenReGenerate,
  passwordrecovery
} = require("../../../../controllers/v1/user/auth/login.controller");

router.post("/login", (req, res) => {
  login(req, res);
});

router.post("/otp-verify", (req, res) => {
  otpverify(req, res);
});
router.post("/verify-email", (req, res) => {
  verifyemail(req, res);
});
router.post("/password-recovery", (req, res) => {
  passwordrecovery(req, res);
});

router.get("/logout/:user_id", (req, res) => {
  logout(req, res);
});

router.get("/token-regenerate/:user_id", (req, res) => {
  tokenReGenerate(req, res);
});

module.exports = router;
