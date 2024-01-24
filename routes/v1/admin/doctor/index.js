const express = require("express");
const router = express.Router();
const {
  createDoctor,
  getDoctor,
  getAllDoctor,
  updateDoctor,
  deleteDoctor
} = require("../../../../controllers/v1/admin/doctor/doctor.controller");

router.post("/create/:admin_id", (req, res) => {
  createDoctor(req, res);
});

router.get("/get/:admin_id", (req, res) => {
  getDoctor(req, res);
});

router.get("/get_all/:admin_id", (req, res) => {
  getAllDoctor(req, res);
});

router.patch("/update/:admin_id", (req, res) => {
  updateDoctor(req, res);
});

router.patch("/delete/:admin_id", (req, res) => {
  deleteDoctor(req, res);
});

module.exports = router;
