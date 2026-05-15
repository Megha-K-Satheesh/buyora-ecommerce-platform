



import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { TiStarFullOutline } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Footer from "../../components/ui/Footer";
import Loader from "../../components/ui/Loader";
import Navbar from "../../components/ui/Navbar";
import { showError, showSuccess } from "../../components/ui/Toastify";
import ReviewSection from "../../components/user/ReviewSection";
import { addToCart, addToCartBackend } from "../../Redux/slices/cartSlice";
import { getProductById } from "../../Redux/slices/general/productSlice";
import {
  addToWishlist,
  addToWishlistOptimistic,
  getWishlist,
  removeFromWishlist,
  removeFromWishlistOptimistic
} from "../../Redux/slices/wishlistSlice";

const SingleProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { product, error, loading } = useSelector(
    (state) => state.generalProducts
  );
  const { cartItems } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const wishlist = useSelector((state) => state.wishlist.items || []);

  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.images?.length) setMainImage(product.images[0]);
  }, [product]);

  useEffect(() => {
    if (token) dispatch(getWishlist({ page: 1, limit: 100 }));
  }, [dispatch, token]);

  const totalStock =
    product?.variations?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;

  const isOutOfStock = totalStock === 0;

  const liked = wishlist.some((item) => item._id === product?._id);

  const isInCart = cartItems.some(
    (item) =>
      item.productId === product?._id &&
      item.size === selectedSize &&
      item.color === selectedColor
  );

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    if (!selectedSize || !selectedColor) {
      showError("Please select size and color");
      return;
    }

    const selectedVariation = product.variations.find(
      (v) =>
        v.attributes.Size === selectedSize &&
        v.attributes.Color === selectedColor
    );

    if (!selectedVariation) return;

    const cartItem = {
      productId: product._id,
      variationId: selectedVariation._id,
      name: product.name,
      brandName: product.brand.name,
      image: mainImage,
      price: product.sellingPrice,
      mrp: product.mrp,
      discountPercentage: product.discountPercentage,
      size: selectedSize,
      color: selectedColor,
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

  const handleWishlistToggle = async () => {
    if (!token) {
      showError("Please login to manage wishlist");
      return;
    }

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
      showError(err || "Failed to update wishlist");
    }
  };

  if (loading)
    return <div className="text-center mt-10 text-text-muted"><Loader/></div>;
  if (error)
    return <p className="text-center mt-10 text-danger">{error}</p>;
  if (!product)
    return <p className="text-center mt-10 text-text-muted">Product not found</p>;

  const sizes = [...new Set(product.variations.map((v) => v.attributes.Size))];
  const colors = [...new Set(product.variations.map((v) => v.attributes.Color))];

  return (
    <div>
      <Navbar />

      {/* MAIN WRAPPER */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-10 mt-20 p-4 sm:p-6 bg-bg-main">

        {/* LEFT SECTION */}
        <div className="flex flex-col md:flex-row gap-4 flex-1">

          {/* MAIN IMAGE */}
          <div className="order-1 md:order-2 flex-1 flex items-center justify-center rounded-lg p-2 bg-bg-main relative">

            {isOutOfStock && (
              <div className="absolute top-4 left-4 bg-danger text-white px-3 py-1 rounded text-sm">
                Out of Stock
              </div>
            )}

            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-auto max-h-[300px] sm:max-h-[400px] lg:max-h-[500px] object-contain rounded-lg"
            />
          </div>

          {/* THUMBNAILS */}
          <div className="order-2 md:order-1 flex flex-row md:flex-col gap-2 sm:gap-3 mt-3 md:mt-0 overflow-x-auto md:overflow-visible">

            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name}-${index}`}
                className={`w-16 sm:w-18 md:w-20 flex-shrink-0 cursor-pointer rounded border-2 ${
                  mainImage === img
                    ? "border-border-primary"
                    : "border-border-light"
                }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex-1 flex flex-col text-text-primary w-full">

          <h1 className="text-2xl sm:text-3xl font-bold">
            {product.brand.name}
          </h1>

          <p className="text-text-muted mt-1 text-xl sm:text-2xl">
            {product.name}
          </p>

          {/* RATING */}
          <div className="flex flex-wrap items-center gap-2 mt-2 text-text-primary text-base sm:text-lg">
            <span className="font-semibold">
              {product.rating?.toFixed(1) || "0.0"}
            </span>

            <span className="text-green-500 text-xl">
              <TiStarFullOutline />
            </span>

            <span className="text-text-muted">
              | {product.ratingCount >= 1000
                ? `${(product.ratingCount / 1000).toFixed(1)}k`
                : product.ratingCount || 0} Ratings
            </span>
          </div>

          {/* PRICE */}
          <p className="mt-4 text-xl sm:text-2xl lg:text-3xl font-semibold">
            ₹{product.sellingPrice}{" "}
            <span className="line-through text-text-muted text-lg sm:text-2xl ml-1">
              ₹{product.mrp}
            </span>{" "}
            <span className="text-warning ml-2">
              ({product.discountPercentage}% OFF)
            </span>
          </p>

          {/* SIZE */}
          {!isOutOfStock && (
            <div className="mt-6">
              <h2 className="font-bold mb-2 text-base sm:text-lg">
                SELECT SIZE
              </h2>

              <div className="grid grid-cols-4 sm:flex gap-2 flex-wrap mt-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`lg:px-3  py-2 border rounded ${
                      selectedSize === size
                        ? "text-primary border-border-primary"
                        : "border-border-light text-text-secondary"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* COLOR */}
          {!isOutOfStock && (
            <div className="mt-4">
              <h2 className="font-bold mb-2 text-base sm:text-lg">
                SELECT COLOR
              </h2>

              <div className="grid grid-cols-2 sm:flex gap-2 flex-wrap mt-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`px-4 py-2 border rounded ${
                      selectedColor === color
                        ? "text-primary border-border-primary"
                        : "border-border-light text-text-secondary"
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">

            <button
              disabled={isOutOfStock || isInCart}
              onClick={handleAddToCart}
              className={`flex-1 py-3 text-base sm:text-lg lg:text-xl border border-border rounded font-semibold text-white ${
                isOutOfStock
                  ? "bg-border cursor-not-allowed"
                  : isInCart
                  ? "bg-success cursor-not-allowed"
                  : selectedSize && selectedColor
                  ? "bg-primary hover:bg-primary-hover"
                  : "bg-border cursor-not-allowed"
              }`}
            >
              {isOutOfStock
                ? "OUT OF STOCK"
                : isInCart
                ? "ADDED TO CART"
                : "ADD TO CART"}
            </button>

            <button
              onClick={handleWishlistToggle}
              className="flex items-center justify-center gap-2 flex-1 py-3 border border-border text-base sm:text-lg rounded text-text-primary"
            >
              {liked ? (
                <AiFillHeart className="text-danger text-2xl" />
              ) : (
                <AiOutlineHeart className="text-text-light text-2xl" />
              )}
              {liked ? "WISHLISTED" : "WISHLIST"}
            </button>
          </div>

          {/* DESCRIPTION */}
          <div className="mt-6 w-full">
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-text-secondary">{product.description}</p>
          </div>
        </div>
      </div>

      {/* REVIEW */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <ReviewSection productId={id} />
      </div>

      <Footer />
    </div>
  );
};

export default SingleProductPage;
