
import { useEffect, useState } from "react";
import { Range, getTrackBackground } from "react-range";

const PriceRange = ({
  minPrice = 0,
  maxPrice = 10000,
  step = 500,
  selectedPriceRange,
  onChange,
}) => {
  const [values, setValues] = useState([
    selectedPriceRange?.[0] || minPrice,
    selectedPriceRange?.[1] || maxPrice,
  ]);
  const minGap = step; // minimum gap between thumbs
  
  // Sync when parent changes
  useEffect(() => {
    if (selectedPriceRange) {
      setValues(selectedPriceRange);
    }
  }, [selectedPriceRange]);
  if (!minPrice || !maxPrice || minPrice >= maxPrice) return null;

  return (
    <div className="w-full px-4">
      <Range
        step={step}
        min={minPrice}
        max={maxPrice}
        values={values}
        onChange={(vals) => {
          if (vals[1] - vals[0] >= minGap) {
            setValues(vals);
            if (onChange) onChange(vals);
          }
        }}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="h-2 w-full rounded-full bg-gray-200"
            style={{
              background: getTrackBackground({
                values,
                colors: ["#e5e7eb", "#f97316", "#e5e7eb"],
                min: minPrice,
                max: maxPrice,
              }),
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props, index }) => (
          <div
            {...props}
            className="h-5 w-5 bg-white border-2 border-orange-500 rounded-full shadow-md flex items-center justify-center"
          >
            <div className="absolute -top-7 text-xs font-medium text-gray-700">
              ₹{values[index]}
            </div>
          </div>
        )}
      />

      {/* Selected Price Display */}
      <div className="mt-4 text-sm font-medium text-gray-700">
        ₹{values[0]} - ₹{values[1]}
      </div>
    </div>
  );
};

export default PriceRange;
