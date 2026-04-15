


import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  clearAdminOrderState,
  getAdminSingleOrder
} from "../../../Redux/slices/admin/adminOrderSlice";
import AdminOutletHead from "../../../components/Admin/AdminOutletHead";

const AdminOrderView = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singleOrder, loading, error } = useSelector(
    (state) => state.adminOrder
  );

  useEffect(() => {
    dispatch(getAdminSingleOrder(orderId));

    return () => {
      dispatch(clearAdminOrderState());
    };
  }, [dispatch, orderId]);

  if (loading) return <p className="text-center mt-10">Loading order...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!singleOrder) return null;

  const {
    items,
    shippingAddress,
    orderStatus,
    paymentStatus,
    totalAmount,
    orderNumber,
    userId
  } = singleOrder;

  return (
    <>
        <AdminOutletHead heading={"ORDERS"} />
    <div className="max-w-5xl mx-auto p-6 mt-10">

   
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Order #{orderNumber}</h2>

        <div className="flex flex-wrap gap-6 text-sm mt-2">
          <span>
            Status: <span className="font-semibold">{orderStatus}</span>
          </span>
          <span>
            Payment: <span className="font-semibold">{paymentStatus}</span>
          </span>
          <span>
            Customer:{" "}
            <span className="font-semibold">
              {userId?.name} ({userId?.email})
            </span>
          </span>
        </div>
      </div>

    
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variantId}`}
            className="flex bg-white rounded-xl shadow p-4"
          >
            <img
              src={item.productId?.images?.[0] || "/placeholder.png"}
              alt={item.name}
              className="w-28 h-auto object-cover rounded-md"
            />

            <div className="ml-5 flex-1">
              <h4 className="font-semibold">{item.name}</h4>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              <p className="text-sm">Price: ₹{item.price}</p>
              <p className="text-sm font-medium">
                Total: ₹{item.price * item.quantity}
              </p>

              <p className="text-sm mt-1">
                Item Status:{" "}
                <span className="font-semibold">{item.status}</span>
              </p>

             
              <div className="mt-2">
                {item.status === "DELIVERED" && (
                  <span className="text-green-600 text-sm font-medium">
                    Delivered
                  </span>
                )}
                {item.status === "CANCELLED" && (
                  <span className="text-red-500 text-sm font-medium">
                    Cancelled
                  </span>
                )}
                {item.status === "RETURN_REQUESTED" && (
                  <span className="text-yellow-600 text-sm font-medium">
                    Return Requested
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

   
      <div className="grid md:grid-cols-2 gap-6 mb-6">

      
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Order Summary</h3>
          <p>Total Amount: ₹{totalAmount}</p>
          <p>Status: {orderStatus}</p>
          <p>Payment: {paymentStatus}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Shipping Address</h3>

          {shippingAddress ? (
            <>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.addressLine}, {shippingAddress.city}
              </p>
              <p>
                {shippingAddress.state} - {shippingAddress.postalCode}
              </p>
              <p>Phone: {shippingAddress.phone}</p>
            </>
          ) : (
            <p>No address available</p>
          )}
        </div>
      </div>

   
      <div className="text-center">
        <button
          onClick={() => navigate("/admin-dashboard/orders")}
          className="px-5 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
        >
          Back to Orders
        </button>
      </div>
    </div>
    </>
  );
};

export default AdminOrderView;
