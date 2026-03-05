



import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { cancelOrderItem, clearOrderState, getSingleOrder, requestReturnItem } from "../../../Redux/slices/orderSlice";




const SingleOrderPage = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { singleOrder, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getSingleOrder(orderId));
    return () => dispatch(clearOrderState());
  }, [dispatch, orderId]);

  if (loading) return <p className="text-center mt-10">Loading order...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!singleOrder) return null;

  const { items, shippingAddress, orderStatus, paymentStatus, totalAmount } = singleOrder;

  const handleCancelItem = async (productId) => {
    const { value: reason } = await Swal.fire({
      title: "Cancel Order Item",
      input: "text",
      inputLabel: "Reason for cancellation (optional)",
      inputPlaceholder: "Enter reason...",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it",
    });
    if (reason !== undefined) {
      dispatch(cancelOrderItem({ orderId, productId }))
        .unwrap()
        .then(() => {
          Swal.fire("Cancelled!", "Your item has been cancelled.", "success");
          dispatch(getSingleOrder(orderId));
        })
        .catch((err) => {
          Swal.fire("Error!", err || "Failed to cancel item.", "error");
        });
    }
  };

  const handleReturnItem = async (productId) => {
    const { value: reason } = await Swal.fire({
      title: "Request Return",
      input: "text",
      inputLabel: "Reason for return (optional)",
      inputPlaceholder: "Enter reason...",
      showCancelButton: true,
      confirmButtonText: "Yes, request return",
    });
    if (reason !== undefined) {
      dispatch(requestReturnItem({ orderId, productId, reason }))
        .unwrap()
        .then(() => {
          Swal.fire("Requested!", "Return request submitted.", "success");
          dispatch(getSingleOrder(orderId));
        })
        .catch((err) => {
          Swal.fire("Error!", err || "Failed to request return.", "error");
        });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
   
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Order #{singleOrder.orderNumber}</h2>
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          <span>Status: <span className="font-semibold">{orderStatus}</span></span>
          <span>Payment: <span className="font-semibold">{paymentStatus}</span></span>
        </div>
      </div>

     
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variationId}`}
            className="flex flex-col md:flex-row bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4"
          >
            <img
              src={item.imageUrl?.[0] || "/placeholder.png"}
              alt={item.name}
              className={`w-28 h-28 object-cover rounded-md mb-3 md:mb-0 ${item.status === "CANCELLED" ? "opacity-50" : ""}`}
            />
            <div className="flex-1 md:ml-5 flex flex-col justify-between">
              <div>
                <h4 className={`font-semibold ${item.status === "CANCELLED" ? "line-through text-gray-400" : ""}`}>
                  {item.name}
                </h4>
                <p className={item.status === "CANCELLED" ? "text-gray-400" : ""}>Qty: {item.quantity}</p>
                <p className={`font-semibold mt-1 ${item.status === "CANCELLED" ? "text-gray-400" : ""}`}>
                  Price: ₹{item.price * item.quantity}
                </p>
                <p className="mt-1 text-sm text-gray-600">Status: {item.status}</p>
              </div>

              <div className="mt-2 flex gap-2 justify-end">
                {(item.status === "PLACED" || item.status === "CONFIRMED") && (
                  <button
                    onClick={() => handleCancelItem(item.productId)}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                {item.status === "DELIVERED" && (
                  <button
                    onClick={() => handleReturnItem(item.productId)}
                    className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Return
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

     
      <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-lg">Total Amount: ₹{totalAmount}</p>
          <p className="text-gray-600">Order Status: {orderStatus}</p>
          <p className="text-gray-600">Payment Status: {paymentStatus}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg flex-1 md:ml-6">
          <h3 className="font-semibold mb-1">Shipping Address</h3>
          <p>{shippingAddress.fullName}</p>
          <p>{shippingAddress.addressLine}, {shippingAddress.city} - {shippingAddress.postalCode}</p>
          <p>{shippingAddress.state}</p>
          <p>Phone: {shippingAddress.phone}</p>
        </div>
      </div>

  
      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/orders")}
          className="px-5 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          Back to All Orders
        </button>
      </div>
    </div>
  );
};

export default SingleOrderPage;
