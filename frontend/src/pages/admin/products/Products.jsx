// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import AdminOutletHead from "../../../components/Admin/AdminOutletHead";
// import ProductsTable from "../../../components/Admin/ProductsTable";
// import Button from "../../../components/ui/Button";
// import Pagination from "../../../components/ui/Pagination";
// import SearchInput from "../../../components/ui/SearchInput";
// import { showError, showSuccess } from "../../../components/ui/Toastify";
// import { deleteProduct, getProductsList, setCurrentPage } from "../../../Redux/slices/admin/productSlice";


// const Products = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [search, setSearch] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [priceSort, setPriceSort] = useState("");

//   const { products: tableData, loading, currentPage, totalPages, totalProducts } =
//     useSelector((state) => state.product);

//   const handleAdd = () => {
//     navigate("/admin-dashboard/products/add-product");
//   };

//   const handleEdit = (id) => {
//     navigate(`/admin-dashboard/products/update-product/${id}`);
//   };

 
//   const handleDelete = async (id) => {
//   const result = await Swal.fire({
//     title: "Are you sure?",
//     text: "Do you really want to delete this product?",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonText: "Yes, delete it!",
//     cancelButtonText: "Cancel",
//     reverseButtons: true,
//   });

//   if (result.isConfirmed) {
//     try {
//       await dispatch(deleteProduct(id)).unwrap();

//       showSuccess("Product deleted successfully");

//       dispatch(
//         getProductsList({
//           page: currentPage,
//           limit: 10,
//           search,
//           category: categoryFilter,
//           status: statusFilter,
//           priceSort,
//         })
//       );

//     } catch (err) {
//       showError(err);
//     }
//   }
// };


//   const handlePageChange = (page) => {
//     dispatch(getProductsList({
//       page,limit:10,search,categoryFilter,statusFilter,priceSort

//     }));
//   };

// useEffect(() => {
//   dispatch(
//     getProductsList({
//       page: currentPage,
//       limit: 10,
//       search,
//       category: categoryFilter,
//       status: statusFilter,
//       priceSort,
//     })
//   );
// }, [dispatch, currentPage, search, categoryFilter, statusFilter, priceSort]);

// useEffect(() => {
//   dispatch(setCurrentPage(1));
// }, [dispatch, search, categoryFilter, statusFilter, priceSort]);

//   return (
//     <>
//       <AdminOutletHead heading={"PRODUCTS"} />

//       <div className="flex justify-end mr-20 mt-10">
//         <Button onClick={handleAdd}>ADD PRODUCT</Button>
//       </div>

//       <div className="flex ml-20 gap-5 mt-10">
//         <div className="flex-1">
//           <SearchInput
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search Product ..."
//           />
//         </div>

//         <div className="flex-2 flex gap-7">
//           <select
//             value={categoryFilter}
//             onChange={(e) => setCategoryFilter(e.target.value)}
//             className="px-3 py-2 rounded-lg shadow-sm bg-white w-[25%] font-medium"
//           >
//             <option value="">All Categories</option>
//           </select>

//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="bg-white shadow px-3 py-2 rounded-lg w-[25%] font-medium"
//           >
//             <option value="">All Status</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select>

//           <select
//             value={priceSort}
//             onChange={(e) => setPriceSort(e.target.value)}
//             className="bg-white shadow px-3 py-2 rounded-lg w-[25%] font-medium"
//           >
//             <option value="">Sort by Price</option>
//             <option value="lowToHigh">Low to High</option>
//             <option value="highToLow">High to Low</option>
//           </select>
//         </div>
//       </div>

//       <ProductsTable
//         loading={loading}
//         tableData={tableData}
//         total={totalProducts}
//         onEdit={handleEdit}
//         onDelete={handleDelete}
//       />

//       <div className="my-10">
//         <Pagination
//           totalPages={totalPages}
//           currentPage={currentPage}
//           onPageChange={handlePageChange}
//         />
//       </div>
//     </>
//   );
// };

// export default Products;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AdminOutletHead from "../../../components/Admin/AdminOutletHead";
import Button from "../../../components/ui/Button";
import Pagination from "../../../components/ui/Pagination";
import SearchInput from "../../../components/ui/SearchInput";
import { showError, showSuccess } from "../../../components/ui/Toastify";

import ProductsTable from "../../../components/Admin/ProductsTable";
import { getCategory } from "../../../Redux/slices/admin/categorySlice";
import {
  deleteProduct,
  getProductsList,
  setCurrentPage,
} from "../../../Redux/slices/admin/productSlice";

const Products = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { products: tableData, loading, currentPage, totalPages, totalProducts } =
    useSelector((state) => state.product);

  const { categories } = useSelector((state) => state.category); // load categories from Redux

  // Recursive function to build category options hierarchically
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

  // Navigate to Add Product Page
  const handleAdd = () => {
    navigate("/admin-dashboard/products/add-product");
  };

  // Edit Product
  const handleEdit = (id) => {
    navigate(`/admin-dashboard/products/update-product/${id}`);
  };

  // Delete Product
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        showSuccess("Product deleted successfully");

        dispatch(
          getProductsList({
            page: currentPage,
            limit: 10,
            search,
            status,
            category: selectedCategory,
          })
        );
      } catch (err) {
        showError(err);
      }
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    dispatch(
      getProductsList({
        page,
        limit: 10,
        search,
        status,
        category: selectedCategory,
      })
    );
  };
  useEffect(()=>{
         dispatch(getCategory())
  },[dispatch,selectedCategory])

  // Fetch products when filters/search/page changes
  useEffect(() => {
    dispatch(
      getProductsList({
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

  return (
    <>
      <AdminOutletHead heading={"PRODUCTS"} />

      <div className="flex justify-end mr-20 mt-10">
        <Button onClick={handleAdd}>ADD PRODUCT</Button>
      </div>

      <div className="flex ml-20 gap-5 mt-10">
        {/* Search */}
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Product..."
          />
        </div>

        {/* Filters */}
        <div className="flex-2 flex gap-5">
          {/* Category dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="  px-3 py-2 rounded-lg shadow-sm bg-white w-[25%] font-medium"
             
          >
            <option value="">All Categories</option>
            {buildCategoryOptions(categories)}
          </select>

          {/* Status dropdown */}
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

      {/* Products Table */}
      <ProductsTable
        loading={loading}
        tableData={tableData}
        total={totalProducts}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination */}
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

export default Products;

