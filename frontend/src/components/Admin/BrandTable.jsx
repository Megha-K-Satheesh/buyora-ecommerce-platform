import { memo } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import TableLoader from "../ui/TableLoader";

const BrandTable = memo(({ loading, tableData, onEdit, onDelete, total }) => {
  {console.log(tableData)}
  return (
  
    <div className="mx-20 mt-10 rounded-t-xl shadow-xl overflow-hidden">
      <table className="w-full border border-border border-collapse">
        <thead>
          <tr className="border text-white text-xl border-border-light h-15 bg-primary hover:bg-bg-soft-hover hover:text-text-primary">
            <th className="p-2 text-center">Brand Name</th>
            <th className="p-2 text-center">Categories</th>
            <th className="p-2 text-center">Visible</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
            {loading && <TableLoader rows={5} columns={4} />}

          {!loading && tableData.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4 text-text-secondary">
                No brands found
              </td>
            </tr>
          )}

          {!loading &&
            tableData.map((brand) => (
              <tr
                key={brand._id}
                className="hover:bg-bg-soft bg-bg-main border border-border-light"
              >
                <td className="p-3 text-center text-text-primary">
                  {brand.name}
                </td>

                <td className="p-3 text-center text-text-secondary">
                  {brand.categories?.map((c) => c.name).join(", ")}
                </td>

                <td className="p-3 text-center text-text-secondary">
                  {brand.isActive ? "Yes" : "Hidden"}
                </td>

                <td className="p-3 text-center">
                  <div className="flex justify-around">
                    <FiEdit
                      className="cursor-pointer hover:text-primary"
                      size={20}
                      onClick={() => onEdit(brand._id)}
                    />
                    <FiTrash2
                      className="cursor-pointer text-danger hover:text-danger-hover"
                      size={20}
                      onClick={() => onDelete(brand._id)}
                    />
                  </div>
                </td>
              </tr>
            ))}

          <tr>
            <td colSpan="4" className="text-right p-2 text-text-primary">
              <strong>Total: {total}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default BrandTable;
