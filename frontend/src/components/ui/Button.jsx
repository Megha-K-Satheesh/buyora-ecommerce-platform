import { memo } from "react";

const Button = memo(
  ({
    children,
    type = "button",
    variant = "primary", // primary | secondary | danger
    size = "md", // sm | md | lg
    fullWidth = false,
    loading = false,
    disabled = false,
    icon,
    className = "",
    ...props
  }) => {
    const baseStyle =
      "inline-flex items-center justify-center gap-2 rounded-md font-medium transition focus:outline-none";

    const variants = {
      // primary: "bg-blue-600 text-white hover:bg-blue-700",
        primary: "bg-[#E91E63] text-white hover:bg-[#C2185B]",
      secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
      danger: "bg-red-600 text-white hover:bg-red-700",
      outline:"border border-pink-600 text-black hover:bg-pink-100",
      text:"bg-transparent text-blue-600 hover:underline",
     };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    const width = fullWidth ? "w-full" : "";
    const disabledStyle =
      disabled || loading ? "opacity-60 cursor-not-allowed" : "";

    return (
      <button
        type={type}
        disabled={disabled || loading}
        className={`
          
        ${baseStyle}
        ${variants[variant]}
        ${sizes[size]}
        ${width}
        ${disabledStyle}
        ${className}
      `}
        {...props}
      >
        {loading ? (
          <span>Loading...</span>
        ) : (
          <>
            {icon && <span>{icon}</span>}
            <span>{children}</span>
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
