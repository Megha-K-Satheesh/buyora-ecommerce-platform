import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/ui/Button";

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { lastOrder } = useSelector((state) => state.checkout);

  if (!lastOrder || lastOrder._id !== orderId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold">
          Order details not found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg w-full text-center">
        
        <div className="text-green-600 text-5xl mb-4">✔</div>

        <h1 className="text-2xl font-bold mb-2">
          Payment Successful!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase.
        </p>

        <div className="text-left space-y-2 mb-6">
          <p><strong>Order Number:</strong> {lastOrder.orderNumber}</p>
          <p><strong>Total Amount:</strong> ₹{lastOrder.totalAmount}</p>
          <p><strong>Payment Status:</strong> {lastOrder.paymentStatus}</p>
          <p><strong>Order Status:</strong> {lastOrder.orderStatus}</p>
        </div>

       <div className="space-y-2">
  <Button
    onClick={() => navigate("/orders")}
    className="w-full"
  >
    View My Orders
  </Button>

  <Button
    onClick={() => navigate("/")}
    variant="secondary"
    className="w-full"
  >
    Continue Shopping
  </Button>
</div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
