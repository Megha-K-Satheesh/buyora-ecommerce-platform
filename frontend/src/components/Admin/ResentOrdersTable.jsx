
const RecentOrdersTable = ({ orders }) => {
  return (
    <div className="bg-bg-main p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-text-primary">
          Recent Orders
        </h2>
      </div>

      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
              <th className="py-3 text-left">Order</th>
              <th className="py-3 text-left">Customer</th>
              <th className="py-3 text-left">Amount</th>
              <th className="py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>

            {orders?.map((order, index) => (

              <tr
                key={order.orderId}
                className={`border-b border-border hover:bg-bg-soft-hover transition ${
                  index % 2 === 0 ? "bg-bg-main" : "bg-bg-muted"
                }`}
              >

                <td className="py-4 font-medium text-text-secondary">
                  {order.orderNumber}
                </td>

                <td className="font-medium text-text-secondary">
                  {order.customer}
                </td>

                <td className="font-semibold text-success">
                  ₹{order.amount}
                </td>

                <td className="font-semibold text-primary">
                  {order.status}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default RecentOrdersTable;
