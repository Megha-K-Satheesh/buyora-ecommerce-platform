import { memo } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const BannersTable = memo(({ loading, tableData=[], total, onEdit, onDelete }) => {
  return (
    <div className="mx-20 mt-10 rounded-t-xl shadow-xl overflow-hidden">
      <table className="w-full border border-gray-200 border-collapse">
        <thead>
          <tr className="border text-white text-xl border-gray-200 h-15 bg-pink-600 hover:bg-pink-100 hover:text-black">
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
                No banners found
              </td>
            </tr>
          )}

          {!loading &&
            tableData.map((banner) => (
              <tr key={banner._id} className="hover:bg-pink-50 bg-white border border-gray-200">
                <td className="p-2 text-center">{banner.title}</td>
                <td className="p-2 text-center">{banner.type}</td>
                <td className="p-2 text-center">{banner.page}</td>
                <td className="p-2 text-center">{banner.section}</td>
                <td className="p-2 text-center">{banner.order}</td>
                <td className="p-2 text-center">{banner.isActive ? "Yes" : "No"}</td>
                <td className="p-2 text-center">{banner.isVisible ? "Yes" : "No"}</td>
                <td className="p-2 text-center">
                  <div className="flex justify-around">
                    <FiEdit
                      className="cursor-pointer hover:text-pink-600"
                      size={20}
                      onClick={() => onEdit(banner._id)}
                    />
                    <FiTrash2
                      className="cursor-pointer text-red-500 hover:text-red-700"
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
