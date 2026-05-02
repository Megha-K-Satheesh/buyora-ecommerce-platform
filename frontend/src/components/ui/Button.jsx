import { memo } from "react";

const Button = memo(
  ({
    children,
    type = "button",
    variant = "primary", 
    size = "md",
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
  primary: "bg-primary text-white hover:bg-primary-hover",
  secondary: "bg-surface text-textPrimary hover:bg-border",
  danger: "bg-danger text-white hover:opacity-90",
  outline: "border border-primary text-textPrimary hover:bg-accent-soft",
  text: "bg-transparent text-primary hover:underline",
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
