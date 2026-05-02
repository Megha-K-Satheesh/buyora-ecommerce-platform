const Joi = require("joi");

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const allowedAttributeValidation = Joi.object({
  name: Joi.string().trim().required(),
  values: Joi.array().items(Joi.string()).min(1).required()
});

const addCategoryValidation = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  parentId: objectId.allow(null).optional(),



  isLeaf: Joi.boolean().optional(),

  status: Joi.string().valid("active", "inactive").optional(),

  isVisible: Joi.boolean().optional(),

  allowedAttributes: Joi.array()
    .items(allowedAttributeValidation)
    .when("level", {
      is: 2,
      then: Joi.required(),
      otherwise: Joi.optional()
    })
});

const updateCategoryValidation = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),

  parentId: objectId.allow(null).optional(),

  level: Joi.number().valid(1, 2, 3).optional(),

  isLeaf: Joi.boolean().optional(),

  status: Joi.string().valid("active", "inactive").optional(),

  isVisible: Joi.boolean().optional(),

  allowedAttributes: Joi.array().items(allowedAttributeValidation).optional()
}).min(1);

module.exports = {
  addCategoryValidation,
  updateCategoryValidation
};
