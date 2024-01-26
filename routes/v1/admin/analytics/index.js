const express = require("express");
const router = express.Router();
const {} = require("../../../../controllers/v1/admin/analytics/doctor_analytics/doctor_analytics.controller");
const {
  getUserAnalytics,
} = require("../../../../controllers/v1/admin/analytics/user_analytics/user_analytics.controller.js");

//doctor_analytics start
router.get("/doctor_analytics", (req, res) => {
  console.log("okk");
});
//doctor_analytics end

///user_analytics start
router.get("/user_analytics", (req, res) => {
  getUserAnalytics(req, res);
});

///user_analytics end
module.exports = router;
