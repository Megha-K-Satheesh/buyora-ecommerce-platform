


const RecentOrdersTable = ({ orders }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-800">
          Recent Orders
        </h2>
      </div>

      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b border-gray-300 text-gray-500 text-xs  uppercase tracking-wider">
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
                className={`border-b border-gray-300 hover:bg-gray-50 transition ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                }`}
              >

                <td className="py-4 font-medium text-gray-700">
                  {order.orderNumber}
                </td>

                <td className="font-medium text-gray-700">
                  {order.customer}
                </td>

                <td className="font-semibold text-green-600">
                  ₹{order.amount}
                </td>

                <td className="font-semibold text-pink-600">
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
