






import { memo } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import TableLoader from "../ui/TableLoader";

const BannersTable = memo(({ loading, tableData = [], total, onEdit, onDelete }) => {
  return (
    <div className="mx-4 md:mx-10 lg:mx-20 mt-10 rounded-t-xl shadow-xl overflow-x-auto">
      <table className="w-full min-w-[700px] border border-border-light border-collapse">
        <thead>
          <tr className="border text-white text-xl border-border-light h-15 bg-primary hover:bg-bg-soft-hover hover:text-text-primary">
            <th className="p-2 text-center">Title</th>
            <th className="p-2 text-center">Type</th>
            <th className="p-2 text-center">Page</th>
            <th className="p-2 text-center">Section</th>
            <th className="p-2 text-center">Order</th>
            <th className="p-2 text-center">Active</th>
            <th className="p-2 text-center">Visible</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
             {loading && <TableLoader rows={5} columns={8} />}

          {!loading && tableData.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center p-4">
                No banners found
              </td>
            </tr>
          )}

          {!loading &&
            tableData.map((banner) => (
              <tr key={banner._id} className="hover:bg-bg-soft bg-bg-main border border-border-light">
                <td className="p-2 text-center whitespace-nowrap">{banner.title}</td>
                <td className="p-2 text-center whitespace-nowrap">{banner.type}</td>
                <td className="p-2 text-center whitespace-nowrap">{banner.page}</td>
                <td className="p-2 text-center whitespace-nowrap">{banner.section}</td>
                <td className="p-2 text-center whitespace-nowrap">{banner.order}</td>
                <td className="p-2 text-center whitespace-nowrap">{banner.isActive ? "Yes" : "No"}</td>
                <td className="p-2 text-center whitespace-nowrap">{banner.isVisible ? "Yes" : "No"}</td>
                <td className="p-2 text-center">
                  <div className="flex justify-around">
                    <FiEdit
                      className="cursor-pointer hover:text-primary"
                      size={20}
                      onClick={() => onEdit(banner._id)}
                    />
                    <FiTrash2
                      className="cursor-pointer text-danger hover:text-danger-hover"
                      size={20}
                      onClick={() => onDelete(banner._id)}
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

export default BannersTable;
