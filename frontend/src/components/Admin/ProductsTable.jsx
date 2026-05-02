import { memo } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import TableLoader from "../ui/TableLoader";

const ProductsTable = memo(({ loading, tableData, total, onEdit, onDelete }) => {
  return (
    <div className="mx-20 mt-10 rounded-t-xl shadow-xl overflow-hidden">
      <table className="w-full border border-border-light border-collapse">
        <thead>
          <tr className="border text-white text-xl border-border-light h-15 bg-primary hover:bg-bg-soft-hover hover:text-text-primary">
            <th className="p-2 text-center">Name</th>
            <th className="p-2 text-center">Category</th>
            <th className="p-2 text-center">Price</th>
            <th className="p-2 text-center">Total Stock</th>
            <th className="p-2 text-center">Variants</th>
            <th className="p-2 text-center">Status</th>
            <th className="p-2 text-center">Visible</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading && <TableLoader rows={5} columns={8} />}

          {!loading && tableData.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center p-4">
                No products found
              </td>
            </tr>
          )}

          {!loading &&
            tableData.map((product) => (
              <tr key={product._id} className="hover:bg-bg-soft bg-bg-main border border-border-light">
                <td className="p-2 text-center">{product.name}</td>
                <td className="p-2 text-center">{product.category?.name || "N/A"}</td>
                <td className="p-2 text-center">
                  ₹{product.sellingPrice} / ₹{product.mrp}
                </td>
                <td className="p-2 text-center">{product.totalStock}</td>
                <td className="p-2 text-center">{product.variations?.length || 0}</td>
                <td className="p-2 text-center">{product.status === "active" ? "Active" : "Inactive"}</td>
                <td className="p-2 text-center">{product.isVisible ? "Yes" : "No"}</td>
                <td className="p-2 text-center">
                  <div className="flex justify-around">
                    <FiEdit
                      className="cursor-pointer hover:text-primary"
                      size={20}
                      onClick={() => onEdit(product._id)}
                    />
                    <FiTrash2
                      className="cursor-pointer text-danger hover:text-danger-hover"
                      size={20}
                      onClick={() => onDelete(product._id)}
                    />
                  </div>
                </td>
              </tr>
            ))}

          <tr>
            <td colSpan="8" className="text-right p-2">
              <strong>Total: {total}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default ProductsTable;
