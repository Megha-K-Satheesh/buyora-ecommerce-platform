import { memo } from "react";

const SalesReportTable = memo(({ loading, tableData }) => {
  return (
    <div className="mx-20 mt-10 rounded-t-xl shadow-xl overflow-hidden">
      <table className="w-full border border-gray-200 border-collapse">
        <thead>
          <tr className="border text-white text-xl border-gray-200 h-15 bg-pink-600 hover:bg-pink-100 hover:text-black">
            <th className="p-2 text-center">Order ID</th>
            <th className="p-2 text-center">Order Date</th>
            <th className="p-2 text-center">Product Name</th>
            <th className="p-2 text-center">Category</th>
            <th className="p-2 text-center">Brand</th>
            <th className="p-2 text-center">Quantity</th>
            <th className="p-2 text-center">Price</th>
            <th className="p-2 text-center">Order Status</th>
            <th className="p-2 text-center">Payment Status</th>
            <th className="p-2 text-center">Total Revenue</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan="10" className="text-center p-4">
                Loading...
              </td>
            </tr>
          )}

          {!loading && tableData.length === 0 && (
            <tr>
              <td colSpan="10" className="text-center p-4">
                No sales found
              </td>
            </tr>
          )}

          {!loading &&
            tableData.map((item,index) => (
              <tr key={`${item.orderId}-${index}`} className="hover:bg-pink-50 bg-white border border-gray-200">
                <td className="p-2 text-center">{item.orderId}</td>
                <td className="p-2 text-center">{new Date(item.orderDate).toLocaleDateString()}</td>
                <td className="p-2 text-center">{item.productName}</td>
                <td className="p-2 text-center">{item.category || "N/A"}</td>
                <td className="p-2 text-center">{item.brand || "N/A"}</td>
                <td className="p-2 text-center">{item.quantity}</td>
                <td className="p-2 text-center">₹{item.price}</td>
                <td className="p-2 text-center">{item.orderStatus}</td>
                <td className="p-2 text-center">{item.paymentStatus}</td>
                <td className="p-2 text-center">₹{item.totalRevenue}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
});

export default SalesReportTable;
