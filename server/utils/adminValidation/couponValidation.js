const Joi = require("joi");

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const couponValidation = Joi.object({
  code: Joi.string().trim().uppercase().min(3).max(30).required(),

  description: Joi.string().allow("", null).optional(),

  discount: Joi.object({
    type: Joi.string().valid("FLAT", "PERCENTAGE").required(),
    value: Joi.number().min(0).required(),
    maxDiscount: Joi.number().min(0).optional()
  }).required(),

  scope: Joi.string().valid("GLOBAL", "CATEGORY").required(),

applicableCategories: Joi.array()
  .items(objectId)
  .when("scope", {
    is: "CATEGORY",
    then: Joi.array().min(1).required(),
    otherwise: Joi.optional()
  }),

  minOrderAmount: Joi.number().min(0).optional(),

  totalUsageLimit: Joi.number().integer().min(1).optional(),

  usedCount: Joi.number().integer().min(0).optional(),

  usageLimitPerUser: Joi.number().integer().min(1).optional(),

  isFirstOrderOnly: Joi.boolean().optional(),

  validFrom: Joi.date().required(),

  validTill: Joi.date().required(),

  isActive: Joi.boolean().optional()
});

const updateCouponValidation = Joi.object({
  code: Joi.string().trim().uppercase().min(3).max(30).optional(),

  description: Joi.string().allow("", null).optional(),

  discount: Joi.object({
    type: Joi.string().valid("FLAT", "PERCENTAGE"),
    value: Joi.number().min(0),
    maxDiscount: Joi.number().min(0)
  }).optional(),

  scope: Joi.string().valid("GLOBAL", "CATEGORY").optional(),

  applicableCategories: Joi.array().items(objectId).optional(),

  minOrderAmount: Joi.number().min(0).optional(),

  totalUsageLimit: Joi.number().integer().min(1).optional(),

  usedCount: Joi.number().integer().min(0).optional(),

  usageLimitPerUser: Joi.number().integer().min(1).optional(),

  isFirstOrderOnly: Joi.boolean().optional(),

  validFrom: Joi.date().optional(),

  validTill: Joi.date().optional(),

  isActive: Joi.boolean().optional()
}).min(1);

module.exports = {
  couponValidation,
  updateCouponValidation
};
