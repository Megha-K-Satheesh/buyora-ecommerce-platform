const Joi = require("joi");

const bannerValidationBase = {
  title: Joi.string().trim().allow("", null),
  subtitle: Joi.string().trim().allow("", null),

  type: Joi.string().valid("hero", "promo", "category", "offer"),
  page: Joi.string().valid("home", "men", "women", "kids"),
  section: Joi.string().valid(
    "home_top",
    "home_bags",
    "home_watches",
    "home_explore",
    "home_trending",
    "home_slider",
    "category_top",
    "category_slider"
  ),
  sliderId: Joi.string().allow("", null),
  redirectType: Joi.string().valid("category", "product", "brand", "url").allow(null, ""),
  redirectValue: Joi.string().allow("", null),
  discountText: Joi.string().trim().allow("", null),
  isActive: Joi.boolean(),
  isVisible: Joi.boolean(),
  order: Joi.number().integer().min(0),
  startDate: Joi.date().allow(null, ""),
  endDate: Joi.date().allow(null, ""),
  clicks: Joi.number().integer().min(0)
};

const addBannerValidation = Joi.object({

  type: bannerValidationBase.type.required(),
  page: bannerValidationBase.page.required(),
  section: bannerValidationBase.section.required(),

  title: bannerValidationBase.title.optional(),
  subtitle: bannerValidationBase.subtitle.optional(),
  sliderId: bannerValidationBase.sliderId.optional(),
  redirectType: bannerValidationBase.redirectType.optional(),
  redirectValue: bannerValidationBase.redirectValue.optional(),
  discountText: bannerValidationBase.discountText.optional(),
  isActive: bannerValidationBase.isActive.optional(),
  isVisible: bannerValidationBase.isVisible.optional(),
  order: bannerValidationBase.order.optional(),
  startDate: bannerValidationBase.startDate.optional(),
  endDate: bannerValidationBase.endDate.optional(),
  clicks: bannerValidationBase.clicks.optional()
});

const updateBannerValidation = Joi.object({
  title: bannerValidationBase.title.optional(),
  subtitle: bannerValidationBase.subtitle.optional(),

  type: bannerValidationBase.type.optional(),
  page: bannerValidationBase.page.optional(),
  section: bannerValidationBase.section.optional(),
  sliderId: bannerValidationBase.sliderId.optional(),
  redirectType: bannerValidationBase.redirectType.optional(),
  redirectValue: bannerValidationBase.redirectValue.optional(),
  discountText: bannerValidationBase.discountText.optional(),
  isActive: bannerValidationBase.isActive.optional(),
  isVisible: bannerValidationBase.isVisible.optional(),
  order: bannerValidationBase.order.optional(),
  startDate: bannerValidationBase.startDate.optional(),
  endDate: bannerValidationBase.endDate.optional(),
  clicks: bannerValidationBase.clicks.optional()
}).min(1);




module.exports = {
  addBannerValidation,
  updateBannerValidation
};
