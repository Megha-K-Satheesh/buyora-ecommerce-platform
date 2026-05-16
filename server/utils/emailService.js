const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const logger = require("./logger");

const generateOtp = (purpose) => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  return {
    code: otp,
    expiresAt: Date.now() + 10 * 60 * 1000,
    purpose,
  };
};

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
  connectionTimeout: 10000,
});

const sendOtpEmail = async (user, otp) => {
  try {
    if (!user.email) {
      logger.error("User email is missing");
      return false;
    }

    await transporter.sendMail({
      from: `Buyora <${process.env.EMAIL}>`,
      to: user.email,
      subject: "Verify your email",
      html: `
        <h3>Hello ${user.name}</h3>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
      `,
    });

    logger.info("OTP email sent via Brevo SMTP");
    return true;
  } catch (error) {
    logger.error("OTP email failed (Brevo SMTP)", { error });
    return false;
  }
};

module.exports = {
  generateOtp,
  sendOtpEmail,
};
