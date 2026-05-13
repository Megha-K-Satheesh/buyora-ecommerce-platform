const Joi = require("joi");

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const variationValidation = Joi.object({
  size: Joi.string().required(),
  color: Joi.string().required(),
  stock: Joi.number().min(0).required(),
  price: Joi.number().min(0).required()
});

const variationSchema = Joi.object({
  attributes: Joi.object().required(),
  stock: Joi.number().min(0).required(),
  isActive: Joi.boolean().optional()
});


const productValidation = Joi.object({
  name: Joi.string().trim().min(2).max(150).required(),

  description: Joi.string().min(10).required(),

  brand: objectId.allow(null).optional(),

  category: objectId.required(),

  mrp: Joi.number().min(0).required(),

  sellingPrice: Joi.number().min(0).required(),

 
variations: Joi.array()
    .items(
      Joi.object({
        attributes: Joi.object().required(),
        stock: Joi.number().min(0).required(),
        isActive: Joi.boolean().optional()
      })
    )
    .required(),


  attributes: Joi.object().optional(),

  discountPercentage: Joi.number().min(0).max(100).optional(),

  rating: Joi.number().min(0).max(5).optional(),

  ratingCount: Joi.number().min(0).optional(),

  status: Joi.string().valid("active", "inactive").optional(),

  isVisible: Joi.boolean().optional()
});

const updateProductValidation = Joi.object({
  name: Joi.string().trim().min(2).max(150).optional(),

  description: Joi.string().min(10).optional(),

  brand: objectId.allow(null).optional(),

  category: objectId.optional(),

 
stock: Joi.number().min(0).optional(),
variations: Joi.array().items(variationSchema).optional(),
 
existingImages: Joi.array().items(Joi.string()).optional(),
  mrp: Joi.number().min(0).optional(),

  sellingPrice: Joi.number().min(0).optional(),

  discountPercentage: Joi.number().min(0).max(100).optional(),

  rating: Joi.number().min(0).max(5).optional(),

  ratingCount: Joi.number().min(0).optional(),

  // totalStock: Joi.number().min(0).optional(),

  status: Joi.string().valid("active", "inactive").optional(),

  isVisible: Joi.boolean().optional()
}).min(1);

module.exports = {
  productValidation,
  updateProductValidation,
    objectId
};
