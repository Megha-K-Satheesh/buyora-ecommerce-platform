


import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../../../components/ui/Button";
import { getSingleOrder } from "../../../Redux/slices/orderSlice";

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { singleOrder, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getSingleOrder(orderId));
  }, [dispatch, orderId]);

  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading order...
      </div>
    );
  }

  if (!singleOrder) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Order not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-6">

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-xl w-full text-center"
      >

        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center text-4xl">
            ✓
          </div>
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Order Confirmed!
        </h1>

        <p className="text-gray-500 mb-6">
          Your payment was successful and your order has been placed.
        </p>

        {/* Order Info */}
        <div className="bg-gray-50 rounded-xl p-6 text-left space-y-3 mb-6 ">

          <div className="flex justify-between">
            <span>Order Number</span>
            <span className="font-semibold">
              {singleOrder.orderNumber}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Total Amount</span>
            <span className="font-semibold">
              ₹{singleOrder.totalAmount}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Payment Status</span>
            <span className="text-green-600 font-semibold">
              {singleOrder.paymentStatus}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Order Status</span>
            <span className="text-blue-600 font-semibold">
              {singleOrder.orderStatus}
            </span>
          </div>

        </div>

        {/* Message
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6 text-sm">
           Your order is being prepared and will be shipped soon.
        </div> */}

        {/* Buttons */}
        <div className="flex flex-col gap-3">
{/* 
          <Button
            onClick={() => navigate(`/order/${singleOrder.orderId}`)}
            className="w-full"
          >
            Track Order
          </Button> */}

          <Button
            onClick={() => navigate("/all-orders")}
            variant="primary"
            className="w-full"
          >
            View My Orders
          </Button>

          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="w-full"
          >
            Continue Shopping
          </Button>

        </div>

      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
