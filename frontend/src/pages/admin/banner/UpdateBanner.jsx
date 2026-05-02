

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import AdminOutletHead from "../../../components/Admin/AdminOutletHead";
import ProductImageUpload from "../../../components/Admin/ProductImageUpload";
import Button from "../../../components/ui/Button";
import FormInput from "../../../components/ui/FormInput";

import { showError, showSuccess } from "../../../components/ui/Toastify";
import {
  getBannerById,
  updateBanner,
} from "../../../Redux/slices/admin/adminBannerSlice";

const EditBanner = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { banner, loading } = useSelector((state) => state.banner);

  const [files, setFiles] = useState([]);
  const [existingImage, setExistingImage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(getBannerById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (banner) {
      reset({
        title: banner.title,
        subtitle: banner.subtitle,
        type: banner.type,
        page: banner.page,
        section: banner.section,
        redirectType: banner.redirectType,
        redirectValue: banner.redirectValue,
        discountText: banner.discountText,
        isActive: banner.isActive ? "true" : "false",
        order: banner.order,
      });

      setExistingImage(banner.image);
    }
  }, [banner, reset]);

  const onSubmit = async (data) => {
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
        order: data.order || 0,
      };

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      if (files.length > 0) {
        formData.append("image", files[0]);
      }

      await dispatch(updateBanner({ id, formData })).unwrap();

      showSuccess("Banner Updated");
      navigate("/admin-dashboard/banners");
    } catch (err) {
      showError(err);
    }
  };

  return (
    <>
      <AdminOutletHead heading={"EDIT BANNER"} />

      <div className="flex justify-center items-start min-h-screen bg-bg-soft py-10">
        <div className="bg-bg-main shadow-xl rounded-3xl lg:w-[40%] w-[95%] px-6 py-8 border border-border-light">

          <h1 className="text-3xl font-semibold text-center text-text-primary mb-6">
            Edit Banner
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <FormInput
              label="Title"
              {...register("title", { required: "Title required" })}
              error={errors.title?.message}
            />

            <FormInput label="Subtitle" {...register("subtitle")} />

            <select
              {...register("type")}
              className="input bg-bg-main border border-border text-text-secondary focus:ring-primary"
            >
              <option value="hero">Hero</option>
              <option value="promo">Promo</option>
              <option value="category">Category</option>
              <option value="offer">Offer</option>
            </select>

            <select
              {...register("page")}
              className="input bg-bg-main border border-border text-text-secondary focus:ring-primary"
            >
              <option value="home">Home</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>

            <select
              {...register("section")}
              className="input bg-bg-main border border-border text-text-secondary focus:ring-primary"
            >
              <option value="home_top">Home Top</option>
              <option value="home_trending">Trending</option>
              <option value="home_slider">Slider</option>
            </select>

            <select
              {...register("redirectType")}
              className="input bg-bg-main border border-border text-text-secondary focus:ring-primary"
            >
              <option value="url">URL</option>
              <option value="category">Category</option>
              <option value="product">Product</option>
            </select>

            <FormInput label="Redirect Value" {...register("redirectValue")} />
            <FormInput label="Discount" {...register("discountText")} />
            <FormInput label="Order" type="number" {...register("order")} />

            <select
              {...register("isActive")}
              className="input bg-bg-main border border-border text-text-secondary focus:ring-primary"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            <ProductImageUpload
              files={files}
              setFiles={setFiles}
              existingImages={existingImage ? [existingImage] : []}
              setExistingImages={(imgs) => setExistingImage(imgs[0] || "")}
              max={1}
            />

            <Button type="submit" className="w-full mt-4">
              {loading ? "Updating..." : "Update Banner"}
            </Button>

          </form>
        </div>
      </div>
    </>
  );
};

export default EditBanner;
