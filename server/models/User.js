const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');



const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },

  mobile: {
  type: String,
  default: null
},
gender: {
  type: String,
  enum: ["MALE", "FEMALE", "OTHER",null],
  default: null
},
dob: {
  type: Date,
  default: null
},
location: {
  type: String,
  default: null
},
altMobile: {
  type: String,
  default: null
}
  ,
 
  password: {
  type: String,
  minlength: [6, 'Password must be at least 6 characters long'],
  
},
googleId: {
  type: String,
  default: null
},
   addresses:[{
     type:mongoose.Schema.Types.ObjectId,
     ref:"Address",
     default:[]
   }],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'banned'],
    default: 'active'
  },
  banReason: {
    type: String,
    default: null
  },
  bannedAt: {
    type: Date,
    default: null
  },
  bannedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isVerified: {
  type: Boolean,
  default: false
},
otpDetails: {
  code: {
    type: String
  },
  expiresAt: {
    type: Date
  },
  purpose: {
    type: String,
    enum: ['EMAIL_VERIFICATION', 'PASSWORD_RESET']
  }
},

}, {
  timestamps: true
});


// userSchema.pre('save', async function () {
//   // try {
    

//     if (this.isModified('password') && this.password) {
//   this.password = await bcrypt.hash(this.password, 12);
// }

//     // Hash OTP
//     if (this.isModified('otpDetails') && this.otpDetails?.code) {
//       this.otpDetails.code = await bcrypt.hash(this.otpDetails.code, 12);
//     }

//     // next();
//   // } catch (error) {
//     // next(error);
//   // }
// });

userSchema.pre('save', async function () {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  if (this.isModified('otpDetails.code') && this.otpDetails?.code) {
    this.otpDetails.code = await bcrypt.hash(this.otpDetails.code, 12);
  }
});
userSchema.methods.compareOtp = async function (candidateOtp) {
  return await bcrypt.compare(candidateOtp, this.otpDetails.code);
};



userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

userSchema.statics.findActiveUsers = function() {
  return this.find({ status: 'active' });
};

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

module.exports = mongoose.model('User', userSchema);
