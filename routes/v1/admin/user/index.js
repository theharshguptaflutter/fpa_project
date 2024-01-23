const express = require("express");
const router = express.Router();
const {
  createUser,
  getUser,
  getAllUser,
  updateUser,
  deleteUser
} = require("../../../../controllers/v1/admin/user/user.controller");

router.post("/create/:admin_id", (req, res) => {
  createUser(req, res);
});

router.get("/get/:admin_id", (req, res) => {
  getUser(req, res);
});

router.get("/get_all/:admin_id", (req, res) => {
  getAllUser(req, res);
});

router.patch("/update/:admin_id", (req, res) => {
  updateUser(req, res);
});

router.patch("/delete/:admin_id", (req, res) => {
  deleteUser(req, res);
});

module.exports = router;
