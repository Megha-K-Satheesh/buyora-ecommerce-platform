

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearCoupon,
  getCartBackend,
  mergeCart,
  removeCouponBackend,
  removeFromCart,
  setCart,
  updateCartQuantity,
  verifyCoupon
} from "../../Redux/slices/cartSlice";
import Navbar from "../../components/ui/Navbar";



const CartPage = () => {
  const dispatch = useDispatch();
 const navigate = useNavigate();


  const { isAuthenticated } = useSelector((state) => state.auth);

 


  const {
  cartItems,
  appliedCoupon,
  discountAmount,
  finalAmount,
  loading,
  error,
  isApplied
} = useSelector((state) => state.cart);

  const [couponCode, setCouponCode] = useState("");
  useEffect(() => {
  if (appliedCoupon) {
    setCouponCode(appliedCoupon|| "");
  }
}, [appliedCoupon]);
 console.log(appliedCoupon,couponCode)

  useEffect(() => {
    const guestCart = JSON.parse(localStorage.getItem("cart")) || [];

    if (isAuthenticated) {
      if (guestCart.length) {
        dispatch(mergeCart());
        localStorage.removeItem("cart");
      } else {
        dispatch(getCartBackend());
      }
    } else {
      dispatch(setCart(guestCart));
    }
  }, [dispatch, isAuthenticated]);

  const handleRemove = (variationId) => {
    dispatch(removeFromCart(variationId));
    if(!isAuthenticated){

      dispatch(clearCoupon()); 
    }
   
  };

  const handleQuantityChange = (variationId, quantity) => {
    if (quantity < 1) return;

    dispatch(updateCartQuantity({ variationId, quantity }));
    if(!isAuthenticated){

      dispatch(clearCoupon()); 
    }
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;

    dispatch(
      verifyCoupon({
        code: couponCode,
        cartItems,
        cartTotal: totalMRP - totalDiscount
      })
    );
  };

  const totalMRP = cartItems.reduce(
    (acc, item) => acc + item.mrp * item.quantity,
    0
  );

  const totalDiscount = cartItems.reduce(
    (acc, item) =>
      acc + (item.mrp - item.price) * item.quantity,
    0
  );

  const platformFee = 0;


  const totalPayable = isAuthenticated
  ? finalAmount + platformFee
  : totalMRP - totalDiscount - discountAmount + platformFee;

  if (cartItems.length === 0)
    return (
       <>
       <Navbar/>
      <h2 className="text-center mt-50">
        Your Cart is Empty
      </h2>
       </>
    );

  return (

    <>
<Navbar/>
  
    <div className="max-w-4xl mx-auto p-6 mt-25">
      <h1 className="text-2xl font-bold mb-6">
        Shopping Cart
      </h1>

      {cartItems.map((item) => (
        <div
          key={item.variationId.toString()}
          className="flex items-center justify-between border-b py-4"
        >
          <div className="flex items-center gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="lg:w-30 w-25 h-auto object-cover"
            />
            <div>
              <h2 className="font-semibold text-xl">
                {item.brandName}
              </h2>
              <h2 className="text-gray-600">
                {item.name}
              </h2>
              <p>Size: {item.size}</p>
              <p>Color: {item.color}</p>

              <div className="flex items-center gap-2 mt-2">
                <button
                  className="px-2 py-1 border rounded hover:border-pink-600"
                  onClick={() =>
                    handleQuantityChange(
                      item.variationId,
                      item.quantity - 1
                    )
                  }
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  className="px-2 py-1 border rounded hover:border-pink-600"
                  onClick={() =>
                    handleQuantityChange(
                      item.variationId,
                      item.quantity + 1
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="font-semibold">
              ₹{item.price * item.quantity}
            </div>

            <button
              className="mt-2 text-pink-500 hover:underline"
              onClick={() =>
                handleRemove(item.variationId)
              }
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="mt-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">
          Order Summary
        </h2>

        <div className="flex justify-between">
          <span>Total MRP:</span>
          <span>₹{totalMRP}</span>
        </div>

        <div className="flex justify-between">
          <span>Discount:</span>
          <span>-₹{totalDiscount}</span>
        </div>

        <div className="flex justify-between">
          <span>Coupon Discount:</span>
          <span>-₹{discountAmount}</span>
        </div>

        <div className="flex justify-between">
          <span>Platform Fee:</span>
          <span>₹{platformFee}</span>
        </div>

        <div className="flex justify-between font-bold text-lg mt-2">
          <span>Total Payable:</span>
          <span>₹{totalPayable}</span>
        </div>
         
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Enter coupon code"
            className="border border-pink-600 p-2 rounded flex-1"
            value={couponCode}
            onChange={(e) =>
              setCouponCode(e.target.value)
            }
          />

          <button
            className="border border-pink-600 px-4 py-2 rounded"
            onClick={handleApplyCoupon}
            disabled={loading}
          >
            {loading ? "Applying..." : "Apply"}
          </button>
        </div>

        {error && (
          <p className="text-red-500 mt-2">
            {error}
          </p>
        )}

{isApplied && (
  <div className="flex justify-between items-center mt-2">
    <p className="text-green-600 font-semibold">
      Coupon Applied Successfully
    </p>

    <button
      onClick={() => {
        if (isAuthenticated) {
          dispatch(removeCouponBackend());
        } else {
          dispatch(clearCoupon());
        }

        setCouponCode("");
      }}
      className="text-sm text-red-500 underline"
    >
      Remove
    </button>
  </div>
)}

<button
  onClick={() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/product/checkout" } });
    } else {
      navigate("/product/checkout")
    }
  }}
  className="mt-4 w-full bg-pink-600 text-white py-3 rounded font-bold"
>
  Proceed to Checkout
</button>
      </div>
    </div>
    </>
  );
};

export default CartPage;

