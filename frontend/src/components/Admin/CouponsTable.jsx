import { memo } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const CouponsTable = memo(({ loading, tableData, onEdit, onDelete ,total}) => {
  return (
    <div className="mx-20 mt-10 rounded-t-xl shadow-xl overflow-hidden">
      <table className="w-full border border-gray-200 border-collapse">
        <thead>
          <tr className="border text-white text-xl border-gray-200 h-15 bg-pink-600 hover:bg-pink-100 hover:text-black">
            <th className="p-2 text-center">Code</th>
            <th className="p-2 text-center">Description</th>
            <th className="p-2 text-center">Discount</th>
            <th className="p-2 text-center">Scope</th>
            <th className="p-2 text-center">Active</th>
            <th className="p-2 text-center">Valid From</th>
            <th className="p-2 text-center">Valid Till</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan="8" className="text-center p-4">
                Loading...
              </td>
            </tr>
          )}

          {!loading && tableData.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center p-4">
                No coupons found
              </td>
            </tr>
          )}

          {!loading &&
            tableData.map((coupon) => (
              <tr
                key={coupon._id}
                className="hover:bg-pink-50 bg-white border border-gray-200"
              >
                <td className="p-3 text-center">{coupon.code}</td>
                <td className="p-3 text-center">{coupon.description}</td>

                <td className="p-3 text-center">
                  {coupon.discount.type === "FLAT"
                    ? `₹${coupon.discount.value}`
                    : `${coupon.discount.value}%`}
                  {coupon.discount.type === "PERCENTAGE" &&
                    coupon.discount.maxDiscount &&
                    ` (Max ₹${coupon.discount.maxDiscount})`}
                </td>

                <td className="p-3 text-center">{coupon.scope}</td>

                <td className="p-3 text-center">
                  {coupon.isActive ? "Active" : "Inactive"}
                </td>

                <td className="p-3 text-center">
                  {new Date(coupon.validFrom).toLocaleDateString()}
                </td>

                <td className="p-3 text-center">
                  {new Date(coupon.validTill).toLocaleDateString()}
                </td>

                <td className="p-3 text-center">
                  <div className="flex justify-around">
                    <FiEdit
                      className="cursor-pointer hover:text-pink-600"
                      size={20}
                      onClick={() => onEdit(coupon._id)}
                    />
                    <FiTrash2
                      className="cursor-pointer text-red-500 hover:text-red-700"
                      size={20}
                      onClick={() => onDelete(coupon._id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
            <tr>
            <td colSpan="6" className="text-right p-2">
              <strong>Total: {total}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default CouponsTable;
