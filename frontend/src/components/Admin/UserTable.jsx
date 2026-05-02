import { memo } from "react";
import { Link } from "react-router-dom";
import TableLoader from "../ui/TableLoader";
const UsersTable = memo(({ loading, tableData, total, onBan, onUnban }) => {
  return (
    <div className="mx-20 mt-10 rounded-t-xl shadow-xl overflow-hidden">
      <table className="w-full border border-border-light border-collapse">
        <thead>
          <tr className="border text-white text-xl border-border-light h-15 bg-primary hover:bg-bg-soft-hover hover:text-text-primary">
            <th className="p-2 text-center">User ID</th>
            <th className="p-2 text-center">Name</th>
            <th className="p-2 text-center">Email</th>
            <th className="p-2 text-center">Status</th>
            <th className="p-2 text-center">Role</th>
            <th className="p-2 text-center">Actions</th>
            <th className="p-2 text-center">User Messages</th>
          </tr>
        </thead>

        <tbody>
            {loading && <TableLoader rows={5} columns={8} />}

          {!loading && tableData.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center p-4">
                No users found
              </td>
            </tr>
          )}

          {!loading &&
            tableData.map((user) => (
              <tr key={user._id} className="hover:bg-bg-soft bg-bg-main border border-border-light">
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
      className="px-3 py-0.5 bg-danger text-white rounded hover:bg-danger"
    >
      Ban
    </button>
  ) : (
    <button
      onClick={() => onUnban(user._id)}
      className="px-3 py-0.5 bg-success text-white rounded hover:bg-success-hover"
    >
      Unban
    </button>
  )}
</div>
                </td>

                <td className="p-2 text-center">
  <Link
      to={`chat/${user._id}`}
    className="text-primary hover:text-primary-hover hover:underline"
  >
   VIEW MESSAGE
  </Link>
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
