
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import AdminOutletHead from "../../../components/Admin/AdminOutletHead";
import OrdersTable from "../../../components/Admin/OrderTable";
import Pagination from "../../../components/ui/Pagination";
import SearchInput from "../../../components/ui/SearchInput";

import { showError, showSuccess } from "../../../components/ui/Toastify";
import { useDebounce } from "../../../hook/useDebounce";

import {
  approveReturn,
  getAllAdminOrders,
  rejectReturn,
  setCurrentPage,
  updateOrderItemStatus,
} from "../../../Redux/slices/admin/adminOrderSlice";

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const debouncedSearch = useDebounce(search, 400);

  const {
    allOrders: tableData,
    loading,
    currentPage,
    totalPages,
    totalOrders,
  } = useSelector((state) => state.adminOrder);

 
  useEffect(() => {
    dispatch(
      getAllAdminOrders({
        page: currentPage,
        limit: 5,
        search: debouncedSearch,
        status,
      })
    );
  }, [dispatch, currentPage, debouncedSearch, status]);



  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    dispatch(setCurrentPage(1));
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    dispatch(setCurrentPage(1));
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(Number(page)));
  };



  const handleConfirm = async (orderId, productId, variantId) => {
    try {
      await dispatch(
        updateOrderItemStatus({
          orderId,
          productId,
          variantId,
          status: "CONFIRMED",
        })
      ).unwrap();

      dispatch(
        getAllAdminOrders({
          page: currentPage,
          limit: 5,
          search: debouncedSearch,
          status,
        })
      );

      showSuccess("Order confirmed successfully");
    } catch (error) {
      showError(error.message || "Failed to confirm order");
    }
  };

  const handleShip = async (orderId, productId, variantId) => {
    try {
      await dispatch(
        updateOrderItemStatus({
          orderId,
          productId,
          variantId,
          status: "SHIPPED",
        })
      ).unwrap();

      dispatch(
        getAllAdminOrders({
          page: currentPage,
          limit: 5,
          search: debouncedSearch,
          status,
        })
      );

      showSuccess("Order shipped successfully");
    } catch (error) {
      showError(error.message || "Failed to ship order");
    }
  };

  const handleDeliver = async (orderId, productId, variantId) => {
    try {
      await dispatch(
        updateOrderItemStatus({
          orderId,
          productId,
          variantId,
          status: "DELIVERED",
        })
      ).unwrap();

      dispatch(
        getAllAdminOrders({
          page: currentPage,
          limit: 5,
          search: debouncedSearch,
          status,
        })
      );

      showSuccess("Order delivered successfully");
    } catch (error) {
      showError(error.message || "Failed to deliver order");
    }
  };

  const handleApproveReturn = async (orderId, productId, variantId) => {
    try {
      await dispatch(
        approveReturn({ orderId, productId, variantId })
      ).unwrap();

      dispatch(
        getAllAdminOrders({
          page: currentPage,
          limit: 5,
          search: debouncedSearch,
          status,
        })
      );

      showSuccess("Return approved successfully");
    } catch (error) {
      showError(error.message || "Failed to approve return");
    }
  };

  const handleRejectReturn = async (orderId, productId, variantId) => {
    try {
      await dispatch(
        rejectReturn({ orderId, productId, variantId })
      ).unwrap();

      dispatch(
        getAllAdminOrders({
          page: currentPage,
          limit: 5,
          search: debouncedSearch,
          status,
        })
      );

      showSuccess("Return rejected successfully");
    } catch (error) {
      showError(error.message || "Failed to reject return");
    }
  };

  const handleMarkReturned = async (orderId, productId, variantId) => {
    try {
      await dispatch(
        updateOrderItemStatus({
          orderId,
          productId,
          variantId,
          status: "RETURNED",
        })
      ).unwrap();

      dispatch(
        getAllAdminOrders({
          page: currentPage,
          limit: 5,
          search: debouncedSearch,
          status,
        })
      );

      showSuccess("Product marked as returned");
    } catch (error) {
      showError(error.message || "Failed to mark return");
    }
  };

 

  return (
    <>
      <AdminOutletHead heading={"ORDERS"} />

      <div className="flex ml-20 gap-5 mt-10">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Search Order..."
          />
        </div>

        <select
          value={status}
          onChange={handleStatusChange}
          className="bg-bg-main shadow px-3 py-2 rounded-lg w-[200px] font-medium"
        >
          <option value="">All Status</option>
          <option value="PLACED">Placed</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="RETURN_REQUESTED">Return Requested</option>
          <option value="RETURN_APPROVED">Return Approved</option>
          <option value="RETURN_REJECTED">Return Rejected</option>
          <option value="RETURNED">Returned</option>
        </select>
      </div>

      <OrdersTable
        loading={loading}
        tableData={tableData}
        total={totalOrders}
        onConfirm={handleConfirm}
        onShip={handleShip}
        onDeliver={handleDeliver}
        onApproveReturn={handleApproveReturn}
        onRejectReturn={handleRejectReturn}
        onMarkReturned={handleMarkReturned}
        onView={(orderId) =>
          navigate(`/admin-dashboard/orders/${orderId}`)
        }
      />

      <div className="my-10">
        {!loading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default Orders;
