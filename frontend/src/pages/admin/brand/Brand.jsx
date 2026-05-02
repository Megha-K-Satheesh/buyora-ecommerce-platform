import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import AdminOutletHead from "../../../components/Admin/AdminOutletHead";
import BrandTable from "../../../components/Admin/BrandTable";
import Button from "../../../components/ui/Button";
import Pagination from "../../../components/ui/Pagination";
import SearchInput from "../../../components/ui/SearchInput";

import {
  deleteBrand,
  getAllBrands,
  setCurrentPage,
} from "../../../Redux/slices/admin/brandSlice";

import { showError, showSuccess } from "../../../components/ui/Toastify";
import { useDebounce } from "../../../hook/useDebounce";

const Brand = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const { brands, loading, currentPage, totalPages, totalBrands } =
    useSelector((state) => state.brand);

  const handleAdd = () => {
    navigate("/admin-dashboard/brands/add-brand");
  };

  const handleDelete = async (brandId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this brand?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteBrand(brandId)).unwrap();
        showSuccess("Brand deleted successfully");

        dispatch(
          getAllBrands({
            page: currentPage,
            limit: 10,
            search: debouncedSearch,
          })
        );
      } catch (err) {
        showError(err);
      }
    }
  };

  useEffect(() => {
    dispatch(
      getAllBrands({
        page: currentPage,
        limit: 10,
        search: debouncedSearch,
      })
    );
  }, [dispatch, currentPage, debouncedSearch]);

  useEffect(() => {
    dispatch(setCurrentPage(1));
  }, [search, dispatch]);

  const handlePageChange = (page) => {
    dispatch(
      getAllBrands({
        page,
        limit: 10,
        search: debouncedSearch,
      })
    );
  };

  return (
    <>
      <AdminOutletHead heading="BRANDS" />

      <div className="flex justify-end mr-20 mt-10">
        <Button onClick={handleAdd}>ADD BRAND</Button>
      </div>

      <div className="flex ml-20 mt-10">
        <div className="w-[80%]">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Brand..."
          />
        </div>
      </div>

      <BrandTable
        loading={loading}
        tableData={brands}
        total={totalBrands}
        onEdit={(brandId) =>
          navigate(`/admin-dashboard/brands/update-brand/${brandId}`)
        }
        onDelete={(brandId) => handleDelete(brandId)}
      />

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

export default Brand;
