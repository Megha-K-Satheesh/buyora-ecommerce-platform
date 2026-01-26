
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

const OtpInput = forwardRef (({ length = 6, onComplete, error, disabled, label},ref) => {
  
  const [otp, setOtp] = useState(Array(length).fill(""));

  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      onComplete?.(newOtp.join(""));
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };
useImperativeHandle(ref, () => ({
  reset: () => setOtp(Array(length).fill(""))
}));

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <h2 className="text-base sm:text-lg text-center font-semibold mb-4 sm:mb-6">
          {label}
        </h2>
      )}

      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={disabled}
            ref={(el) => (inputsRef.current[index] = el)}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleBackspace(e, index)}
            className={`
              w-10 h-10 sm:w-12 sm:h-12
              text-lg sm:text-xl
              text-center
              border rounded-md
              border-sky-500
              focus:outline-none focus:ring-2 focus:ring-blue-500
              ${error ? "border-red-500" : "border-gray-300"}
            `}
          />
        ))}
      </div>

      {error && (
        <p className="text-red-500 text-xs sm:text-sm mt-1 text-center">
          {error}
        </p>
      )}
    </div>
  );
});

export default OtpInput;
