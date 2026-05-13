
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import AdminOutletHead from "../../../components/Admin/AdminOutletHead";
import Pagination from "../../../components/ui/Pagination";
import { showError, showSuccess } from "../../../components/ui/Toastify";


import { banUser, getUsersList, setCurrentPage, unbanUser } from "../../../Redux/slices/admin/adminUserSlice";
import UsersTable from "../../../components/Admin/UserTable";
import SearchInput from "../../../components/ui/SearchInput";
import { useDebounce } from "../../../hook/useDebounce";


const Users = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 400);
  const [status, setStatus] = useState("");

  const { users: tableData, loading, currentPage, totalPages, totalUsers } =
    useSelector((state) => state.adminUser);

  const handleBan = async (userId) => {
    const { value: reason } = await Swal.fire({
      title: "Ban User",
      input: "text",
      inputLabel: "Reason for ban",
      inputPlaceholder: "Enter reason...",
      showCancelButton: true,
    });

    if (reason !== undefined) {
      try {
        await dispatch(banUser({ userId, reason })).unwrap();
        showSuccess("User banned successfully");
        dispatch(
          getUsersList({ page: currentPage, limit: 10, search, status })
        );
      } catch (err) {
        showError(err);
      }
    }
  };



  const handleUnban = async (userId) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to unban this user?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, unban",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    try {
      await dispatch(unbanUser(userId)).unwrap();
      showSuccess("User unbanned successfully");
      dispatch(getUsersList({ page: currentPage, limit: 10, search, status }));
    } catch (err) {
      showError(err);
    }
  }
};

  const handlePageChange = (page) => {
    dispatch(getUsersList({ page, limit: 10, search, status }));
  };

  useEffect(() => {
    dispatch(setCurrentPage(1));
  }, [search, status, dispatch]);

  useEffect(() => {
    dispatch(getUsersList({ page: currentPage, limit: 10, search:debouncedSearch, status }));
  }, [dispatch, currentPage, debouncedSearch, status]);






  return (
    <>
      <AdminOutletHead heading="USERS" />

     
      


<div className="flex ml-20 mt-10 gap-5 items-center">
  {/* Search Input */}
  <div className="flex-1">
    <SearchInput
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search User..."
    />
  </div>

  {/* Status Dropdown */}
  <div className="w-1/4">
    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="bg-bg-main shadow px-3 py-2 rounded-lg w-60 font-medium"
    >
      <option value="">All Status</option>
      <option value="active">Active</option>
      <option value="banned">Banned</option>
    </select>
  </div>
</div>
      <UsersTable
        loading={loading}
        tableData={tableData}
        total={totalUsers}
        onBan={handleBan}
        onUnban={handleUnban}
      />

      <div className="my-10">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default Users;
