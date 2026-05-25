


import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getOrderSummary,
  paymentFailed,
  placeOrder,
  verifyPayment,
} from "../../../Redux/slices/checkoutSlice";
import { getAddresses } from "../../../Redux/slices/userSlice";
import Button from "../../../components/ui/Button";
import Loader from "../../../components/ui/Loader";
import { showInfo } from "../../../components/ui/Toastify";
import { openRazorpay } from "../../../utils/razorpay";
const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { addresses, loading: addressLoading ,error} = useSelector(
    (state) => state.user
  );

  const {
    items,
    mrpSubtotal,
    subtotal,
    productDiscount,
    couponDiscount,
    finalAmount,
    loading: checkoutLoading,
  } = useSelector((state) => state.checkout);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    dispatch(getAddresses());
    dispatch(getOrderSummary());
  }, [dispatch]);

  useEffect(() => {
    if (!checkoutLoading && items.length === 0) {
      navigate("/product/cart");
    }
  }, [checkoutLoading, items, navigate]);

  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddress = addresses.find((addr) => addr.isDefault === true);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress._id);
      } else {
        setSelectedAddress(addresses[0]._id);
      }
    }
  }, [addresses]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      showInfo("Please select address");
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

      openRazorpay({
        data: res,
        dispatch,
        verifyPayment,
       paymentFailed,
        navigate,
        selectedAddress,
        addresses,
      });
    } catch (err) {
     
  showInfo(err || "Something went wrong");

    }
  };


  
  if (checkoutLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader />
    </div>
  );
}
  return (
    <div className="max-w-7xl mx-auto p-6 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-bg-main shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-text-primary">Select Delivery Address</h2>
            <Button
              variant="text"
              onClick={() => navigate("/account/address/add-address")}
              className="text-primary"
            >
              + Add Address
            </Button>
          </div>

          {addressLoading ? (
            <p>Loading...</p>
          ) : addresses.length === 0 ? (
            <div className="text-center py-6">
              <p className="mb-3 text-text-muted">No address found</p>
              <Button onClick={() => navigate("/account/address/add-address")}>
                Add Address
              </Button>
            </div>
          ) : (
            addresses.map((addr) => (
              <label
                key={addr._id}
                className={`block border p-4 rounded mb-3 cursor-pointer ${
                  selectedAddress === addr._id
                    ? "border-border-primary bg-bg-soft"
                    : "border-border"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <input
                      type="radio"
                      name="address"
                      value={addr._id}
                      checked={selectedAddress === addr._id}
                      onChange={() => setSelectedAddress(addr._id)}
                      className="mr-2"
                    />
                    <span className="font-semibold text-text-primary">
                      {addr.fullName} ({addr.label})
                    </span>
                    {addr.isDefault && (
                      <span className="ml-2 text-xs bg-text-primary text-white px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                    <p className="text-sm text-text-secondary mt-1">
                      {addr.houseNumber}, {addr.addressLine}, {addr.city} - {addr.pinCode}
                    </p>
                    <p className="text-sm text-text-secondary">{addr.state}</p>
                    <p className="text-sm text-text-secondary">Mobile: {addr.phone}</p>
                  </div>
                </div>
              </label>
            ))
          )}
        </div>

        <div className="bg-bg-main shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-text-primary">Choose Payment Method</h2>

          <div className="space-y-4">
            <label
              className={`block border p-4 rounded cursor-pointer ${
                paymentMethod === "COD"
                  ? "border-border-primary bg-bg-soft"
                  : "border-border"
              }`}
            >
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Cash On Delivery
            </label>

            <label
              className={`block border p-4 rounded cursor-pointer ${
                paymentMethod === "ONLINE"
                  ? "border-border-primary bg-bg-soft"
                  : "border-border"
              }`}
            >
              <input
                type="radio"
                value="ONLINE"
                checked={paymentMethod === "ONLINE"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Online Payment (UPI / Card / NetBanking)
            </label>

            <label
              className={`block border p-4 rounded cursor-pointer ${
                paymentMethod === "WALLET"
                  ? "border-border-primary bg-bg-soft"
                  : "border-border"
              }`}
            >
              <input
                type="radio"
                value="WALLET"
                checked={paymentMethod === "WALLET"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Wallet Payment
            </label>
          </div>
        </div>
      </div>

      <div className="bg-bg-main shadow rounded-lg p-6 h-fit sticky top-6">
        <h2 className="text-lg font-bold mb-4 text-text-primary">Price Details</h2>

        {checkoutLoading ? (
           <div></div>
        ) : (
          <>
            {items.map((item) => (
              <div key={item.variationId} className="flex justify-between mb-2 text-sm text-text-secondary">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}

            <hr className="my-4 border-border-light" />

            <div className="flex justify-between text-sm text-text-secondary">
              <span>Total MRP</span>
              <span>₹{mrpSubtotal}</span>
            </div>

            <div className="flex justify-between text-success text-sm">
              <span>Product Discount</span>
              <span>-₹{productDiscount}</span>
            </div>

            <div className="flex justify-between text-success text-sm">
              <span>Coupon Discount</span>
              <span>-₹{couponDiscount}</span>
            </div>

            <div className="flex justify-between font-bold text-lg mt-4 text-text-primary">
              <span>Total Amount</span>
              <span>₹{finalAmount}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="mt-6 w-full bg-primary text-white py-3 rounded font-semibold hover:bg-primary-hover transition"
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
