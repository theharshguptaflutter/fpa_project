const express = require("express");
const router = express.Router();
const {
  login,
  logout,
  passwordrecovery
} = require("../../../../controllers/v1/admin/auth/login.controller");

router.post("/login", (req, res) => {
  login(req, res);
});

router.post("/password-recovery", (req, res) => {
  passwordrecovery(req, res);
});

router.get("/logout/:user_id", (req, res) => {
  logout(req, res);
});


module.exports = router;
