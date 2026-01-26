
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import OtpInput from "../../components/ui/OTPInput";
import { showError, showSuccess } from "../../components/ui/Toastify";
import { clearAuthError, resendOtp, verifyOtp } from "../../Redux/slices/authSlice";
const VerifyOtpPage = () => {
  const [otpValue, setOtpValue] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const otpRef = useRef();
  const { loading, error } = useSelector((state) => state.auth);

  const rawUserId =
    useSelector((state) => state.auth.userId) ||
    localStorage.getItem("otpUserId");
  const userId = rawUserId && rawUserId !== "undefined" ? rawUserId : null;

  const handleOtpComplete = (otp) => {
    setOtpValue(otp);
     dispatch(clearAuthError())
  };

  const handleVerifyClick = async () => {
    if (!userId) {
      showError("Session expired. Please register again.");
      navigate("/");
      return;
    }

    if (otpValue.length !== 6) return;

    try {
     const res= await dispatch(
        verifyOtp({ userId, otp: otpValue, purpose: "EMAIL_VERIFICATION" }),
      ).unwrap();
      console.log(res)
      navigate("/home");
    } catch {
         otpRef.current?.reset();
         setOtpValue("") 
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
    
    await dispatch(resendOtp({ userId, purpose: "EMAIL_VERIFICATION" })).unwrap();

    
    showSuccess("OTP resent successfully!");
  } catch (err) {
    
    showError(err || "Failed to resend OTP");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 via-sky-300 to-amber-300">
      <div className="card bg-white shadow-lg p-6 rounded-md w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl ">
       <h1 className='text-3xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-bold mt-6 mb-10'>Verify OTP</h1>

        <OtpInput
          length={6}
          label="Enter the 6-digit OTP"
          disabled={loading}
          error={error}
          onComplete={handleOtpComplete}
          ref={otpRef}
        />
      
         
        <Button
          disabled={loading}
          variant="primary"
          fullWidth
          size="md"
          className="mt-6"
          loading={loading}
          onClick={handleVerifyClick}
        >
          Verify OTP
        </Button>
         <div className="mt-4 text-center text-lg text-gray-600">
               Haven’t received the OTP yet?{" "}
                 <Button
                variant="text"
                onClick={handleResendClick}
                disabled={loading}
                
                className="pl-0 text-lg"
                >
                  Resend OTP
                </Button>
         
          </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
