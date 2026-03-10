
const WishlistCard = ({
  productImage,
  title,
  price,
  originalPrice,
  discount,
  onMoveToBag,
  onRemove,
}) => {
  const discountedPrice = (originalPrice * (1 - discount / 100)).toFixed(0);

  return (
    <div className="relative z-0 rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-200 w-full sm:w-72 bg-white flex flex-col">
      
      {/* Image wrapper */}
      <div className="relative w-full h-auto flex-shrink-0 overflow-hidden rounded-lg mb-4">
        <img
          src={productImage}
          alt={title}
          className="w-full h-full object-cover block transition-transform duration-300 hover:scale-105"
        />

        {/* Remove button */}
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:bg-gray-400 hover:text-red-500 transition-colors duration-200 font-bold z-10"
        >
          ✕
        </button>
      </div>

      {/* Product Info */}
      <div className="flex flex-col justify-between flex-grow">
        <h3 className="font-medium text-gray-900 mb-2 truncate overflow-hidden whitespace-nowrap">
          {title}
        </h3>

        {/* Pricing */}
        <div className="flex items-center mb-3">
          <span className="text-lg font-bold mr-2">₹{discountedPrice}</span>
          <span className="line-through text-gray-400 mr-2">₹{originalPrice}</span>
          <span className="text-green-600 font-semibold">{discount}% OFF</span>
        </div>

        {/* Move to Bag Button */}
        <button
          onClick={onMoveToBag}
          className="w-full py-2 text-orange-600 border font-bold rounded hover:bg-orange-600 hover:text-white transition-colors duration-200"
        >
          MOVE TO BAG
        </button>
      </div>
    </div>
  );
};

export default WishlistCard;


