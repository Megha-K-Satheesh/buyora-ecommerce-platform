


import { memo } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import TableLoader from "../ui/TableLoader";

const CategoryTable = memo(({
  loading,
  tableData,
  total,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="mx-20 mt-10 rounded-t-xl shadow-xl overflow-hidden">
      <table className="w-full border border-border border-collapse">
        <thead>
          <tr className="border border-border-light text-white text-xl h-15 bg-primary hover:bg-bg-soft-hover hover:text-text-primary">
            <th className="p-2 text-center">Category</th>
            <th className="p-2 text-center">Parent</th>
            <th className="p-2 text-center">Level</th>
            <th className="p-2 text-center">Active</th>
            <th className="p-2 text-center">Visible</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
             {loading && <TableLoader rows={5} columns={6} />}

          {!loading && tableData.length === 0 && (
            <tr className="border border-border-light">
              <td colSpan="6" className="text-center p-4 text-text-secondary">
                No categories found
              </td>
            </tr>
          )}

          {!loading &&
            tableData.map((cat) => (
              <tr
                key={cat._id}
                className="hover:bg-bg-soft bg-bg-main border border-border-light"
              >
                <td className="p-3 text-center text-text-primary">
                  {cat.name}
                </td>

                <td className="p-2 text-center text-text-secondary">
                  {cat.parentId?.name || "Top Level"}
                </td>

                <td className="p-2 text-center text-text-secondary">
                  Level {cat.level}
                </td>

                <td className="p-2 text-center text-text-secondary">
                  {cat.status === "active" ? "Active" : "Inactive"}
                </td>

                <td className="p-2 text-center text-text-secondary">
                  {cat.isVisible ? "Yes" : "No"}
                </td>

                <td className="p-2 text-center">
                  <div className="flex justify-around">
                    <FiEdit
                      className="cursor-pointer hover:text-primary"
                      size={20}
                      onClick={() => onEdit(cat._id)}
                    />
                    <FiTrash2
                      className="cursor-pointer text-danger hover:text-danger-hover"
                      size={20}
                      onClick={() => onDelete(cat._id)}
                    />
                  </div>
                </td>
              </tr>
            ))}

          <tr className="border border-border-light">
            <td colSpan="6" className="text-right p-2 text-text-primary">
              <strong>Total: {total}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default CategoryTable;
