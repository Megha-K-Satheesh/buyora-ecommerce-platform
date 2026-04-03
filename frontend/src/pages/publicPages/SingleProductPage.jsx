






import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Footer from '../../components/ui/Footer';
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
    if (product?.images?.length) setMainImage(product.images[0]);
  }, [product]);

  
  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);


  useEffect(() => {
    if (token) dispatch(getWishlist({ page: 1, limit: 100 }));
  }, [dispatch, token]);

 
  const liked = wishlist.some((item) => item._id === product?._id);

  const isInCart = cartItems.some(
    (item) =>
      item.productId === product?._id &&
      item.size === selectedSize &&
      item.color === selectedColor
  );


  const handleAddToCart = () => {
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

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!product) return <p className="text-center mt-10">Product not found</p>;

  const sizes = [...new Set(product.variations.map((v) => v.attributes.Size))];
  const colors = [...new Set(product.variations.map((v) => v.attributes.Color))];

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-8 mt-25">

        {/* Images Section */}
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="order-1 md:order-2 flex-1 flex items-center justify-center rounded-lg p-2">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-[400px] md:h-[500px] object-contain rounded-lg"
            />
          </div>

          <div className="order-2 md:order-1 flex flex-row md:flex-col gap-10 lg:gap-2 mt-3 md:mt-0">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name}-${index}`}
                className={`w-20 h-auto object-contain cursor-pointer rounded border-2 ${
                  mainImage === img ? "border-pink-500" : "border-gray-200"
                }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex-1 flex flex-col mt-3">
          <h1 className="text-3xl font-bold">{product.brand.name}</h1>
          <p className="text-gray-400 mt-1 text-2xl">{product.name}</p>

          <p className="mt-4 text-3xl font-semibold">
            ₹{product.sellingPrice}{" "}
            <span className="line-through text-gray-400 text-2xl ml-1">
              ₹{product.mrp}
            </span>{" "}
            <span className="text-orange-500 ml-2">({product.discountPercentage}% OFF)</span>
          </p>

          {/* Sizes */}
          <div className="mt-6">
            <h2 className="font-bold mb-2 text-lg">SELECT SIZE</h2>
            <div className="flex gap-2 flex-wrap mt-5 text-lg">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`px-3 py-1 w-auto h-12 border rounded font-medium text-gray-800 ${
                    selectedSize === size ? "text-pink-500 border-pink-600" : "border-gray-300 bg-white"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="mt-4">
            <h2 className="font-bold mb-2 text-lg mt-2">SELECT COLOR</h2>
            <div className="flex gap-2 flex-wrap mt-4 text-lg">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`px-4 py-2 border rounded font-medium text-gray-800 ${
                    selectedColor === color ? "text-pink-500 border-pink-600" : "border-gray-300 bg-white"
                  }`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mt-8 text-2xl">
            <button
              disabled={!selectedSize || !selectedColor || isInCart}
              onClick={handleAddToCart}
              className={`flex-1 py-3 rounded text-white font-semibold transition-all duration-200 ${
                isInCart
                  ? "bg-green-500 cursor-not-allowed"
                  : selectedSize && selectedColor
                  ? "bg-pink-600 hover:bg-pink-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isInCart ? "Added ✓" : "Add to Cart"}
            </button>

            <button
              onClick={handleWishlistToggle}
              className="flex items-center justify-center gap-2 flex-1 py-3 rounded border border-gray-400 font-semibold bg-white hover:bg-gray-100 transition-all duration-200"
            >
              {liked ? (
                <AiFillHeart className="text-red-500 text-2xl" />
              ) : (
                <AiOutlineHeart className="text-gray-500 text-2xl" />
              )}
              {liked ? "Wishlisted" : "Wishlist"}
            </button>
          </div>

          <div className="mt-6">
            <h2 className="font-semibold mb-2">Product Description</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>

        </div>

      </div>
        <div className="max-w-7xl mx-auto px-6">
  <ReviewSection productId={id} />
</div>
<footer>
   <Footer/>
</footer>
    </>
  );
};

export default SingleProductPage;

