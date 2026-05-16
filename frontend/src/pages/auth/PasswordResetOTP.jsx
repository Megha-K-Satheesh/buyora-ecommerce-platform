
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import OtpInput from "../../components/ui/OTPInput";
import { showError, showSuccess } from "../../components/ui/Toastify";
import { clearAuthError, resendOtp, verifyPasswordResetOtp } from "../../Redux/slices/authSlice";

const VerifyPasswordOtp = () => {
  const [otpValue, setOtpValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const otpRef = useRef();
  const rawUserId =
    
    localStorage.getItem("otpUserId");
  const userId = rawUserId && rawUserId !== "undefined" ? rawUserId : null;

  const handleOtpComplete = (otp) => {
    setOtpValue(otp);
    setError("");
  };

  const handleVerifyClick = async () => {
    if (!userId) {
      alert("Session expired. Please register again.");
      navigate("/");
      return;
    }

    if (otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
     const res= await dispatch(
        verifyPasswordResetOtp({ userId, otp: otpValue, purpose:"PASSWORD_RESET"}),
      ).unwrap();
     
      navigate("/Reset-Password",{replace:true});
    } catch (err) {
      setError(err || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };
  const handleResendClick = async () => {
  if (!userId) {
    showError("Session expired. Please register again.");
    navigate("/");
    return;
  }

  otpRef.current?.reset();
  setOtpValue("");
  dispatch(clearAuthError());

  try {
    const message = await dispatch(
      resendOtp({ userId, purpose: "PASSWORD_RESET" })
    ).unwrap();

    showSuccess(message || "OTP resent successfully!");
  } catch (err) {
    showError(err || "Failed to resend OTP");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-soft">
      <div className="card bg-bg-main shadow-lg p-6 rounded-md w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-5 sm:mx-5">
       <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-bold mt-6 mb-10'>     Password Reset Verify OTP</h1>

        <OtpInput
          length={6}
          label="Enter the 6-digit OTP"
          disabled={loading}
          error={error}
          onComplete={handleOtpComplete}
        />
      
         
        <Button
          variant="primary"
          fullWidth
          size="md"
          className="mt-6"
          loading={loading}
          onClick={handleVerifyClick}
        >
           {loading ? "Verifying OTP..." : "Verify OTP"}
        </Button>

         <div className="mt-4 text-center text-lg text-gray-600">
               Haven’t received the OTP yet?{" "}
                 <Button
    variant="text"
    onClick={handleResendClick}
    
    
    className="pl-0 text-lg"
  >
    Resend OTP
  </Button>

          </div>
      </div>
    </div>
  );
};

export default VerifyPasswordOtp;
