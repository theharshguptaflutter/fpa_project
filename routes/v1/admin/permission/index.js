const express = require("express");
const router = express.Router();
const {
  addStaffPermission,
  addDoctorPermission,
  doctorDeletePermission,
  staffDeletePermission
  
} = require("../../../../controllers/v1/admin/permission/permission.controller.js");

router.post("/add_staff", (req, res) => {
  addStaffPermission(req, res);
});
router.post("/add_doctor", (req, res) => {
  addDoctorPermission(req, res);
});
router.delete("/delete_doctor", (req, res) => {
  doctorDeletePermission(req, res);
});
router.delete("/delete_staff", (req, res) => {
  staffDeletePermission(req, res);
});

module.exports = router;