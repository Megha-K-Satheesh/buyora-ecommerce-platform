


const { Resend } = require("resend");
const otpGenerator = require("otp-generator");
const config = require("../config/config");
const logger = require("./logger");

const resend = new Resend(process.env.RESEND_API_KEY);


console.log("RESEND KEY LOADED:", !!process.env.RESEND_API_KEY);

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

const sendOtpEmail = async (user, otp) => {
  if (!user.email) {
    logger.error("User email is missing");
    return false;
  }

  try {
    await resend.emails.send({
      from: "Buyora <onboarding@resend.dev>",
      to: user.email,
      subject: "Verify your email",
      html: `
        <h3>Hello ${user.name}</h3>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
      `,
    });

    logger.info("OTP email sent via Resend");
    return true;
  } catch (error) {
    logger.error("OTP email failed (Resend)", { error });
    return false;
  }
};

module.exports = {
  generateOtp,
  sendOtpEmail,
};
