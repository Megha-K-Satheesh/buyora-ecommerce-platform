



import { memo } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import TableLoader from "../ui/TableLoader";

const CouponsTable = memo(({ loading, tableData, onEdit, onDelete ,total}) => {
  return (
    <div className="mx-20 mt-10 rounded-t-xl shadow-xl overflow-hidden">
      <table className="w-full border border-border border-collapse">
        <thead>
          <tr className="border text-white text-xl border-border-light h-15 bg-primary hover:bg-bg-soft-hover hover:text-text-primary">
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
             {loading && <TableLoader rows={5} columns={8} />}

          {!loading && tableData.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center p-4 text-text-secondary">
                No coupons found
              </td>
            </tr>
          )}

          {!loading &&
            tableData.map((coupon) => (
              <tr
                key={coupon._id}
                className="hover:bg-bg-soft bg-bg-main border border-border-light"
              >
                <td className="p-3 text-center text-text-primary">{coupon.code}</td>

                <td className="p-3 text-center text-text-secondary">
                  {coupon.description}
                </td>

                <td className="p-3 text-center text-text-secondary">
                  {coupon.discount.type === "FLAT"
                    ? `₹${coupon.discount.value}`
                    : `${coupon.discount.value}%`}
                  {coupon.discount.type === "PERCENTAGE" &&
                    coupon.discount.maxDiscount &&
                    ` (Max ₹${coupon.discount.maxDiscount})`}
                </td>

                <td className="p-3 text-center text-text-secondary">
                  {coupon.scope}
                </td>

                <td className="p-3 text-center text-text-secondary">
                  {coupon.isActive ? "Active" : "Inactive"}
                </td>

                <td className="p-3 text-center text-text-secondary">
                  {new Date(coupon.validFrom).toLocaleDateString()}
                </td>

                <td className="p-3 text-center text-text-secondary">
                  {new Date(coupon.validTill).toLocaleDateString()}
                </td>

                <td className="p-3 text-center">
                  <div className="flex justify-around">
                    <FiEdit
                      className="cursor-pointer hover:text-primary"
                      size={20}
                      onClick={() => onEdit(coupon._id)}
                    />
                    <FiTrash2
                      className="cursor-pointer text-danger hover:text-danger-hover"
                      size={20}
                      onClick={() => onDelete(coupon._id)}
                    />
                  </div>
                </td>
              </tr>
            ))}

          <tr>
            <td colSpan="8" className="text-right p-2 text-text-primary">
              <strong>Total: {total}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default CouponsTable;
