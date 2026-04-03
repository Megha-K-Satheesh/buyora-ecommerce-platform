const express = require("express");
const upload = require("../middlewares/upload");
const { authenticateAdmin } = require("../middlewares/auth");
const BannerController = require("../controllers/bannerController");

const router = express.Router();

router.post(
  "/add-banner",
  authenticateAdmin,
  upload.single("image"),
  BannerController.addBanner
);

router.get("/get-banners", BannerController.getBanners);
router.get("/get-banners-user", BannerController.getBannersUser);

router.get("/get-banner-id/:id", BannerController.getBannerById);

router.put(
  "/update-banner/:id",
  authenticateAdmin,
  upload.single("image"),
  BannerController.updateBanner
);

router.delete(
  "/delete-banner/:id",
  authenticateAdmin,
  BannerController.deleteBanner
);

module.exports = router;
