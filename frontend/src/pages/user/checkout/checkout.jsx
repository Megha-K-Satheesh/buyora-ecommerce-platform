
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getOrderSummary,
  placeOrder,
  verifyPayment,
} from "../../../Redux/slices/checkoutSlice";
import { getAddresses } from "../../../Redux/slices/userSlice";
import Button from "../../../components/ui/Button";
import { openRazorpay } from "../../../utils/razorpay";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { addresses, loading: addressLoading } = useSelector(
    (state) => state.user
  );

  const {
    items,
    subtotal,
    totalDiscount,
    discountAmount,
    finalAmount,
    loading: checkoutLoading,
  } = useSelector((state) => state.checkout);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // Fetch data
  useEffect(() => {
    dispatch(getAddresses());
    dispatch(getOrderSummary());
  }, [dispatch]);


  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddress = addresses.find(
        (addr) => addr.isDefault === true
      );

      if (defaultAddress) {
        setSelectedAddress(defaultAddress._id);
      } else {
        // fallback to first address
        setSelectedAddress(addresses[0]._id);
      }
    }
  }, [addresses]);

const handlePlaceOrder = async () => {
  if (!selectedAddress) {
    alert("Please select address");
    return;
  }

  try {
    const res = await dispatch(
      placeOrder({
        addressId: selectedAddress,
        paymentMethod,
      })
    ).unwrap();

   
    if (!res.paymentRequired) {
      navigate(`/order-success/${res.order._id}`);
      return;
    }

  
    openRazorpay(
      {
      data: res,
      dispatch,
      verifyPayment,
      navigate,
      selectedAddress,
      addresses,
    }
    );

  } catch (err) {
    alert(err);
  }
};

  return (
    <div className="max-w-7xl mx-auto p-6 grid lg:grid-cols-3 gap-8">
      {/* LEFT SECTION */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* ADDRESS SECTION */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              Select Delivery Address
            </h2>

            <Button
              variant="text"
              onClick={() =>
                navigate("/account/address/add-address")
              }
              className="text-violet-600"
            >
              + Add Address
            </Button>
          </div>

          {addressLoading ? (
            <p>Loading...</p>
          ) : addresses.length === 0 ? (
            <div className="text-center py-6">
              <p className="mb-3 text-gray-500">
                No address found
              </p>
              <Button
                onClick={() =>
                  navigate("/account/address/add-address")
                }
              >
                Add Address
              </Button>
            </div>
          ) : (
            addresses.map((addr) => (
              <label
                key={addr._id}
                className={`block border p-4 rounded mb-3 cursor-pointer transition ${
                  selectedAddress === addr._id
                    ? "border-pink-600 bg-pink-50"
                    : "border-gray-300"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <input
                      type="radio"
                      name="address"
                      value={addr._id}
                      checked={selectedAddress === addr._id}
                      onChange={() =>
                        setSelectedAddress(addr._id)
                      }
                      className="mr-2"
                    />

                    <span className="font-semibold">
                      {addr.fullName} ({addr.label})
                    </span>

                    {addr.isDefault && (
                      <span className="ml-2 text-xs bg-black text-white px-2 py-1 rounded">
                        Default
                      </span>
                    )}

                    <p className="text-sm text-gray-600 mt-1">
                      {addr.houseNumber}, {addr.addressLine},{" "}
                      {addr.city} - {addr.pinCode}
                    </p>
                    <p className="text-sm text-gray-600">
                      {addr.state}
                    </p>
                    <p className="text-sm text-gray-600">
                      Mobile: {addr.phone}
                    </p>
                  </div>
                </div>
              </label>
            ))
          )}
        </div>

        {/* PAYMENT SECTION */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            Choose Payment Method
          </h2>

          <div className="space-y-4">
            <label
              className={`block border p-4 rounded cursor-pointer ${
                paymentMethod === "COD"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
                className="mr-2"
              />
              Cash On Delivery
            </label>

            <label
              className={`block border p-4 rounded cursor-pointer ${
                paymentMethod === "ONLINE"
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                value="ONLINE"
                checked={paymentMethod === "ONLINE"}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
                className="mr-2"
              />
              Online Payment (UPI / Card / NetBanking)
            </label>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="bg-white shadow rounded-lg p-6 h-fit sticky top-6">
        <h2 className="text-lg font-bold mb-4">
          Price Details
        </h2>

        {checkoutLoading ? (
          <p>Loading summary...</p>
        ) : (
          <>
            {items.map((item) => (
              <div
                key={item.variationId}
                className="flex justify-between mb-2 text-sm"
              >
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}

            <hr className="my-4" />

            <div className="flex justify-between text-sm">
              <span>Total MRP</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between text-green-600 text-sm">
              <span>Product Discount</span>
              <span>-₹{totalDiscount}</span>
            </div>

            <div className="flex justify-between text-green-600 text-sm">
              <span>Coupon Discount</span>
              <span>-₹{discountAmount}</span>
            </div>

            <div className="flex justify-between font-bold text-lg mt-4">
              <span>Total Amount</span>
              <span>₹{finalAmount}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="mt-6 w-full bg-pink-600 text-white py-3 rounded font-semibold hover:bg-pink-700 transition"
            >
              Place Order
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
