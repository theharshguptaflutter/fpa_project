const express = require("express");
const router = express.Router();
const {
  addUserAnalytics
 
} = require("../../../../controllers/v1/user/user_analytics/user_analytics.controller.js");

router.post("/add/:user_id", (req, res) => {
  addUserAnalytics(req, res);
});


module.exports = router;