
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllOrders } from "../../../Redux/slices/orderSlice";

const AllOrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allOrders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!allOrders || allOrders.length === 0)
    return <p className="text-center mt-10">No orders found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      {allOrders.map((order) => {
        // Compute earliest expected delivery for multiple items
        const deliveryDates = order.items
          .filter((i) => i.status !== "CANCELLED")
          .map((i) => new Date(i.expectedDeliveryDate));
        const earliestDate =
          deliveryDates.length > 0
            ? new Date(Math.min(...deliveryDates))
            : null;

        return (
          <div
            key={order.orderId}
            className="rounded-xl p-5 mb-6 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
          >
            {/* Order Header */}
            <div className="flex justify-between items-center mb-4 flex-wrap">
              <p className="font-semibold text-lg">Order #{order.orderNumber}</p>
              <p className="text-sm mt-1 md:mt-0">
                {order.items.every((i) => i.status === "CANCELLED") ? (
                  <span className="font-medium text-red-600">Cancelled</span>
                ) : (
                  <span className="font-medium text-gray-600">
                    Expected Delivery on{" "}
                    {earliestDate &&
                      earliestDate.toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                  </span>
                )}
              </p>
            </div>

            {/* Items List */}
            <div className="flex flex-col gap-4 mb-4">
              {order.items.map((item) => (
                <div
                  key={`${item.productId}-${item.variationId}`}
                  className="flex items-center justify-between p-3 rounded hover:bg-gray-50 transition-colors duration-150"
                >
                  {/* Product Image */}
                  <img
                    src={item.imageUrl?.[0] || "/placeholder.png"}
                    alt={item.name}
                    className={`w-20 h-auto object-cover rounded ${
                      item.status === "CANCELLED" ? "opacity-50" : ""
                    }`}
                  />

                  {/* Product Details */}
                  <div className="flex-1 mx-4">
                    <p
                      className={`font-semibold ${
                        item.status === "CANCELLED" ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {item.name}
                    </p>
                    <p className={item.status === "CANCELLED" ? "text-gray-400" : ""}>
                      Price: ₹{item.price}
                    </p>
                    <p className={item.status === "CANCELLED" ? "text-gray-400" : ""}>
                      Qty: {item.quantity}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col items-end">
                    <span
                      className={`font-semibold ${
                        item.status === "CANCELLED" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total & View Details */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center  mt-4 gap-3">
              <p className="font-semibold text-lg">
                Total Amount: ₹{order.totalAmount}
              </p>
              <button
                onClick={() => navigate(`/orders/${order.orderId}`)}
                className="px-4 py-2 rounded-lg border border-pink-600 text-pink-600 font-semibold hover:bg-pink-50 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AllOrdersPage;
