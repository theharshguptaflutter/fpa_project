const express = require("express");
const router = express.Router();
const {
  getState,
  getCity,
  getCategory,
  getRole,
  getAppointmentList,
  getGallery,
  getAppointmentTimeList
} = require("../../controllers/resource/resources.controller");

router.get("/get-state", (req, res) => {
  getState(req, res);
});

router.get("/get-city", (req, res) => {
  getCity(req, res);
});
router.get("/get-category", (req, res) => {
  getCategory(req, res);
});

router.get("/get-role", (req, res) => {
  getRole(req, res);
});

router.get("/get-appointmentlist", (req, res) => {
  console.log("test============>");
  getAppointmentList(req, res);
});
router.get("/get-appointment-time", (req, res) => {
 
  getAppointmentTimeList(req, res);
});
router.get("/get-gallery", (req, res) => {
  
  getGallery(req, res);
});
module.exports = router;
