const express = require("express");
const router = express.Router();
const {
  getGallery,
  galleryUpdate,
  galleryDelete
} = require("../../../../controllers/v1/admin/gallery/gallery.controller.js");

router.get("/get-gallery", (req, res) => {
  getGallery(req, res);
});
router.patch("/get-update/:gallery_id", (req, res) => {
  galleryUpdate(req, res);
});

router.delete("/get-delete/:gallery_id", (req, res) => {
    galleryDelete(req, res);
  });
  
module.exports = router;
