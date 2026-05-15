
const WishlistCard = ({
  productImage,
  title,
  price,
  originalPrice,
  discount,
  variations,
  onMoveToBag,
  onRemove,
}) => {
  const totalStock =
    variations?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;

  const isOutOfStock = totalStock === 0;

  const discountedPrice = (originalPrice * (1 - discount / 100)).toFixed(0);

  return (
    <div className="relative z-0 rounded-lg p-6  shadow hover:shadow-lg transition-shadow duration-200 ml-10  w-full max-w-[300px]  sm:w-65  lg:w-70 bg-bg-main flex flex-col">

      <div className="relative w-full h-auto flex-shrink-0 overflow-hidden rounded-lg mb-4">

        <img
          src={productImage}
          alt={title}
          className={`w-full h-full object-cover block transition-transform duration-300 hover:scale-105 ${
            isOutOfStock ? "opacity-40 grayscale" : ""
          }`}
        />

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-white text-danger font-semibold px-3 py-1 text-sm">
              OUT OF STOCK
            </span>
          </div>
        )}

        <button
          onClick={onRemove}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-bg-muted rounded-full text-text-secondary hover:bg-border hover:text-danger transition-colors duration-200 font-bold z-10"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col justify-between flex-grow">

        <h3 className="font-medium text-text-primary mb-2 truncate overflow-hidden whitespace-nowrap">
          {title}
        </h3>

        <div className="flex items-center mb-3">
          <span className="text-lg font-bold mr-2 text-text-primary">
            ₹{discountedPrice}
          </span>
          <span className="line-through text-text-light mr-2">
            ₹{originalPrice}
          </span>
          <span className="text-success font-semibold">
            {discount}% OFF
          </span>
        </div>

        <button
          onClick={onMoveToBag}
          disabled={isOutOfStock}
          className={`w-full py-2 font-bold rounded transition-colors duration-200 border ${
            isOutOfStock
              ? "text-danger border-border cursor-not-allowed bg-bg-muted"
              : "text-warning border-border hover:bg-warning hover:text-white"
          }`}
        >
          {isOutOfStock ? "OUT OF STOCK" : "MOVE TO BAG"}
        </button>

      </div>
    </div>
  );
};

export default WishlistCard;

