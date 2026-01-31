import { forwardRef, memo } from 'react';

const FormInput = memo(
  forwardRef(({
    label,
    type = 'text',
    placeholder,
    icon,
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
          <label className="text-xs lg:text-sm  font-medium text-gray-900">
            {label}{required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {icon ? (
          <div className={`flex items-center border rounded-md px-2 ${inputGroupClassName} ${error ? 'border-red-500' : 'border-gray-300'}`}>
            <i className={`${icon} text-gray-400 mr-2`} />
            <input
              ref={ref}
              type={type}
              placeholder={placeholder}
              className={`flex-1 py-2 focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-pink-600-500'} ${className}`}
              {...props}
            />
          </div>
        ) : (
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            className={` w-full border rounded-md px-3 py-1  lg:h-11  
              placeholder:text-xl
              text-xl
              focus:outline-none focus:ring-2 
${error ? 'border-red-600 focus:ring-red-500' : 'border-gray-300 focus:ring-pink-500'} ${className}`}
            {...props}
          />
        )}

        { <p className="text-xs lg:text-sm text-red-600 h-3">{error}</p>}
        {!error && helpText && <span className="text-xs text-gray-500">{helpText}</span>}
      </div>
    );
  })
);

FormInput.displayName = 'FormInput';

export default FormInput;

