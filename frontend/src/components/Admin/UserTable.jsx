import { memo } from "react";

const UsersTable = memo(({ loading, tableData, total, onBan, onUnban }) => {
  return (
    <div className="mx-20 mt-10 rounded-t-xl shadow-xl overflow-hidden">
      <table className="w-full border border-gray-200 border-collapse">
        <thead>
          <tr className="border text-white text-xl border-gray-200 h-15 bg-pink-600 hover:bg-pink-100 hover:text-black">
            <th className="p-2 text-center">User ID</th>
            <th className="p-2 text-center">Name</th>
            <th className="p-2 text-center">Email</th>
            <th className="p-2 text-center">Status</th>
            <th className="p-2 text-center">Role</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan="6" className="text-center p-4">
                Loading...
              </td>
            </tr>
          )}

          {!loading && tableData.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center p-4">
                No users found
              </td>
            </tr>
          )}

          {!loading &&
            tableData.map((user) => (
              <tr key={user._id} className="hover:bg-pink-50 bg-white border border-gray-200">
                <td className="p-2 text-center">{user._id}</td>
                <td className="p-2 text-center">{user.name}</td>
                <td className="p-2 text-center">{user.email}</td>
                <td className="p-2 text-center">{user.status === "active" ? "Active" : "Banned"}</td>
                <td className="p-2 text-center">{user.role || "User"}</td>
                <td className="p-2 text-center">
                
                  <div className="flex justify-around gap-2">
  {user.status === "active" ? (
    <button
      onClick={() => onBan(user._id)}
      className="px-3 py-0.5 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Ban
    </button>
  ) : (
    <button
      onClick={() => onUnban(user._id)}
      className="px-3 py-0.5 bg-green-500 text-white rounded hover:bg-green-600"
    >
      Unban
    </button>
  )}
</div>
                </td>
              </tr>
            ))}

          <tr>
            <td colSpan="6" className="text-right p-2">
              <strong>Total Users: {total}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default UsersTable;
