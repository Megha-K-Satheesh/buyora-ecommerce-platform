


import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

import AdminOutletHead from "../../../components/Admin/AdminOutletHead";
import CategoryAttributeSelect from "../../../components/Admin/CategoryAttributeSelect";
import ProductImageUpload from "../../../components/Admin/ProductImageUpload";
import Button from "../../../components/ui/Button";
import FormInput from "../../../components/ui/FormInput";
import { showError, showSuccess } from "../../../components/ui/Toastify";

import { getBrandsByCategoryId } from "../../../Redux/slices/admin/brandSlice";
import { addProduct } from "../../../Redux/slices/admin/productSlice";
import { generateVariants } from "../../../utils/generateVariants";

const AddProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories } = useSelector((state) => state.category);
  const { brands } = useSelector((state) => state.brand);
  const { loading } = useSelector((state) => state.product);

  const [files, setFiles] = useState([]);
  const [variants, setVariants] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const selectedCategoryId = useWatch({
    control,
    name: "category",
  });

  const attributes = useWatch({
    control,
    name: "attributes",
  });

  useEffect(() => {
    if (!selectedCategoryId) return;

    dispatch(getBrandsByCategoryId(selectedCategoryId));
  }, [selectedCategoryId, dispatch]);

  useEffect(() => {
    if (!attributes) return;

    const generated = generateVariants(attributes);

    const withStock = generated.map((v) => ({
      attributes: v,
      stock: 0,
    }));

    setVariants(withStock);
  }, [attributes]);

  const brandsForSelectedCategory = useMemo(() => brands || [], [brands]);

  const handleStockChange = (index, value) => {
    const updated = [...variants];
    updated[index].stock = Number(value);
    setVariants(updated);
  };

  const onSubmit = async (data) => {
    if (files.length === 0) {
      showError("Product image is required");
      return;
    }

    if (!variants.length) {
      showError("Please select attributes to generate variants");
      return;
    }

    try {
      const formData = new FormData();

      const payload = {
        name: data.name,
        description: data.description,
        brand: data.brand,
        category: data.category,
        mrp: data.mrp,
        sellingPrice: data.sellingPrice,
        status: data.status,
        isVisible: data.isVisible,
      };

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      formData.append("attributes", JSON.stringify(data.attributes));

      formData.append("variations", JSON.stringify(variants));

      files.forEach((file) => {
        formData.append("images", file);
      });

      await dispatch(addProduct(formData)).unwrap();

      showSuccess("Product Added");
      navigate("/admin-dashboard/products");
    } catch (err) {
      showError(err?.message || "Something went wrong");
    }
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "52px",
      borderRadius: "16px",
      borderColor: state.isFocused ? "#6366F1" : "#E5E7EB",
      boxShadow: state.isFocused
        ? "0 0 0 4px rgba(99, 102, 241, 0.10)"
        : "none",
      "&:hover": {
        borderColor: "#6366F1",
      },
      backgroundColor: "#FFFFFF",
      paddingLeft: "6px",
      fontSize: "14px",
      color: "#111827",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 10px",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6B7280",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#111827",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "16px",
      overflow: "hidden",
      zIndex: 50,
      border: "1px solid #E5E7EB",
      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#F5F7FF" : "#FFFFFF",
      color: "#111827",
      padding: "12px 16px",
      cursor: "pointer",
    }),
  };

  return (
    <>
      <AdminOutletHead heading="PRODUCTS" />

      <div className="min-h-screen bg-gradient-to-b from-bg-soft via-white to-bg-soft px-3 sm:px-5 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">

          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Add Product
            </h1>

            <p className="text-text-secondary mt-2 text-sm sm:text-base">
              Create and manage premium ecommerce product listings.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 xl:grid-cols-12 gap-6"
          >

            <div className="xl:col-span-8 space-y-6">

              <div className="bg-bg-main rounded-3xl border border-border-light shadow-sm p-5 sm:p-7">

                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-text-primary">
                    Product Information
                  </h2>

                  <p className="text-sm text-text-secondary mt-1">
                    Add the main product details and description.
                  </p>
                </div>

                <div className="space-y-5">

                  <div>
                    <FormInput
                      label="Product Name"
                      placeholder="Enter product name"
                      {...register("name", {
                        required: "Product name required",
                      })}
                      error={errors.name?.message}
                    />
                  </div>

                  <div>
                    <FormInput
                      label="Description"
                      placeholder="Write detailed product description"
                      {...register("description", {
                        required: "Description required",
                      })}
                      error={errors.description?.message}
                    />
                  </div>

                </div>
              </div>

              <div className="bg-bg-main rounded-3xl border border-border-light shadow-sm p-5 sm:p-7">

                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-text-primary">
                    Category & Attributes
                  </h2>

                  <p className="text-sm text-text-secondary mt-1">
                    Select category and configure product variations.
                  </p>
                </div>

                <CategoryAttributeSelect
                  categories={categories}
                  control={control}
                  register={register}
                  errors={errors}
                />
              </div>

              <div className="bg-bg-main rounded-3xl border border-border-light shadow-sm p-5 sm:p-7">

                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-text-primary">
                    Pricing Details
                  </h2>

                  <p className="text-sm text-text-secondary mt-1">
                    Configure pricing and product visibility.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>
                    <FormInput
                      label="MRP"
                      type="number"
                      placeholder="Enter MRP"
                      {...register("mrp", {
                        required: "MRP required",
                      })}
                      error={errors.mrp?.message}
                    />
                  </div>

                  <div>
                    <FormInput
                      label="Selling Price"
                      type="number"
                      placeholder="Enter selling price"
                      {...register("sellingPrice", {
                        required: "Required",
                      })}
                      error={errors.sellingPrice?.message}
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-text-primary">
                      Brand
                    </label>

                    <Controller
                      name="brand"
                      control={control}
                      rules={{ required: "Brand required" }}
                      render={({ field }) => (
                        <Select
                          styles={customSelectStyles}
                          placeholder="Select brand"
                          options={brandsForSelectedCategory.map((b) => ({
                            value: b._id,
                            label: b.name,
                          }))}
                          onChange={(val) => field.onChange(val?.value)}
                          value={brandsForSelectedCategory
                            .filter((b) => b._id === field.value)
                            .map((b) => ({
                              value: b._id,
                              label: b.name,
                            }))}
                        />
                      )}
                    />

                    {errors.brand && (
                      <p className="text-sm mt-2 text-text-secondary">
                        {errors.brand.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-text-primary">
                      Status
                    </label>

                    <select
                      {...register("status")}
                      className="w-full h-[52px] rounded-2xl border border-border-light bg-bg-main px-4 text-sm text-text-primary outline-none transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                </div>

                <div className="mt-6">

                  <label className="flex items-center gap-3 cursor-pointer select-none">

                    <input
                      type="checkbox"
                      {...register("isVisible")}
                      className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
                    />

                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        Product Visibility
                      </p>

                      <p className="text-xs text-text-secondary">
                        Make this product visible on the storefront.
                      </p>
                    </div>

                  </label>

                </div>

              </div>

              {variants.length > 0 && (
                <div className="bg-bg-main rounded-3xl border border-border-light shadow-sm p-5 sm:p-7">

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

                    <div>
                      <h2 className="text-xl font-semibold text-text-primary">
                        Product Variants
                      </h2>

                      <p className="text-sm text-text-secondary mt-1">
                        Manage stock for each generated variation.
                      </p>
                    </div>

                    <div className="bg-bg-soft border border-border-light text-text-primary px-4 py-2 rounded-xl text-sm font-medium w-fit">
                      {variants.length} Variants
                    </div>

                  </div>

                  <div className="space-y-4">

                    {variants.map((v, index) => (
                      <div
                        key={index}
                        className="border border-border-light rounded-2xl p-4 sm:p-5 hover:border-border transition-all duration-200 bg-bg-main"
                      >

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                          <div className="flex-1">
                            <div className="flex flex-wrap gap-2">

                              {Object.entries(v.attributes).map(
                                ([k, val]) => (
                                  <span
                                    key={k}
                                    className="px-3 py-1.5 rounded-full bg-bg-soft border border-border-light text-text-secondary text-xs font-medium"
                                  >
                                    {k}: {val}
                                  </span>
                                )
                              )}

                            </div>
                          </div>

                          <div className="w-full sm:w-[180px]">

                            <label className="text-xs font-semibold text-text-secondary block mb-2">
                              STOCK QUANTITY
                            </label>

                            <input
                              type="number"
                              value={v.stock}
                              onChange={(e) =>
                                handleStockChange(index, e.target.value)
                              }
                              className="w-full h-12 rounded-2xl border border-border-light bg-bg-main px-4 text-text-primary outline-none transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10"
                            />

                          </div>

                        </div>

                      </div>
                    ))}

                  </div>

                </div>
              )}

            </div>

            <div className="xl:col-span-4 space-y-6">

              <div className="bg-bg-main rounded-3xl border border-border-light shadow-sm p-5 sm:p-7 xl:sticky xl:top-24">

                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-text-primary">
                    Product Media
                  </h2>

                  <p className="text-sm text-text-secondary mt-1">
                    Upload high quality product images.
                  </p>
                </div>

                <div className="rounded-2xl border border-dashed border-border bg-bg-soft p-4 sm:p-5">
                  <ProductImageUpload
                    files={files}
                    setFiles={setFiles}
                    max={5}
                  />
                </div>

                {files.length === 0 && (
                  <div className="mt-4 rounded-2xl bg-bg-soft border border-border-light px-4 py-3">
                    <p className="text-sm text-text-secondary">
                      Upload at least one product image.
                    </p>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-border-light">

                  <Button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-14 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                      loading
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:-translate-y-0.5"
                    }`}
                  >
                    {loading ? "Adding Product..." : "Add Product"}
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

export default AddProducts;



