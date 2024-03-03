const express = require("express");
const router = express.Router();
const {
  getOperationalMetrics
} = require("../../../../controllers/v1/admin/operational_metrics/operational_metrics.controller.js");

router.get("/get", (req, res) => {
  getOperationalMetrics(req, res);
});

module.exports = router;