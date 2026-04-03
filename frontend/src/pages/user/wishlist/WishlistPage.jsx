


import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
     
  await dispatch(moveToCart({
  productId: selectedItem._id,
  variationId: selectedVariation._id,
  size: selectedSize,
  color: selectedColor,
  quantity: 1
}))
      showSuccess("Item moved to cart");
      closeModal();
    } catch (err) {
      showError(err || "Failed to move item to cart");
    }
  };

  const handleRemove = (item) => {
    dispatch(removeFromWishlist(item._id));
  };


  if (loading) return <p className="text-center mt-10">Loading wishlist...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (wishlist.length === 0)
    return <p className="text-center mt-10">Your wishlist is empty</p>;

  return (

    <>
   
    
    <div className="p-4 max-w-full  ">
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
          />
        ))}
      </div>

     
      {selectedItem && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 sm:w-96 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-600 hover:text-red-500 text-2xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4">{selectedItem.name}</h2>

        
            <div className="mb-4">
              <h3 className="font-medium mb-2">Select Size</h3>
              <div className="flex flex-wrap gap-2">
                {[...new Set(selectedItem.variations.map(v => v.attributes.Size))].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 border rounded ${
                      selectedSize === size
                        ? "border-pink-500 text-pink-500"
                        : "border-gray-300 text-gray-700"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

         
            <div className="mb-4">
              <h3 className="font-medium mb-2">Select Color</h3>
              <div className="flex flex-wrap gap-2">
                {[...new Set(selectedItem.variations.map(v => v.attributes.Color))].map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1 border rounded ${
                      selectedColor === color
                        ? "border-pink-500 text-pink-500"
                        : "border-gray-300 text-gray-700"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

         
            <div className="flex justify-end gap-2 mt-6">
             
              <button
              
                onClick={handleMoveToCart}
                disabled={!selectedSize || !selectedColor}
                className={`px-4 py-2 rounded text-white w-full ${
                  selectedSize && selectedColor
                    ? "bg-pink-600 hover:bg-pink-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Move to Bag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default WishlistPage;
