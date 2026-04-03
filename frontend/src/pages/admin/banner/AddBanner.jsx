import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import AdminOutletHead from "../../../components/Admin/AdminOutletHead";
import ProductImageUpload from "../../../components/Admin/ProductImageUpload";
import Button from "../../../components/ui/Button";
import FormInput from "../../../components/ui/FormInput";

import { showError, showSuccess } from "../../../components/ui/Toastify";
import { addBanner } from "../../../Redux/slices/admin/adminBannerSlice";

const AddBanner = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const { loading } = useSelector((state) => state.banner);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (files.length === 0) {
      showError("Banner image is required");
      return;
    }

    try {
      const formData = new FormData();

      const payload = {
        title: data.title,
        subtitle: data.subtitle,
        type: data.type,
        page: data.page,
        section: data.section,
        redirectType: data.redirectType,
        redirectValue: data.redirectValue,
        discountText: data.discountText,
        isActive: data.isActive === "true",
        isVisible: true,
        order: data.order || 0,
      };

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      formData.append("image", files[0]);

      await dispatch(addBanner(formData)).unwrap();

      showSuccess("Banner Added");
       navigate("/admin-dashboard/banners");
    } catch (err) {
      showError(err);
    }
  };

  return (
    <>
      <AdminOutletHead heading={"BANNERS"} />

      <div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-pink-50 to-white py-10">
        <div className="bg-white shadow-xl rounded-3xl lg:w-[40%] w-[95%] px-6 py-8 border border-gray-100">

          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Add Banner
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <FormInput
              label="Title"
              {...register("title", { required: "Title required" })}
              error={errors.title?.message}
            />

            <FormInput
              label="Subtitle"
              {...register("subtitle")}
            />

            {/* TYPE */}
            <div className="flex flex-col gap-1 pb-3">
              <label className="text-sm md:text-lg text-gray-900">Type</label>
              <select
                {...register("type", { required: true })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 lg:h-11 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Select</option>
                <option value="hero">Hero</option>
                <option value="promo">Promo</option>
                <option value="category">Category</option>
                <option value="offer">Offer</option>
              </select>
            </div>

            {/* PAGE */}
            <div className="flex flex-col gap-1 pb-3">
              <label className="text-sm md:text-lg text-gray-900">Page</label>
              <select
                {...register("page", { required: true })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 lg:h-11 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Select</option>
                <option value="home">Home</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
              </select>
            </div>

            {/* SECTION */}
            <div className="flex flex-col gap-1 pb-3">
              <label className="text-sm md:text-lg text-gray-900">Section</label>
              <select
                {...register("section", { required: true })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 lg:h-11 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Select</option>
                <option value="home_top">Home Top</option>
                <option value="home_trending">Trending</option>
                <option value="home_slider">Slider</option>
              </select>
            </div>

            {/* REDIRECT TYPE */}
            <div className="flex flex-col gap-1 pb-3">
              <label className="text-sm md:text-lg text-gray-900">Redirect Type</label>
              <select
                {...register("redirectType")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 lg:h-11 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="url">URL</option>
                <option value="category">Category</option>
                <option value="product">Product</option>
              </select>
            </div>

            <FormInput
              label="Redirect Value"
              {...register("redirectValue")}
            />

            <FormInput
              label="Discount"
              {...register("discountText")}
            />

            <FormInput
              label="Order"
              type="number"
              {...register("order")}
            />

            {/* STATUS */}
            <div className="flex flex-col gap-1 pb-3">
              <label className="text-sm md:text-lg text-gray-900">Status</label>
              <select
                {...register("isActive")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 lg:h-11 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* IMAGE */}
            <ProductImageUpload
              files={files}
              setFiles={setFiles}
              max={1}
            />

            <Button type="submit" className="w-full mt-4">
              {loading ? "Adding..." : "Add Banner"}
            </Button>

          </form>
        </div>
      </div>
    </>
  );
};

export default AddBanner;
