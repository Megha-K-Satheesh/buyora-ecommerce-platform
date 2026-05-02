const Joi = require("joi");

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const addToCartValidation = Joi.object({
  productId: objectId.required(),
  variationId: objectId.required(),
  name: Joi.string().required(),
  brandName: Joi.string().allow("", null),
  image: Joi.string().uri().allow("", null),
  price: Joi.number().min(0).required(),
  mrp: Joi.number().min(0).required(),
  discountPercentage: Joi.number().min(0).max(100).optional(),
  size: Joi.string().required(),
  color: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required()
});

const mergeCartValidation = Joi.object({
  guestCart: Joi.array().items(
    Joi.object({
      productId: objectId.required(),
      variationId: objectId.required(),
      name: Joi.string().required(),
      brandName: Joi.string().allow("", null),
      image: Joi.string().uri().allow("", null),
      price: Joi.number().min(0).required(),
      mrp: Joi.number().min(0).required(),
      discountPercentage: Joi.number().min(0).max(100).optional(),
      size: Joi.string().required(),
      color: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required()
    })
  ).required()
});

const variationIdParamValidation = Joi.object({
  variationId: objectId.required()
});

const updateCartQuantityValidation = Joi.object({
  quantity: Joi.number().integer().min(1).required()
});

module.exports = {
  addToCartValidation,
  mergeCartValidation,
  variationIdParamValidation,
  updateCartQuantityValidation
};
