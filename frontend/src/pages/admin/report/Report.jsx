





import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminOutletHead from "../../../components/Admin/AdminOutletHead";
import SalesReportTable from "../../../components/Admin/SalesReportTable";
import Button from "../../../components/ui/Button";
import Pagination from "../../../components/ui/Pagination";
import SearchInput from "../../../components/ui/SearchInput";
import { showError, showSuccess } from "../../../components/ui/Toastify";
import { getCategory } from "../../../Redux/slices/admin/categorySlice";
import { getSalesReport, setPage } from "../../../Redux/slices/admin/salesSlice";
import { adminSalesReportService } from "../../../services/salesReportService";

const SalesReportPage = () => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { report, totalQuantity, totalRevenue, currentPage, totalPages, loading } =
    useSelector((state) => state.sales);

  const { categories } = useSelector((state) => state.category);

  const buildCategoryOptions = (cats, prefix = "") => {
    return cats.flatMap((cat) => {
      if (!cat || !cat._id) return [];
      return [
        <option key={cat._id} value={cat._id}>
          {prefix + cat.name}
        </option>,
        ...(cat.children ? buildCategoryOptions(cat.children, prefix + " └─ ") : []),
      ];
    });
  };

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getSalesReport({
        page: currentPage,
        limit: 10,
        search,
        status,
        paymentStatus,
        startDate,
        endDate,
        categoryId: selectedCategory,
      })
    );
  }, [dispatch, currentPage, search, status, paymentStatus, startDate, endDate, selectedCategory]);

  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  const handleExport = async (type) => {
    try {
      const filters = {
        status,
        paymentStatus,
        startDate,
        endDate,
        search,
        category: selectedCategory,
        fileType: type
      };

      const res = await adminSalesReportService.exportSalesReportPDF(filters);

      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        type === "excel" ? "Sales_Report.xlsx" : "Sales_Report.pdf"
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showSuccess(`Exporting ${type.toUpperCase()} file`);
    } catch (err) {
      console.error(err);
      showError("Failed to export report");
    }
  };

  return (
    <>
      <AdminOutletHead heading={"SALES REPORT"} />

      <div className="flex justify-end mr-20 mt-10 gap-3">
        <Button onClick={() => handleExport("excel")}>Export Excel</Button>
        <Button onClick={() => handleExport("pdf")}>Export PDF</Button>
      </div>

      <div className="flex ml-20 gap-5 mt-10">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Product or Order ID..."
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-3 py-2 rounded-lg shadow-sm bg-white w-[10%]"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-3 py-2 rounded-lg shadow-sm bg-white w-[10%]"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-lg shadow-sm bg-white w-[15%]"
        >
          <option value="">All Categories</option>
          {buildCategoryOptions(categories)}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 rounded-lg shadow-sm bg-white w-[15%]"
        >
          <option value="">All Order Status</option>
          <option value="PENDING">Pending</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="px-3 py-2 rounded-lg shadow-sm bg-white w-[15%]"
        >
          <option value="">All Payment Status</option>
          <option value="PAID">Paid</option>
          <option value="UNPAID">Unpaid</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>

      <SalesReportTable loading={loading} tableData={report} />

      <div className="my-10">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      <div className="flex justify-end mr-20 gap-10 font-bold text-lg">
        <div>Total Quantity: {totalQuantity}</div>
        <div>Total Revenue: ₹{totalRevenue}</div>
      </div>
    </>
  );
};

export default SalesReportPage;
