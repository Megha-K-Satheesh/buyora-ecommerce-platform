
import { useEffect, useState } from "react";

import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import AdminOutletHead from "../../../components/Admin/AdminOutletHead";
import CategoryAttributeSelect from "../../../components/Admin/CategoryAttributeSelect";
import ProductImageUpload from "../../../components/Admin/ProductImageUpload";
import Button from "../../../components/ui/Button";
import FormInput from "../../../components/ui/FormInput";
import { showError, showSuccess } from "../../../components/ui/Toastify";
import { getBrandsByCategoryId } from "../../../Redux/slices/admin/brandSlice";
import { getCategory } from "../../../Redux/slices/admin/categorySlice";
import { updateProduct } from "../../../Redux/slices/admin/productSlice";
import { getCartBackend } from "../../../Redux/slices/cartSlice";
import { getProductById } from "../../../Redux/slices/general/productSlice";
const EditProduct = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const { categories } = useSelector((state) => state.category);
  const { brands } = useSelector((state) => state.brand);
  const { product,loading } = useSelector((state) => state.generalProducts);

  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [variants, setVariants] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors },
  } = useForm();

  const selectedCategoryId = useWatch({
    control,
    name: "category",
  });

  const selectedAttributes = useWatch({
    control,
    name: "attributes",
  });

  useEffect(() => {
    dispatch(getCategory());
    dispatch(getProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedCategoryId) {
      dispatch(getBrandsByCategoryId(selectedCategoryId));
    }
  }, [selectedCategoryId, dispatch]);

  useEffect(() => {
    if (!product) return;

    setExistingImages(product.images || []);

    const existing = product.variations || [];

    setVariants(
      existing.map((v) => ({
            
        attributes: v.attributes,
        stock: v.stock,
        isActive: v.isActive ?? true,
      }))
    );

    const groupedAttributes = {};

    (product.variations || []).forEach((variation) => {
      Object.entries(variation.attributes).forEach(([key, value]) => {
        if (!groupedAttributes[key]) {
          groupedAttributes[key] = [];
        }

        if (!groupedAttributes[key].includes(value)) {
          groupedAttributes[key].push(value);
        }
      });
    });

    reset({
      name: product.name,
      description: product.description,
      category: product.category?._id,
      mrp: product.mrp,
      sellingPrice: product.sellingPrice,
      status: product.status,
      isVisible: product.isVisible,
      brand: product.brand?._id,
      attributes: groupedAttributes,
    });
  }, [product, reset]);

  const isSame = (a, b) =>
    JSON.stringify(a) === JSON.stringify(b);

  const generateCombinations = (attributes) => {
    const keys = Object.keys(attributes || {});
    if (!keys.length) return [];

    let result = [{}];

    keys.forEach((key) => {
      let values = attributes[key];

      if (!Array.isArray(values)) {
        values = [values];
      }

      const temp = [];

      result.forEach((r) => {
        values.forEach((val) => {
          temp.push({ ...r, [key]: val });
        });
      });

      result = temp;
    });

    return result;
  };

  useEffect(() => {
    if (!selectedAttributes) return;

    const combos = generateCombinations(selectedAttributes);

    setVariants((prev) => {
      return combos.map((combo) => {
        const existing = prev.find((v) =>
          isSame(v.attributes, combo)
        );

        return (
          existing || {
            attributes: combo,
            stock: 0,
            isActive: true,
          }
        );
      });
    });
  }, [selectedAttributes]);

  const handleStockChange = (index, value) => {
    const copy = [...variants];
    copy[index].stock = Number(value);
    setVariants(copy);
  };

  const isExistingVariant = (combo) => {
    return variants.some(
      (v) =>
        JSON.stringify(v.attributes) ===
        JSON.stringify(combo)
    );
  };

  const onSubmit = async (data) => {
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

      Object.entries(payload).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          formData.append(k, v);
        }
      });

      formData.append(
        "variations",
        JSON.stringify(variants)
      );

      formData.append(
        "existingImages",
        JSON.stringify(existingImages)
      );

      files.forEach((f) =>
        formData.append("images", f)
      );

      await dispatch(
        updateProduct({ id, formData })
      ).unwrap();

      dispatch(getCartBackend());

      showSuccess("Product Updated");
      navigate("/admin-dashboard/products");
    } catch (err) {
      showError(err?.message || "Update failed");
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
    menu: (base) => ({
      ...base,
      borderRadius: "16px",
      overflow: "hidden",
      zIndex: 50,
      border: "1px solid #E5E7EB",
      boxShadow:
        "0 10px 30px rgba(15, 23, 42, 0.08)",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? "#EEF2FF"
        : "#FFFFFF",
      color: "#111827",
      padding: "12px 16px",
      cursor: "pointer",
    }),
  };

  return (
    <>
      <AdminOutletHead heading="EDIT PRODUCT" />

      <div className="min-h-screen bg-gradient-to-b from-bg-soft via-white to-bg-white px-3 sm:px-5 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">

          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Edit Product
            </h1>

            <p className="text-text-secondary mt-2 text-sm sm:text-base">
              Update product details, variants, pricing,
              and media professionally.
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
                    Product Details
                  </h2>

                  <p className="text-sm text-text-secondary mt-1">
                    Edit the core information of your
                    product listing.
                  </p>
                </div>

                <div className="space-y-5">

                  <FormInput
                    label="Product Name"
                    placeholder="Enter product name"
                    {...register("name")}
                    error={errors.name?.message}
                  />

                  <FormInput
                    label="Description"
                    placeholder="Write detailed product description"
                    {...register("description")}
                    error={errors.description?.message}
                  />

                </div>

              </div>

              <div className="bg-bg-main rounded-3xl border border-border-light shadow-sm p-5 sm:p-7">

                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-text-primary">
                    Category & Attributes
                  </h2>

                  <p className="text-sm text-text-secondary mt-1">
                    Manage categories and product
                    attribute combinations.
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
                    Pricing & Visibility
                  </h2>

                  <p className="text-sm text-text-secondary mt-1">
                    Configure pricing, visibility, and
                    product status.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-text-primary">
                      Brand
                    </label>

                    <Controller
                      name="brand"
                      control={control}
                      render={({ field }) => (
                        <Select
                          styles={customSelectStyles}
                          placeholder="Select brand"
                          options={brands.map((b) => ({
                            value: b._id,
                            label: b.name,
                          }))}
                          value={
                            brands
                              .map((b) => ({
                                value: b._id,
                                label: b.name,
                              }))
                              .find(
                                (b) =>
                                  b.value === field.value
                              ) || null
                          }
                          onChange={(val) =>
                            field.onChange(val?.value)
                          }
                        />
                      )}
                    />

                    {errors.brand && (
                      <p className="text-sm mt-2 text-primary">
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
                      <option value="active">
                        Active
                      </option>

                      <option value="inactive">
                        Inactive
                      </option>
                    </select>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

                  <FormInput
                    label="MRP"
                    type="number"
                    placeholder="Enter MRP"
                    {...register("mrp")}
                    error={errors.mrp?.message}
                  />

                  <FormInput
                    label="Selling Price"
                    type="number"
                    placeholder="Enter selling price"
                    {...register("sellingPrice")}
                    error={
                      errors.sellingPrice?.message
                    }
                  />

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
                        Show this product on the
                        storefront.
                      </p>
                    </div>

                  </label>

                </div>

              </div>

              <div className="bg-bg-main rounded-3xl border border-border-light shadow-sm p-5 sm:p-7">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

                  <div>
                    <h2 className="text-xl font-semibold text-text-primary">
                      Product Variants
                    </h2>

                    <p className="text-sm text-text-secondary mt-1">
                      Manage stock and variant
                      combinations.
                    </p>
                  </div>

                  <div className="bg-bg-soft border border-border-light text-text-primary px-4 py-2 rounded-xl text-sm font-medium w-fit">
                    {
                      generateCombinations(
                        getValues("attributes") || {}
                      ).length
                    }{" "}
                    Variants
                  </div>

                </div>

                <div className="space-y-4">

                  {generateCombinations(
                    getValues("attributes") || {}
                  ).map((combo, i) => {
                    const exists =
                      isExistingVariant(combo);

                    const existingVariant =
                      variants.find(
                        (v) =>
                          JSON.stringify(
                            v.attributes
                          ) ===
                          JSON.stringify(combo)
                      );

                    return (
                      <div
                        key={i}
                        className={`rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
                          exists
                            ? "border-border-light bg-bg-main"
                            : "border-dashed border-border bg-bg-soft"
                        }`}
                      >

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                          <div className="flex-1">

                            <div className="flex flex-wrap gap-2">

                              {Object.entries(combo).map(
                                ([k, val]) => (
                                  <span
                                    key={k}
                                    className="px-3 py-1.5 rounded-full bg-bg-soft border border-border-light text-text-primary text-xs font-medium"
                                  >
                                    {k}: {val}
                                  </span>
                                )
                              )}

                            </div>

                          </div>

                          <div className="flex items-center gap-4 flex-wrap">

                            <span
                              className={`text-sm font-medium px-3 py-1 rounded-full ${
                                exists
                                  ? "bg-primary/10 text-primary"
                                  : "bg-bg-soft text-text-secondary border border-border-light"
                              }`}
                            >
                              {exists
                                ? "Selected"
                                : "Not Added"}
                            </span>

                            {exists && (
                              <div className="w-[140px]">

                                <label className="block text-xs font-semibold text-text-secondary mb-2">
                                  STOCK
                                </label>

                                <input
                                  type="number"
                                  value={
                                    existingVariant?.stock ||
                                    0
                                  }
                                  onChange={(e) => {
                                    const copy = [
                                      ...variants,
                                    ];

                                    const index =
                                      copy.findIndex(
                                        (v) =>
                                          JSON.stringify(
                                            v.attributes
                                          ) ===
                                          JSON.stringify(
                                            combo
                                          )
                                      );

                                    if (
                                      index !== -1
                                    ) {
                                      copy[
                                        index
                                      ].stock = Number(
                                        e.target.value
                                      );

                                      setVariants(
                                        copy
                                      );
                                    }
                                  }}
                                  className="w-full h-12 rounded-2xl border border-border-light bg-bg-main px-4 text-text-primary outline-none transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                />

                              </div>
                            )}

                          </div>

                        </div>

                      </div>
                    );
                  })}

                </div>

              </div>

            </div>

            <div className="xl:col-span-4">

              <div className="bg-bg-main rounded-3xl border border-border-light shadow-sm p-5 sm:p-7 xl:sticky xl:top-24">

                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-text-primary">
                    Product Images
                  </h2>

                  <p className="text-sm text-text-secondary mt-1">
                    Manage product gallery and upload
                    additional images.
                  </p>
                </div>

                <div className="rounded-2xl border border-dashed border-border bg-bg-soft p-4 sm:p-5">
                  <ProductImageUpload
                    files={files}
                    setFiles={setFiles}
                    existingImages={existingImages}
                    setExistingImages={
                      setExistingImages
                    }
                    max={5}
                  />
                </div>

                <div className="mt-8 pt-6 border-t border-border-light">

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 rounded-2xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
                  >
                   {loading ? "Updating..." : "Update Product"}
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

export default EditProduct;
