

import { memo } from "react";

const OrdersTable = memo(
  ({
    loading,
    tableData,
    total,
    onConfirm,
    onShip,
    onDeliver,
    onApproveReturn,
    onRejectReturn,
  }) => {
    return (
      <div className="mx-20 mt-10 rounded-t-xl shadow-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-white text-xl h-15 bg-pink-600">
              <th className="p-2 text-center border-b border-gray-200">Order ID</th>
              <th className="p-2 text-center border-b border-gray-200">Product</th>
              {/* <th className="p-2 text-center border-b border-gray-200">Category</th> */}
              <th className="p-2 text-center border-b border-gray-200">Price</th>
              <th className="p-2 text-center border-b border-gray-200">Quantity</th>
              <th className="p-2 text-center border-b border-gray-200">Total</th>
              <th className="p-2 text-center border-b border-gray-200">Payment</th>
              <th className="p-2 text-center border-b border-gray-200">Status</th>
              <th className="p-2 text-center border-b border-gray-200">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="9" className="text-center p-4">Loading...</td>
              </tr>
            )}

            {!loading && tableData.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center p-4">No orders found</td>
              </tr>
            )}

            {!loading &&
              tableData.map((order) =>
                order.items.map((item) => (
                  <tr
                    key={`${order.orderId}-${item.productId._id}`}
                    className="hover:bg-pink-50 bg-white"
                  >
                    {/* Repeat Order ID for each item */}
                    <td className="p-2 text-center font-semibold">{order.orderNumber}</td>

                    <td className="p-2 py-4 text-center">{item.name}</td>
                    {/* <td className="p-2 text-center">{item.categoryName || "N/A"}</td> */}
                    <td className="p-2 text-center">₹{item.price} / ₹{item.mrp}</td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2 text-center">₹{item.price * item.quantity}</td>
                    <td className="p-2 text-center font-medium">{order.paymentStatus}</td>
                    <td className="p-2 text-center">{item.status}</td>

                    <td className="p-2 text-center">
                      <div className="flex justify-center gap-3 flex-wrap">
                        {item.status === "PLACED" && (
                          <button
                            onClick={() => onConfirm(order.orderId, item.productId._id)}
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                          >
                            Confirm
                          </button>
                        )}
                         {item.status === "CONFIRMED" && (
                              <button
                      onClick={() => onShip(order.orderId, item.productId._id)}
                     className="bg-yellow-500 text-white px-3 py-1 rounded"
                                      >
                                      Ship
                               </button>
                          )}

                        {item.status === "SHIPPED" && (
                          <button
                            onClick={() => onDeliver(order.orderId, item.productId._id)}
                            className="bg-green-500 text-white px-2 py-1 rounded"
                          >
                            Deliver
                          </button>
                        )}

                        {item.status === "RETURN_REQUESTED" && (
                          <>
                            <button
                              onClick={() => onApproveReturn(order.orderId, item.productId._id)}
                              className="bg-green-600 text-white px-2 py-1 rounded"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => onRejectReturn(order.orderId, item.productId._id)}
                              className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {item.status === "RETURN_APPROVED" && (
      <span className="text-green-700 font-semibold">
        Return Approved
      </span>
    )}

    {item.status === "RETURN_REJECTED" && (
      <span className="text-red-600 font-semibold">
        Return Rejected
      </span>
    )}

                        {item.status === "DELIVERED" && (
  <span className="text-green-600 font-semibold">
    Completed
  </span>
)}
                      </div>
                    </td>
                  </tr>
                ))
              )}

            <tr>
              <td colSpan="9" className="text-right p-2">
                <strong>Total Orders: {total}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
);

export default OrdersTable;
