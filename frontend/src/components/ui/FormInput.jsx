

import { forwardRef, memo } from 'react';

const FormInput = memo(
  forwardRef(({
    label,
    type = 'text',
    placeholder,
    icon,
    rightIcon,
    error,
    helpText,
    className = '',
    containerClassName = '',
    inputGroupClassName = '',
    required = false,
    ...props
  }, ref) => {
    return (
      <div className={`flex flex-col gap-1 pb-1.5 ${containerClassName}`}>
        {label && (
          <label className="text-xs lg:text-lg text-black">
            {label}
            {required && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
        )}

        {icon ? (
          <div
            className={`flex items-center border rounded-md px-2 
            ${inputGroupClassName} 
            ${error ? 'border-red-500' : 'border-gray-300'}`}
          >
            <i className={`${icon} text-gray-400 mr-2`} />

            <input
              ref={ref}
              type={type}
              placeholder={placeholder}
              className={`flex-1 py-2 focus:outline-none focus:ring-2 appearance-none
              ${error ? 'focus:ring-red-500 placeholder:text-xs' : 'focus:ring-pink-500'} 
              ${className}`}
              {...props}
            />

            {rightIcon && (
              <span className="cursor-pointer text-xl text-gray-500 ml-2">
                {rightIcon}
              </span>
            )}
          </div>
        ) : (
          <div
            className={`w-full border rounded-md px-3 py-1 lg:h-11 flex items-center
            ${error
              ? 'border-red-600 focus-within:ring-red-500'
              : 'border-gray-300 focus-within:ring-pink-500'}
            focus-within:ring-2`}
          >
            <input
              ref={ref}
              type={type}
              placeholder={placeholder}
              className={`w-full outline-none appearance-none
             placeholder:text-xs
              placeholder:lg:text-xl
              ${className}`}
              {...props}
            />

            {rightIcon && (
              <span className="cursor-pointer text-xl text-gray-500">
                {rightIcon}
              </span>
            )}
          </div>
        )}

        <p className="text-xs lg:text-sm text-red-500 h-3">
          {error}
        </p>

        {!error && helpText && (
          <span className="text-xs text-gray-500">
            {helpText}
          </span>
        )}
      </div>
    );
  })
);

FormInput.displayName = 'FormInput';

export default FormInput;
