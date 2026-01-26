const Joi = require('joi');
const { resendOtp } = require('../services/AuthService');

// const otpPurposeEnum = ['EMAIL_VERIFICATION', 'PASSWORD_RESET'];

const commonPatterns = {
  name: Joi.string().min(2).max(100).trim().required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(8).max(128).required(),
  objectId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  status: Joi.string().valid('active', 'banned', 'inactive'),
  role: Joi.string().valid('user', 'admin')
};

const customMessages = {
  'string.min': '{#label} must be at least {#limit} characters long',
  'string.max': '{#label} cannot exceed {#limit} characters',
  'string.email': 'Please provide a valid email address',
  'any.required': '{#label} is required',
  'any.only': '{#label} must be one of: {#valids}',
  'string.pattern.base': '{#label} format is invalid'
};

const strongPasswordValidation = Joi.string()
  .min(8)
  .max(128)
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])'))
  .required()
  .messages({
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  });

const registerValidation = Joi.object({
  name: commonPatterns.name.messages(customMessages),
  email: commonPatterns.email.messages(customMessages),
  password: commonPatterns.password.messages({
    ...customMessages,
    'string.min': 'Password must be at least 8 characters long'
  })
});

const loginValidation = Joi.object({
  email: commonPatterns.email.messages(customMessages),
  password: Joi.string().required().messages(customMessages)
});





const adminLoginValidation = loginValidation;

// const profileUpdateValidation = Joi.object({
//   name: commonPatterns.name.messages(customMessages),
//   phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional().messages({
//     'string.pattern.base': 'Please provide a valid phone number'
//   }),
//   bio: Joi.string().max(500).optional(),
//   avatar: Joi.string().uri().optional()
// });

const passwordChangeValidation = Joi.object({
  currentPassword: Joi.string().required().messages(customMessages),
  newPassword: commonPatterns.password.messages({
    ...customMessages,
    'string.min': 'New password must be at least 8 characters long'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Password confirmation does not match new password',
    'any.required': 'Password confirmation is required'
  })
});

const statusUpdateValidation = Joi.object({
  status: commonPatterns.status.required().messages(customMessages)
});

// const banUserValidation = Joi.object({
//   reason: Joi.string().min(10).max(500).required().messages({
//     'string.min': 'Ban reason must be at least 10 characters long',
//     'string.max': 'Ban reason cannot exceed 500 characters',
//     'any.required': 'Ban reason is required'
//   })
// });

// const paginationValidation = Joi.object({
//   page: Joi.number().integer().min(1).default(1),
//   limit: Joi.number().integer().min(1).max(100).default(10),
//   sortBy: Joi.string().valid('name', 'email', 'createdAt', 'updatedAt', 'lastLogin').default('createdAt'),
//   sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
//   search: Joi.string().max(100).optional(),
//   status: commonPatterns.status.optional(),
//   role: commonPatterns.role.optional()
// });

const otpPattern = Joi.string()
  .length(6)
  .pattern(/^[0-9]{6}$/)
  .required()
  .messages({
    'string.length': 'OTP must be exactly 6 digits',
    'string.pattern.base': 'OTP must contain only numbers',
    'any.required': 'OTP is required'
  });

const otpPurposeField = Joi.string()
  .valid('EMAIL_VERIFICATION', 'PASSWORD_RESET')
  .required()
  .messages({
    'any.only': 'Invalid OTP purpose',
    'any.required': 'OTP purpose is required'
  });

const objectIdValidation = commonPatterns.objectId
  .required()
  .label('User ID')
  .messages({
    'string.pattern.base': customMessages['string.pattern.base'],
    'any.required': customMessages['any.required']
  });
//validation verify otp
const verifyOtpValidation = Joi.object({
  userId:objectIdValidation,
  otp: otpPattern, 
  purpose: otpPurposeField
 
  });
  
  //resendOtp
  const resendOtpValidation = Joi.object({
  userId: objectIdValidation,
  purpose: otpPurposeField
});
   
