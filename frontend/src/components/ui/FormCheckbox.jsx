import { forwardRef, memo } from 'react';

const FormCheckbox = memo(
  forwardRef(({
    label,
    error,
    containerClassName = '',
    checkboxClassName = '',
    labelClassName = '',
    ...props
  }, ref) => {
    return (
      <div className={`flex items-start gap-2 ${containerClassName}`}>
        <input
          ref={ref}
          type="checkbox"
          className={`mt-1 scale-125 ${checkboxClassName}`}
          {...props}
        />

        <div className="flex flex-col">
          {label && (
            <label className={`text-sm ${labelClassName}`}>
              {label}
            </label>
          )}

          { (
            <p className="text-sm  text-red-600 h-6">{error}</p>
          )}
        </div>
      </div>
    );
  })
);

FormCheckbox.displayName = 'FormCheckbox';
export default FormCheckbox;
