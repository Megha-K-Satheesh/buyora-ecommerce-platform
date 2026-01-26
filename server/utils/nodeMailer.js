const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const config = require('../config/config');
const logger = require('./logger');


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,       // STARTTLS port
  secure: false,   // use TLS (STARTTLS)
  auth: {
    user: config.EMAIL,
    pass: config.APP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});


const generateOtp = (purpose) => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false
  });
   
  return {
    code: otp,
    expiresAt: Date.now() + 10 * 60 * 1000,
    purpose
  };
};

const sendOtpEmail = async (user, otp) => {
  if (!user.email) throw new Error('User email is missing, cannot send OTP');

  try {
    await transporter.sendMail({
      from: `"Buyora" <${config.EMAIL}>`,
      to: user.email,
      subject: 'Verify your email',
      html: `
        <h3>Hello ${user.name}</h3>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
      `
    });

    logger.info('OTP email sent');
  } catch (error) {
    logger.error('OTP email failed', { error });
    throw error;
  }
};


module.exports = {
  generateOtp,
  sendOtpEmail
};
