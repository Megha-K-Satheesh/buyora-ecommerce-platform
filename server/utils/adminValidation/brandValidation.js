const Joi = require("joi");

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const addBrandValidation = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  category: Joi.array()
    .items(
      Joi.object({
        value: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        label: Joi.string().optional()
      })
    )
    .min(1)
    .required(),

  isActive: Joi.boolean().optional()
});

const updateBrandValidation = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  categories: Joi.array().items(objectId).min(1).optional(),
  isActive: Joi.boolean().optional()
}).min(1);

module.exports = {
  addBrandValidation,
  updateBrandValidation
};
