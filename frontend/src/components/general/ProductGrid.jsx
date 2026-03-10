



import { debounce } from "lodash";
import { useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart, addToCartBackend } from "../../Redux/slices/cartSlice";
import {
  addToWishlist,
  addToWishlistOptimistic,
  getWishlist,
  removeFromWishlist,
  removeFromWishlistOptimistic,
} from "../../Redux/slices/wishlistSlice";
import { showError, showSuccess } from "../ui/Toastify";

const ProductGrid = ({ products = [] }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (token) dispatch(getWishlist({ page: 1, limit: 100 }));
  }, [dispatch, token]);

  const handleClick = (product) => {
    navigate(`/product/${product.slug}/${product._id}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();

    const firstVariation = product.variations?.[0];
    if (!firstVariation) return;

    const cartItem = {
      productId: product._id,
      variationId: firstVariation._id,
      name: product.name,
      brandName: product.brand?.name,
      image: product.images?.[0],
      price: product.sellingPrice,
      mrp: product.mrp,
      discountPercentage: product.discountPercentage,
      size: firstVariation.attributes?.Size,
      color: firstVariation.attributes?.Color,
      quantity: 1,
    };

    if (token) {
      dispatch(addToCartBackend(cartItem));
      showSuccess("Added to cart");
    } else {
      dispatch(addToCart(cartItem));
      showSuccess("Added to cart (local)");
    }
  };


  const isWishlisted = (productId) =>
    wishlistItems.some((item) => item._id === productId);

  // Debounced wishlist handler
  const handleWishlistToggleDebounced = debounce(async (product) => {
    if (!token) {
      showError("Please login to manage wishlist");
      return;
    }

    const liked = isWishlisted(product._id);

    try {
      if (liked) {
        dispatch(removeFromWishlistOptimistic(product._id));
        await dispatch(removeFromWishlist(product._id)).unwrap();
        showSuccess("Removed from wishlist");
      } else {
        dispatch(addToWishlistOptimistic(product));
        await dispatch(addToWishlist(product._id)).unwrap();
        showSuccess("Added to wishlist");
      }
    } catch (err) {
     
      if (liked) {
        dispatch(addToWishlistOptimistic(product));
      } else {
        dispatch(removeFromWishlistOptimistic(product._id));
      }
      showError(err || "Failed to update wishlist");
    }
  }, 300); 

  if (!products.length) return <p>No Products Found</p>;

  return (
    <div className="grid lg:grid-cols-4 lg:gap-4 gap-3 mb-2 p-2 grid-cols-2">
      {products.map((product) => {
        const isInCart = cartItems.some(
          (item) => item.productId === product._id
        );

        return (
          <div
            key={product._id}
            className="rounded-lg lg:m-4 lg:p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer relative"
            onClick={() => handleClick(product)}
          >
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.images[0]}
                alt={product.name}
                className="lg:w-full lg:h-82 object-cover mb-3 rounded"
              />

            
              <div
                className="absolute top-2 right-2    text-3xl cursor-pointer z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleWishlistToggleDebounced(product);
                }}
              >
                {isWishlisted(product._id) ? (
                  <AiFillHeart className="text-red-500" />
                ) : (
                  <AiOutlineHeart className="text-gray-400 " />
                )}
              </div>
            </div>

            <p className="text-gray-500 text-sm mb-1">{product.brand.name}</p>

            <h3 className="font-medium text-gray-900 mb-2 truncate overflow-hidden whitespace-nowrap">
              {product.name}
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-pink-600 font-semibold">
                ₹{product.sellingPrice}
              </span>
              <span className="text-gray-400 line-through">₹{product.mrp}</span>
              {product.discountPercentage > 0 && (
                <span className="text-orange-400 font-medium text-sm">
                  ({product.discountPercentage}% OFF)
                </span>
              )}
            </div>

            <button
              onClick={(e) => handleAddToCart(e, product)}
              disabled={isInCart}
              className={`mt-3 w-full py-2 rounded font-medium transition-all duration-200 ${
                isInCart
                  ? "border border-gray-300 text-orange-400 cursor-not-allowed"
                  : "border border-gray-300 text-gray-700 hover:bg-pink-600 hover:text-white"
              }`}
            >
              {isInCart ? "Added" : "Add To Cart"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;


