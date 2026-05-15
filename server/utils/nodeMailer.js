const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const config = require('../config/config');
const logger = require('./logger');


const transporter = nodemailer.createTransport({

  
  host: 'smtp.gmail.com',
  port: 587,     
  secure: false,   
  auth: {
    user: config.EMAIL,
    pass: config.APP_PASSWORD
  },
  

  family: 4,
  tls: {
    rejectUnauthorized: false
  }
});



//DEBUG
// transporter.verify((error, success) => {

//   console.log("EMAIL:", config.EMAIL);
// console.log("APP_PASSWORD:", config.APP_PASSWORD);
//   if (error) {
//     console.log("SMTP ERROR:", error);
//   } else {
//     console.log("SMTP server is ready to send emails");
//   }
// });

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
  if (!user.email) {
    logger.error("User email is missing");
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"Buyora" <${config.EMAIL}>`,
      to: user.email,
      subject: "Verify your email",
      html: `
        <h3>Hello ${user.name}</h3>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
      `,
    });

    logger.info("OTP email sent");

    return true;
  } catch (error) {
    logger.error("OTP email failed", { error });

    return false;
  }
};

module.exports = {
  generateOtp,
  sendOtpEmail
};
