

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import AdminOutletHead from "../../../components/Admin/AdminOutletHead";
import BannersTable from "../../../components/Admin/BannerTable";
import Button from "../../../components/ui/Button";
import Pagination from "../../../components/ui/Pagination";

import { showError, showSuccess } from "../../../components/ui/Toastify";
import {
  deleteBanner,
  getBanners,
  setCurrentPage,
} from "../../../Redux/slices/admin/adminBannerSlice";

const Banners = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [pageFilter, setPageFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");

  const {
    banners,
    loading,
    totalPages,
    currentPage,
    totalBanners,
  } = useSelector((state) => state.banner);

  useEffect(() => {
    dispatch(
      getBanners({
        page: currentPage,
        limit: 10,
        pageType: pageFilter,
        section: sectionFilter,
      })
    );
  }, [dispatch, currentPage, pageFilter, sectionFilter]);

  const handleClick = () => {
    navigate("/admin-dashBoard/banners/add-banner");
  };


   const handleEdit = (id) => {
    navigate(`/admin-dashboard/banner/update-banner/${id}`);
  };
  
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this banner?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteBanner(id)).unwrap();
        showSuccess("Banner deleted successfully");
        dispatch(
          getBanners({
            page: currentPage,
            limit: 10,
            pageType: pageFilter,
            section: sectionFilter,
          })
        );
      } catch (err) {
        showError(err);
      }
    }
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  return (
    <>
      <AdminOutletHead heading={"BANNERS"} />

      <div className="flex justify-end mr-20 mt-10">
        <Button onClick={handleClick}>Add Banner</Button>
      </div>

      <div className="flex ml-20 gap-5 mt-10">
        <select
          value={pageFilter}
          onChange={(e) => {
            setPageFilter(e.target.value);
            dispatch(setCurrentPage(1));
          }}
          className="px-3 py-2 rounded-lg shadow-sm bg-white w-[25%] font-medium"
        >
          <option value="">All Pages</option>
          <option value="home">Home</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </select>

        <select
          value={sectionFilter}
          onChange={(e) => {
            setSectionFilter(e.target.value);
            dispatch(setCurrentPage(1));
          }}
          className="px-3 py-2 rounded-lg shadow-sm bg-white w-[25%] font-medium"
        >
          <option value="">All Sections</option>
          <option value="home_top">Home Top</option>
          <option value="home_slider">Home Slider</option>
          <option value="category_top">Category Top</option>
          <option value="category_slider">Category Slider</option>
        </select>
      </div>

      <BannersTable
        loading={loading}
        tableData={banners}
        total={totalBanners}
        onDelete={handleDelete}
        onEdit={handleEdit}
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

export default Banners;
