




import { memo } from "react";
import TableLoader from "../ui/TableLoader";

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
    onMarkReturned,
    onView
  }) => {
    return (
      <div className="mx-20 mt-10 rounded-t-xl shadow-xl overflow-hidden bg-bg-main">
        <table className="w-full border-b border-border border-collapse">
          <thead>
            <tr className="text-white text-xl border-b border-border h-15 bg-primary">
              <th className="p-2 text-center border-b border-border">Order ID</th>
              <th className="p-2 text-center border-b border-border-light">Product</th>
              <th className="p-2 text-center border-b border-border">Price</th>
              <th className="p-2 text-center border-b border-border-light">Quantity</th>
              <th className="p-2 text-center border-b border-border">Total</th>
              <th className="p-2 text-center border-b border-border-light">Payment</th>
              <th className="p-2 text-center border-b border-border-light">Status</th>
              <th className="p-2 text-center border-b border-border-light">Actions</th>
            </tr>
          </thead>

          <tbody>
              {loading && <TableLoader rows={5} columns={8} />}

            {!loading && tableData.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center p-4 text-text-muted">No orders found</td>
              </tr>
            )}

            {!loading &&
              tableData.map((order) =>
                order.items.map((item) => (
                  <tr
               
                    key={`${order._id}-${item.productId._id}-${item._id}`}
                
                    className="hover:bg-bg-soft-hover bg-bg-main"
                  >
                    <td className="p-2 text-center font-semibold text-text-secondary">
                      {order.orderNumber}
                    </td>

                    <td className="p-2 py-4 text-center text-text-secondary">
                      {item.name}
                    </td>

                    <td className="p-2 text-center text-text-secondary">
                      ₹{item.price} / ₹{item.mrp}
                    </td>

                    <td className="p-2 text-center text-text-secondary">
                      {item.quantity}
                    </td>

                    <td className="p-2 text-center text-text-secondary">
                      ₹{item.price * item.quantity}
                    </td>

                    <td className="p-2 text-center font-medium text-text-secondary">
                      {order.paymentStatus}
                    </td>

                    <td className="p-2 text-center text-text-secondary">
                      {item.status}
                    </td>

                    <td className="p-2 text-center">
                      <div className="flex justify-center gap-3 flex-wrap">

                        {item.status === "PLACED" && (
                          <button
                            onClick={() => onConfirm(order._id, item.productId._id, item.variantId)}
                            className="bg-primary text-white px-2 py-1 rounded hover:bg-primary-hover"
                          >
                            Confirm
                          </button>
                        )}

                        {item.status === "CONFIRMED" && (
                          <button
                            onClick={() => onShip(order._id, item.productId._id, item.variantId)}
                            className="bg-warning text-white px-3 py-1 rounded hover:bg-warning-hover"
                          >
                            Ship
                          </button>
                        )}

                        {item.status === "SHIPPED" && (
                          <button
                            onClick={() => onDeliver(order._id, item.productId._id, item.variantId)}
                            className="bg-success text-white px-2 py-1 rounded"
                          >
                            Deliver
                          </button>
                        )}

                        {item.status === "RETURN_REQUESTED" && (
                          <>
                            <button
                              onClick={() => onApproveReturn(order._id, item.productId._id, item.variantId)}
                              className="bg-success text-white px-2 py-1 rounded"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => onRejectReturn(order._id, item.productId._id, item.variantId)}
                              className="bg-danger text-white px-2 py-1 rounded hover:bg-danger-hover"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {item.status === "RETURN_APPROVED" && (
                          <button
                            onClick={() =>
                              onMarkReturned(order._id, item.productId._id, item.variantId)
                            }
                            className="bg-primary text-white px-2 py-1 rounded"
                          >
                            Mark Returned
                          </button>
                        )}

                        {item.status === "RETURNED" && (
                          <span className="text-primary font-semibold">
                            Returned
                          </span>
                        )}

                        {item.status === "RETURN_REJECTED" && (
                          <span className="text-danger font-semibold">
                            Return Rejected
                          </span>
                        )}

                        {item.status === "DELIVERED" && (
                          <span className="text-success font-semibold">
                            Completed
                          </span>
                        )}

                        <div>
                          <button
                            onClick={() => onView(order._id)}
                            className="border-primary border-2 text-primary px-2 py-1 rounded hover:bg-bg-soft-hover"
                          >
                            View
                          </button>
                        </div>

                      </div>
                    </td>
                  </tr>
                ))
              )}

            <tr>
              <td colSpan="9" className="text-right p-2 text-text-secondary">
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
