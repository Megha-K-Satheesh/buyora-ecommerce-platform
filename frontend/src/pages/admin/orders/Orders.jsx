


import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminOutletHead from "../../../components/Admin/AdminOutletHead";
import OrdersTable from "../../../components/Admin/OrderTable";
import Pagination from "../../../components/ui/Pagination";
import SearchInput from "../../../components/ui/SearchInput";

import { showError, showSuccess } from "../../../components/ui/Toastify";
import {
  approveReturn,
  getAllAdminOrders,
  rejectReturn,
  setCurrentPage,
  updateOrderItemStatus,
} from "../../../Redux/slices/admin/adminOrderSlice";

const Orders = () => {
  const dispatch = useDispatch();


  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");


  const {
    allOrders: tableData,
    loading,
    currentPage,
    totalPages,
    totalOrders,
  } = useSelector((state) => state.adminOrder);
console.log(tableData)

  useEffect(() => {
    dispatch(setCurrentPage(1));
  }, [search, status, dispatch]);

 
  useEffect(() => {
    dispatch(
      getAllAdminOrders({
        page: Number(currentPage),
        limit: 5,
        search,
        status,
      })
    );
  }, [dispatch, currentPage, search, status]);


  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);
  const handlePageChange = (page) => dispatch(setCurrentPage(Number(page)));

 

const handleConfirm = async (orderId, productId) => {
  try {
    await dispatch(
      updateOrderItemStatus({ orderId, productId, status: "CONFIRMED" })
    ).unwrap();
   
   dispatch(
      getAllAdminOrders({
        page: Number(currentPage),
        limit: 5,
        search,
        status,
      })
    );
   
    showSuccess("Order confirmed successfully");
  } catch (error) {
    showError(error.message || "Failed to confirm order");
  }
};

const handleShip = async (orderId, productId) => {
  try {
    await dispatch(
      updateOrderItemStatus({ orderId, productId, status: "SHIPPED" })
    ).unwrap();


    dispatch(
      getAllAdminOrders({
        page: Number(currentPage),
        limit: 5,
        search,
        status,
      })
    );
   
    showSuccess("Order shipped successfully");
  } catch (error) {
    showError(error.message || "Failed to ship order");
  }
};


 const handleDeliver = async (orderId, productId) => {
  try {
    await dispatch(
      updateOrderItemStatus({ orderId, productId, status: "DELIVERED" })
    ).unwrap();
   
    dispatch(
      getAllAdminOrders({
        page: Number(currentPage),
        limit: 5,
        search,
        status,
      })
    );
  
    showSuccess("Order delivered successfully");
  } catch (error) {
    showError(error.message || "Failed to deliver order");
  }
};

 const handleApproveReturn = async (orderId, productId) => {
  try {
    await dispatch(approveReturn({ orderId, productId })).unwrap();

     dispatch(
      getAllAdminOrders({
        page: Number(currentPage),
        limit: 5,
        search,
        status,
      })
    );

    showSuccess("Return approved and refund processed");
  } catch (error) {
    showError(error.message || "Failed to approve return");
  }
};
  const handleRejectReturn = async (orderId, productId) => {
  try {
    await dispatch(rejectReturn({ orderId, productId })).unwrap();
 dispatch(
      getAllAdminOrders({
        page: Number(currentPage),
        limit: 5,
        search,
        status,
      })
    );
    showSuccess("Return request rejected");
  } catch (error) {
    showError(error.message || "Failed to reject return");
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
          className="bg-white shadow px-3 py-2 rounded-lg w-[200px] font-medium"
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

      {/* Orders Table */}
      <OrdersTable
        loading={loading}
        tableData={tableData}
        total={totalOrders}
        onConfirm={handleConfirm}
        onShip={handleShip}
        onDeliver={handleDeliver}
        onApproveReturn={handleApproveReturn}
        onRejectReturn={handleRejectReturn}
      />

      {/* Pagination */}
      <div className="my-10">
        <Pagination
          totalPages={totalPages}
          currentPage={Number(currentPage)}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default Orders;
