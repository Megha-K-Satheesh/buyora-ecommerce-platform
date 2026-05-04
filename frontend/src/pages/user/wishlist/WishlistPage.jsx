
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/ui/Loader";
import { showError, showSuccess } from "../../../components/ui/Toastify";
import WishlistCard from "../../../components/user/WishlistCart";
import {
  getWishlist,
  moveToCart,
  removeFromWishlist,
} from "../../../Redux/slices/wishlistSlice";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const wishlist = useSelector((state) => state.wishlist.items || []);
  const loading = useSelector((state) => state.wishlist.loading);
  const error = useSelector((state) => state.wishlist.error);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [mainImage, setMainImage] = useState("");

  const selectedVariation = selectedItem?.variations?.find(
    (v) =>
      v.attributes.Size === selectedSize &&
      v.attributes.Color === selectedColor
  );

  const variationStock = selectedVariation?.stock ?? 0;
  const isOutOfStock =
    selectedSize && selectedColor && variationStock === 0;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    dispatch(getWishlist({ page: 1, limit: 20 }));
  }, [user, dispatch, navigate]);

  const openModal = (item) => {
    setSelectedItem(item);
    setSelectedSize("");
    setSelectedColor("");
    setMainImage(item.images?.[0]);
  };

  const closeModal = () => setSelectedItem(null);

  const handleMoveToCart = async () => {
    if (!selectedSize || !selectedColor) {
      showError("Please select size and color");
      return;
    }

    if (variationStock === 0) {
      showError("This item is out of stock");
      return;
    }

    const selectedVariation = selectedItem.variations.find(
      (v) =>
        v.attributes.Size === selectedSize &&
        v.attributes.Color === selectedColor
    );

    if (!selectedVariation) {
      showError("Selected variation not available");
      return;
    }

    try {
      await dispatch(
        moveToCart({
          productId: selectedItem._id,
          variationId: selectedVariation._id,
          size: selectedSize,
          color: selectedColor,
          quantity: 1,
        })
      );

      showSuccess("Item moved to cart");
      closeModal();
    } catch (err) {
      showError(err || "Failed to move item to cart");
    }
  };

  const handleRemove = (item) => {
    dispatch(removeFromWishlist(item._id));
  };

  if (loading) return <div className="text-center mt-10"><Loader/></div>;
  if (error) return <p className="text-center mt-10 text-danger">{error}</p>;
  if (wishlist.length === 0)
    return <p className="text-center mt-10">Your wishlist is empty</p>;

  return (
    <div className="p-4 max-w-full">
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {wishlist.map((item) => (
          <WishlistCard
            key={item._id}
            productImage={item.images?.[0]}
            title={item.name}
            price={item.sellingPrice}
            originalPrice={item.mrp}
            discount={item.discountPercentage}
            onRemove={() => handleRemove(item)}
            onMoveToBag={() => openModal(item)}
             variations={item.variations} 
          />
        ))}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-bg-main rounded-lg p-6 w-80 sm:w-96 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-text-secondary hover:text-danger text-2xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4 text-text-primary">
              {selectedItem.name}
            </h2>

            <div className="mb-4">
              <h3 className="font-medium mb-2 text-text-primary">
                Select Size
              </h3>
              <div className="flex flex-wrap gap-2">
                {[...new Set(selectedItem.variations.map(v => v.attributes.Size))].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 border rounded ${
                      selectedSize === size
                        ? "border-primary text-primary"
                        : "border-border text-text-secondary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-medium mb-2 text-text-primary">
                Select Color
              </h3>
              <div className="flex flex-wrap gap-2">
                {[...new Set(selectedItem.variations.map(v => v.attributes.Color))].map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1 border rounded ${
                      selectedColor === color
                        ? "border-primary text-primary"
                        : "border-border text-text-secondary"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {isOutOfStock && (
              <p className="text-danger text-sm mb-2">
                This variant is out of stock
              </p>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={handleMoveToCart}
                disabled={!selectedSize || !selectedColor || isOutOfStock}
                className={`px-4 py-2 rounded text-white w-full ${
                  !selectedSize || !selectedColor
                    ? "bg-bg-muted cursor-not-allowed"
                    : isOutOfStock
                    ? "bg-danger cursor-not-allowed"
                    : "bg-primary hover:bg-primary-hover"
                }`}
              >
                {isOutOfStock ? "Out of Stock" : "Move to Bag"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