// const resetPasswordValidation = Joi.object({
//   resetToken: Joi.string()
//     .required()
//     .messages({
//       'any.required': 'Reset token is required',
//       'string.empty': 'Reset token cannot be empty'
//     }),

//   newPassword: strongPasswordValidation.messages({
//     'any.required': 'New password is required'
//   })
// });


const resetPasswordValidation = Joi.object({
  resetToken: Joi.string()
    .required()
    .trim()
    .messages({
      'any.required': 'Reset token is required',
      'string.empty': 'Reset token cannot be empty'
    }),

  newPassword: strongPasswordValidation
    .required()
    .messages({
      'any.required': 'New password is required'
    })
});

const addAddressValidation = Joi.object({
  fullName: Joi.string()
    .min(2)
    .max(100)
    .required()
    .label('Full Name'),

  label: Joi.string()
    .valid('Home', 'Work', 'Other')
    .optional()
    .label('Label'),

  houseNumber: Joi.string()
    .required()
    .label('House Number'),

  addressLine: Joi.string()
    .min(5)
    .required()
    .label('Address Line'),

  locality: Joi.string()
    .required()
    .label('Locality'),

  city: Joi.string()
    .required()
    .label('City'),

  pinCode: Joi.string()
    .pattern(/^\d{6}$/)
    .required()
    .label('Pin Code')
    .messages({
      'string.pattern.base': 'Pin Code must be exactly 6 digits'
    }),

  state: Joi.string()
    .required()
    .label('State'),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .label('Phone Number')
    .messages({
      'string.pattern.base': 'Phone number must start with 6–9 and be 10 digits'
    }),

  isDefault: Joi.boolean().optional()
});


const forgotPasswordValidation = Joi.object({
  email:  commonPatterns.email.messages(customMessages)
});

// const baseOtpVerification = {
//   otp: otpPattern,
//   purpose: otpPurposeField
// };

// const verifyForgotOtpValidation = Joi.object({
//   userId: commonPatterns.objectId
//     .required()
//     .messages({
//       'string.pattern.base': 'Invalid user ID',
//       'any.required': 'User ID is required'
//     }),
//   otp: otpPattern,
//   purpose: Joi.string().valid('PASSWORD_RESET').required()
// });
const updateAddressValidation = Joi.object({
  fullName: Joi.string().min(2).optional(),
  label: Joi.string().valid('Home', 'Work', 'Other').optional(),
  houseNumber: Joi.string().optional(),
  addressLine: Joi.string().optional(),
  locality: Joi.string().optional(),
  city: Joi.string().optional(),
  pinCode: Joi.string().pattern(/^\d{6}$/).optional(),
  state: Joi.string().optional(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).optional(),
  isDefault: Joi.boolean().optional()
}).min(1)
.unknown(false); // rejects extra fields like _id and userId


const ValidationHelpers = {
  validatePagination: (query) => {
    const { error, value } = paginationValidation.validate(query);
    if (error) throw error;
    return value;
  },

  isValidObjectId: (id) => {
    return commonPatterns.objectId.validate(id).error === undefined;
  },

  isValidEmail: (email) => {
    return commonPatterns.email.validate(email).error === undefined;
  },

  checkPasswordStrength: (password) => {
    const { error } = strongPasswordValidation.validate(password);
    return error === undefined;
  },
  validateOtp: (data) => {
  const { error, value } = verifyOtpValidation.validate(data);
  if (error) throw error;
  return value;
}

  
};



module.exports = {
  registerValidation,
  loginValidation,
  adminLoginValidation,
  // profileUpdateValidation,
  passwordChangeValidation,
  statusUpdateValidation,
  // banUserValidation,
  // paginationValidation,
  ValidationHelpers,
  commonPatterns,
  customMessages,
  strongPasswordValidation,
   resetPasswordValidation,
   forgotPasswordValidation,
  // verifyForgotOtpValidation,
  verifyOtpValidation,
  resendOtpValidation,
  addAddressValidation,
  updateAddressValidation
};
