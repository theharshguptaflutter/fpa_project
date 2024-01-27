const express = require("express");
const router = express.Router();
const {
  getNotes,
} = require("../../../../controllers/v1/admin/notes/notes.controller.js");

router.get("/get/", (req, res) => {
  getNotes(req, res);
});

module.exports = router;
