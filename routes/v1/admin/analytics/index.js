const express = require("express");
const router = express.Router();
const {} = require("../../../../controllers/v1/admin/analytics/analytics.controller");

router.get("/user_analytics", (req, res) => {
  console.log("okk");
});

module.exports = router;
