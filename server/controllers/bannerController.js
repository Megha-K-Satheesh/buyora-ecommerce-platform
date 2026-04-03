
const { default: BannerService } = require("../services/BannerService");
const BaseController = require("./BaseController");

class BannerController extends BaseController {

  static addBanner = BaseController.asyncHandler(async (req, res) => {
    const result = await BannerService.addBanner({
      body: req.body,
      file: req.file,
    });

    BaseController.logAction("BANNER ADDED", result);
    BaseController.sendSuccess(res, "BANNER ADDED", result);
  });

  static getBanners = BaseController.asyncHandler(async (req, res) => {
    const { page, section ,limit,pageType} = req.query;

    const result = await BannerService.getBanners({
       page: Number(page) || 1,
  limit: Number(limit) || 10,
      section,
      
      pageType
    });

    BaseController.logAction("BANNERS FETCHED", result);
    BaseController.sendSuccess(res, "BANNERS FETCHED", result);
  });

  static getBannersUser = BaseController.asyncHandler(async (req, res) => {
    const { page, section } = req.query;

    const result = await BannerService.getBannersUser({
       page,
      section,
    })

    BaseController.logAction("BANNERS FETCHED", result);
    BaseController.sendSuccess(res, "BANNERS FETCHED", result);
  });

  static getBannerById = BaseController.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await BannerService.getBannerById(id);

    BaseController.logAction("BANNER FETCHED", result);
    BaseController.sendSuccess(res, "BANNER FETCHED", result);
  });

  static updateBanner = BaseController.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await BannerService.updateBanner({
      id,
      body: req.body,
      file: req.file,
    });

    BaseController.logAction("BANNER UPDATED", result);
    BaseController.sendSuccess(res, "BANNER UPDATED", result);
  });

  static deleteBanner = BaseController.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await BannerService.deleteBanner(id);

    BaseController.logAction("BANNER DELETED", result);
    BaseController.sendSuccess(res, "BANNER DELETED", result);
  });
}

module.exports = BannerController;
