



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

const selectStyles = `
  w-full rounded-2xl border border-border bg-bg-main/80
  px-4 py-3 text-sm md:text-base text-text-secondary
  shadow-sm transition-all duration-200
  focus:outline-none focus:ring-4 focus:ring-primary/10
  focus:border-primary
  hover:border-primary/40
`;

const sectionCardStyles = `
  rounded-3xl border border-border-light bg-bg-main
  shadow-[0_10px_40px_rgba(0,0,0,0.04)]
  backdrop-blur-sm
`;

const sectionTitleStyles = `
  text-lg md:text-xl font-semibold text-text-primary
`;

const sectionDescStyles = `
  text-sm text-text-muted mt-1
`;

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

      <div className="min-h-screen bg-gradient-to-b from-bg-soft via-white to-bg-soft px-3 sm:px-5 lg:px-8 py-6 lg:py-10">
        <div className="mx-auto w-full max-w-7xl">

          <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
                Edit Banner
              </h1>

              <p className="mt-2 text-sm md:text-base text-text-muted max-w-2xl">
                Update banner content, redirect behavior, visibility settings,
                and promotional display configuration for your storefront.
              </p>
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <div className="rounded-2xl border border-border-light bg-bg-main px-4 py-3 shadow-sm">
                <p className="text-xs text-text-muted">Banner Status</p>
                <p className="text-sm font-semibold text-text-primary">
                  {banner?.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 xl:grid-cols-12 gap-6"
          >

            <div className="xl:col-span-8 space-y-6">

              <div className={`${sectionCardStyles} p-5 md:p-7`}>
                <div className="mb-6">
                  <h2 className={sectionTitleStyles}>Banner Details</h2>
                  <p className={sectionDescStyles}>
                    Update the main banner content and promotional messaging.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <FormInput
                    label="Banner Title"
                    placeholder="Summer Mega Sale"
                    {...register("title", {
                      required: "Title required",
                    })}
                    error={errors.title?.message}
                  />

                  <FormInput
                    label="Banner Subtitle"
                    placeholder="Exclusive discounts for limited time"
                    {...register("subtitle")}
                    error={errors.subtitle?.message}
                  />
                </div>
              </div>

              <div className={`${sectionCardStyles} p-5 md:p-7`}>
                <div className="mb-6">
                  <h2 className={sectionTitleStyles}>
                    Banner Configuration
                  </h2>

                  <p className={sectionDescStyles}>
                    Configure where and how this banner appears across the
                    storefront.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">
                      Banner Type
                    </label>

                    <select
                      {...register("type")}
                      className={selectStyles}
                    >
                      <option value="hero">Hero</option>
                      <option value="promo">Promo</option>
                      <option value="category">Category</option>
                      <option value="offer">Offer</option>
                    </select>

                    {errors.type && (
                      <p className="text-sm text-danger">
                        {errors.type.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">
                      Page
                    </label>

                    <select
                      {...register("page")}
                      className={selectStyles}
                    >
                      <option value="home">Home</option>
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                      <option value="kids">Kids</option>
                    </select>

                    {errors.page && (
                      <p className="text-sm text-danger">
                        {errors.page.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">
                      Section
                    </label>

                    <select
                      {...register("section")}
                      className={selectStyles}
                    >
                      <option value="home_top">Home Top</option>
                      <option value="home_trending">Trending</option>
                      <option value="home_slider">Slider</option>
                    </select>

                    {errors.section && (
                      <p className="text-sm text-danger">
                        {errors.section.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">
                      Display Order
                    </label>

                    <FormInput
                      type="number"
                      placeholder="0"
                      {...register("order")}
                      error={errors.order?.message}
                    />
                  </div>
                </div>
              </div>

              <div className={`${sectionCardStyles} p-5 md:p-7`}>
                <div className="mb-6">
                  <h2 className={sectionTitleStyles}>
                    Redirect Settings
                  </h2>

                  <p className={sectionDescStyles}>
                    Configure where customers will be redirected after clicking
                    the banner.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">
                      Redirect Type
                    </label>

                    <select
                      {...register("redirectType")}
                      className={selectStyles}
                    >
                      <option value="url">URL</option>
                      <option value="category">Category</option>
                      <option value="product">Product</option>
                    </select>
                  </div>

                  <FormInput
                    label="Redirect Value"
                    placeholder="/summer-sale"
                    {...register("redirectValue")}
                    error={errors.redirectValue?.message}
                  />

                  <FormInput
                    label="Discount Text"
                    placeholder="Up to 50% OFF"
                    {...register("discountText")}
                    error={errors.discountText?.message}
                  />
                </div>
              </div>

              <div className={`${sectionCardStyles} p-5 md:p-7`}>
                <div className="mb-6">
                  <h2 className={sectionTitleStyles}>Banner Status</h2>

                  <p className={sectionDescStyles}>
                    Control banner visibility and activation state.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">
                      Status
                    </label>

                    <select
                      {...register("isActive")}
                      className={selectStyles}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>

                  <div className="rounded-2xl border border-border-light bg-bg-soft/60 p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />

                      <div>
                        <h3 className="text-sm font-semibold text-text-primary">
                          Visibility Information
                        </h3>

                        <p className="mt-1 text-sm text-text-muted leading-relaxed">
                          Active banners are visible across configured sections
                          and storefront placements.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="xl:col-span-4">

              <div className={`${sectionCardStyles} p-5 md:p-6 sticky top-6`}>
                <div className="mb-6">
                  <h2 className={sectionTitleStyles}>Banner Image</h2>

                  <p className={sectionDescStyles}>
                    Update your banner image with high-quality promotional
                    visuals.
                  </p>
                </div>

                {existingImage && (
                  <div className="mb-5 overflow-hidden rounded-2xl border border-border-light bg-bg-soft">
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <img
                        src={existingImage}
                        alt="Existing banner"
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    <div className="border-t border-border-light px-4 py-3">
                      <p className="text-sm font-medium text-text-primary">
                        Current Banner
                      </p>

                      <p className="text-xs text-text-muted mt-1">
                        Upload a new image to replace the existing banner.
                      </p>
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-dashed border-border bg-bg-soft/40 p-4 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5">
                  <ProductImageUpload
                    files={files}
                    setFiles={setFiles}
                    existingImages={existingImage ? [existingImage] : []}
                    setExistingImages={(imgs) =>
                      setExistingImage(imgs[0] || "")
                    }
                    max={1}
                  />
                </div>

                <div className="mt-6 rounded-2xl border border-border-light bg-bg-soft/60 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />

                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        Recommended Upload
                      </p>

                      <p className="mt-1 text-xs leading-relaxed text-text-muted">
                        Use high-resolution banner images for better storefront
                        appearance and promotional visibility.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="
                      w-full rounded-2xl py-3.5 text-sm md:text-base font-semibold
                      transition-all duration-200
                      disabled:cursor-not-allowed disabled:opacity-70
                      shadow-lg shadow-primary/10
                    "
                  >
                    {loading ? "Updating..." : "Update Banner"}
                  </Button>
                </div>

              </div>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default EditBanner;
