


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

  const { loading } = useSelector(
    (state) => state.banner
  );

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
        isActive:
          data.isActive === "true",
        isVisible: true,
        order: data.order || 0,
      };

      Object.entries(payload).forEach(
        ([key, value]) => {
          if (
            value !== undefined &&
            value !== null
          ) {
            formData.append(key, value);
          }
        }
      );

      formData.append("image", files[0]);

      await dispatch(
        addBanner(formData)
      ).unwrap();

      showSuccess("Banner Added");

      navigate(
        "/admin-dashboard/banners"
      );
    } catch (err) {
      showError(err);
    }
  };

  const selectClassName = (error) =>
    `w-full h-[54px] rounded-2xl border bg-white px-4 text-sm font-medium text-text-secondary shadow-sm transition-all duration-200 outline-none appearance-none ${
      error
        ? "border-danger focus:border-danger focus:ring-4 focus:ring-danger/10"
        : "border-border-light hover:border-border focus:border-primary focus:ring-4 focus:ring-primary/10"
    }`;

  return (
    <>
      <AdminOutletHead
        heading={"BANNERS"}
      />

      <div className="min-h-screen bg-gradient-to-b from-bg-soft via-white to-bg-soft px-3 sm:px-5 lg:px-8 py-6 sm:py-8">

        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="mb-8">

            <div className="flex flex-col gap-3">

            

              <div>

                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
                  Add Banner
                </h1>

                <p className="mt-2 max-w-2xl text-sm sm:text-base text-text-muted">
                  Create promotional banners
                  for your ecommerce store
                  with modern layout
                  controls, redirect
                  settings, and visibility
                  management.
                </p>

              </div>

            </div>

          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 xl:grid-cols-12 gap-6"
          >

            {/* LEFT SIDE */}
            <div className="xl:col-span-8 space-y-6">

              {/* BANNER DETAILS */}
              <div className="rounded-[28px] border border-border-light bg-white/90 backdrop-blur-sm shadow-[0_10px_40px_rgba(0,0,0,0.04)] overflow-hidden">

                <div className="border-b border-border-light bg-gradient-to-r from-white to-bg-soft/40 px-5 sm:px-7 py-5">

                  <h2 className="text-xl font-semibold text-text-primary">
                    Banner Details
                  </h2>

                  <p className="mt-1 text-sm text-text-muted">
                    Configure the core
                    content and messaging
                    for your banner.
                  </p>

                </div>

                <div className="p-5 sm:p-7">

                  <div className="space-y-5">

                    <FormInput
                      label="Banner Title"
                      placeholder="Summer Sale Collection"
                      {...register("title", {
                        required:
                          "Title required",
                      })}
                      error={
                        errors.title
                          ?.message
                      }
                    />

                    <FormInput
                      label="Subtitle"
                      placeholder="Discover premium fashion deals"
                      {...register(
                        "subtitle"
                      )}
                    />

                  </div>

                </div>

              </div>

              {/* CONFIGURATION */}
              <div className="rounded-[28px] border border-border-light bg-white/90 backdrop-blur-sm shadow-[0_10px_40px_rgba(0,0,0,0.04)] overflow-hidden">

                <div className="border-b border-border-light bg-gradient-to-r from-white to-bg-soft/40 px-5 sm:px-7 py-5">

                  <h2 className="text-xl font-semibold text-text-primary">
                    Banner Configuration
                  </h2>

                  <p className="mt-1 text-sm text-text-muted">
                    Control where and how
                    the banner appears
                    across the storefront.
                  </p>

                </div>

                <div className="p-5 sm:p-7">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* TYPE */}
                    <div>

                      <label className="mb-2 block text-sm font-semibold text-text-primary">
                        Banner Type
                      </label>

                      <select
                        {...register(
                          "type",
                          {
                            required: true,
                          }
                        )}
                        className={selectClassName(
                          errors.type
                        )}
                      >
                        <option value="">
                          Select Type
                        </option>

                        <option value="hero">
                          Hero
                        </option>

                        <option value="promo">
                          Promo
                        </option>

                        <option value="category">
                          Category
                        </option>

                        <option value="offer">
                          Offer
                        </option>

                      </select>

                    </div>

                    {/* PAGE */}
                    <div>

                      <label className="mb-2 block text-sm font-semibold text-text-primary">
                        Target Page
                      </label>

                      <select
                        {...register(
                          "page",
                          {
                            required: true,
                          }
                        )}
                        className={selectClassName(
                          errors.page
                        )}
                      >
                        <option value="">
                          Select Page
                        </option>

                        <option value="home">
                          Home
                        </option>

                        <option value="men">
                          Men
                        </option>

                        <option value="women">
                          Women
                        </option>

                        <option value="kids">
                          Kids
                        </option>

                      </select>

                    </div>

                    {/* SECTION */}
                    <div>

                      <label className="mb-2 block text-sm font-semibold text-text-primary">
                        Banner Section
                      </label>

                      <select
                        {...register(
                          "section",
                          {
                            required: true,
                          }
                        )}
                        className={selectClassName(
                          errors.section
                        )}
                      >
                        <option value="">
                          Select Section
                        </option>

                        <option value="home_top">
                          Home Top
                        </option>

                        <option value="home_trending">
                          Trending
                        </option>

                        <option value="home_slider">
                          Slider
                        </option>

                      </select>

                    </div>

                    {/* STATUS */}
                    <div>

                      <label className="mb-2 block text-sm font-semibold text-text-primary">
                        Banner Status
                      </label>

                      <select
                        {...register(
                          "isActive"
                        )}
                        className={selectClassName()}
                      >
                        <option value="true">
                          Active
                        </option>

                        <option value="false">
                          Inactive
                        </option>

                      </select>

                    </div>

                  </div>

                </div>

              </div>

              {/* REDIRECT SETTINGS */}
              <div className="rounded-[28px] border border-border-light bg-white/90 backdrop-blur-sm shadow-[0_10px_40px_rgba(0,0,0,0.04)] overflow-hidden">

                <div className="border-b border-border-light bg-gradient-to-r from-white to-bg-soft/40 px-5 sm:px-7 py-5">

                  <h2 className="text-xl font-semibold text-text-primary">
                    Redirect Settings
                  </h2>

                  <p className="mt-1 text-sm text-text-muted">
                    Configure redirect
                    behavior and promotional
                    information for banner
                    interactions.
                  </p>

                </div>

                <div className="p-5 sm:p-7">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* REDIRECT TYPE */}
                    <div>

                      <label className="mb-2 block text-sm font-semibold text-text-primary">
                        Redirect Type
                      </label>

                      <select
                        {...register(
                          "redirectType"
                        )}
                        className={selectClassName()}
                      >
                        <option value="url">
                          URL
                        </option>

                        <option value="category">
                          Category
                        </option>

                        <option value="product">
                          Product
                        </option>

                      </select>

                    </div>

                    {/* ORDER */}
                    <FormInput
                      label="Display Order"
                      type="number"
                      placeholder="0"
                      {...register("order")}
                    />

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

                    <FormInput
                      label="Redirect Value"
                      placeholder="/collections/summer"
                      {...register(
                        "redirectValue"
                      )}
                    />

                    <FormInput
                      label="Discount Text"
                      placeholder="Up to 50% OFF"
                      {...register(
                        "discountText"
                      )}
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* RIGHT SIDEBAR */}
            <div className="xl:col-span-4">

              <div className="xl:sticky xl:top-24 space-y-6">

                {/* IMAGE */}
                <div className="rounded-[28px] border border-border-light bg-white/90 backdrop-blur-sm shadow-[0_10px_40px_rgba(0,0,0,0.04)] overflow-hidden">

                  <div className="border-b border-border-light bg-gradient-to-r from-white to-bg-soft/40 px-5 sm:px-7 py-5">

                    <h2 className="text-xl font-semibold text-text-primary">
                      Banner Image
                    </h2>

                    <p className="mt-1 text-sm text-text-muted">
                      Upload a high-quality
                      banner image for the
                      storefront display.
                    </p>

                  </div>

                  <div className="p-5 sm:p-7">

                    <div className="rounded-3xl border border-dashed border-border bg-bg-soft/50 p-4 transition-all duration-300 hover:border-primary/40 hover:bg-primary/5">

                      <ProductImageUpload
                        files={files}
                        setFiles={setFiles}
                        max={1}
                      />

                    </div>

                  </div>

                </div>

                {/* STATUS CARD */}
                <div className="rounded-[28px] border border-border-light bg-gradient-to-br from-primary/[0.03] to-white shadow-[0_10px_40px_rgba(0,0,0,0.04)] p-5 sm:p-7">

                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">

                      <svg
                        className="h-6 w-6 text-primary"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12A9 9 0 1112 3a9 9 0 019 9z"
                        />
                      </svg>

                    </div>

                    <div>

                      <h3 className="text-base font-semibold text-text-primary">
                        Banner Publishing
                      </h3>

                      <p className="mt-1 text-sm leading-relaxed text-text-muted">
                        Active banners become
                        immediately visible
                        across configured
                        storefront sections.
                      </p>

                    </div>

                  </div>

                  <div className="mt-6 border-t border-border-light pt-6">

                    <Button
                      type="submit"
                      disabled={loading}
                      className={`h-14 w-full rounded-2xl text-sm font-semibold transition-all duration-300 ${
                        loading
                          ? "cursor-not-allowed opacity-70"
                          : "hover:-translate-y-0.5 active:translate-y-0"
                      }`}
                    >
                      {loading
                        ? "Adding Banner..."
                        : "Add Banner"}
                    </Button>

                  </div>

                </div>

              </div>

            </div>

          </form>

        </div>

      </div>
    </>
  );
};

export default AddBanner;
