import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminOutletHead from "../../../components/Admin/AdminOutletHead";
import Button from "../../../components/ui/Button";
import Pagination from "../../../components/ui/Pagination";
import SearchInput from "../../../components/ui/SearchInput";
import { getCategory } from "../../../Redux/slices/admin/categorySlice";
import { getCouponsList, setCurrentPage } from "../../../Redux/slices/admin/couponSlice";

import CouponsTable from "../../../components/Admin/CouponsTable";

const Coupons = () => {
  const dispatch = useDispatch();


  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

 
  const { coupons, loading, currentPage, totalPages, totalCoupons } = useSelector(
    (state) => state.coupon
  );
  const { categories } = useSelector((state) => state.category);

  // Build category options recursively
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

const handleClick = ()=>{

}


 
  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  
  useEffect(() => {
    dispatch(
      getCouponsList({
        page: currentPage,
        limit: 10,
        search,
        status,
        category: selectedCategory,
      })
    );
  }, [dispatch, currentPage, search, status, selectedCategory]);


  useEffect(() => {
    dispatch(setCurrentPage(1));
  }, [search, status, selectedCategory, dispatch]);


  const handlePageChange = (page) => {
    dispatch(
      getCouponsList({
        page,
        limit: 10,
        search,
        status,
        category: selectedCategory,
      })
    );
  };

  return (
    <>
      <AdminOutletHead heading="COUPONS" />
      <div className="flex justify-end mr-20 mt-10">
            <Button 
             onClick = {handleClick}
            >ADD CATEGORY</Button>
          </div>

      {/* Filters */}
      <div className="flex ml-20 gap-5 mt-10">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Coupon..."
          />
        </div>

        <div className="flex flex-2 gap-5">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-lg shadow-sm bg-white w-[25%] font-medium"
          >
            <option value="">All Categories</option>
            {buildCategoryOptions(categories)}
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-white shadow px-3 py-2 rounded-lg w-[25%] font-medium"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Coupons Table */}
      <CouponsTable
        loading={loading}
        tableData={coupons}
          total={totalCoupons}
        onEdit={() => {}}
        onDelete={() => {}}
      />

      {/* Pagination */}
      <div className="my-10 mx-20">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default Coupons;
