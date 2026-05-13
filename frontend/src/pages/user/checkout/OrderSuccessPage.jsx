


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


  if (!singleOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-soft text-text-muted">
        Order not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-soft flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-bg-soft via-bg-main/30 to-bg-soft" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-bg-main w-full max-w-2xl rounded-3xl shadow-2xl border border-bg-muted/40 p-6 md:p-10 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-success/20 blur-xl" />
            <div className="relative bg-success text-white w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-lg">
              ✓
            </div>
          </div>
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-bold text-text-secondary mb-2">
          Order Confirmed!
        </h1>

        <p className="text-text-muted mb-8 leading-relaxed">
          Your payment was successful and your order has been placed.
        </p>

        <div className="bg-bg-muted/60 rounded-2xl p-6 text-left space-y-4 mb-8 border border-bg-muted">
          <div className="flex justify-between items-center py-2 border-b border-bg-muted/50">
            <span className="text-text-muted">Order Number</span>
            <span className="font-semibold text-text-secondary">
              {singleOrder.orderNumber}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-bg-muted/50">
            <span className="text-text-muted">Total Amount</span>
            <span className="font-semibold text-text-secondary">
              ₹{singleOrder.totalAmount}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-bg-muted/50">
            <span className="text-text-muted">Payment Status</span>
            <span className="text-success font-semibold">
              {singleOrder.paymentStatus}
            </span>
          </div>

          <div className="flex justify-between items-center py-2">
            <span className="text-text-muted">Order Status</span>
            <span className="text-primary font-semibold">
              {singleOrder.orderStatus}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate("/all-orders")}
            variant="primary"
            className="w-full py-3 text-base font-semibold shadow-lg"
          >
            View My Orders
          </Button>

          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="w-full py-3 text-base font-medium"
          >
            Continue Shopping
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
