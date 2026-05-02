


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

const AddProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories } = useSelector((state) => state.category);
  const { brands } = useSelector((state) => state.brand);
  const { loading } = useSelector((state) => state.product);

  const [files, setFiles] = useState([]);

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

 
useEffect(() => {
  if (!selectedCategoryId) return;

  const fetchBrands = async () => {
    try {
    

      dispatch(
        getBrandsByCategoryId(selectedCategoryId)
      )



  
    } catch (error) {
    
      showError(error?.message || "Failed to load brands");
    }
  };

  fetchBrands();
}, [selectedCategoryId, dispatch]);
  const brandsForSelectedCategory = useMemo(() => {
    return brands || [];
  }, [brands]);

  const onSubmit = async (data) => {
    if (files.length === 0) {
      showError("Product image is required");
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
        stock: data.stock || 0,
        status: data.status,
        isVisible: data.isVisible,
      };

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      if (data.attributes) {
        formData.append("attributes", JSON.stringify(data.attributes));
      }

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
console.log("PARENT CATEGORY:", selectedCategoryId);
  return (
    <>
      <AdminOutletHead heading="PRODUCTS" />

      <div className="flex justify-center items-start lg:bg-bg-soft mt-20 min-h-screen">
        <div className="bg-bg-main rounded-2xl lg:w-[40%] w-[90%] mt-10 px-5 py-6">
          <h1 className="text-2xl text-center">Add Products</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              label="Product Name"
              {...register("name", { required: "Product name required" })}
              error={errors.name?.message}
            />

            <FormInput
              label="Description"
              {...register("description", {
                required: "Description required",
              })}
              error={errors.description?.message}
            />

            <CategoryAttributeSelect
              categories={categories}
              control={control}
              register={register}
              errors={errors}
            />

            <div className="flex flex-col gap-2 mb-3">
              <label>Brand</label>

              <Controller
                name="brand"
                control={control}
                rules={{ required: "Brand required" }}
                render={({ field }) => (
                  <Select
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
                <p className="text-red-500">{errors.brand.message}</p>
              )}
            </div>

            <FormInput
              label="MRP"
              type="number"
              {...register("mrp", { required: "MRP required" })}
              error={errors.mrp?.message}
            />

            <FormInput
              label="Selling Price"
              type="number"
              {...register("sellingPrice", {
                required: "Selling price required",
              })}
              error={errors.sellingPrice?.message}
            />

            <FormInput
              label="Stock"
              type="number"
              {...register("stock", { required: "Stock required" })}
              error={errors.stock?.message}
            />

           <div className="pb-4">
              <label>Status</label>
              <select {...register("status")} className="w-full border p-2">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="pb-4">
              <label>
                <input type="checkbox" {...register("isVisible")} />
                Visible to Users
              </label>
            </div>

            <ProductImageUpload
              files={files}
              setFiles={setFiles}
              max={5}
            />

            <Button type="submit" className="w-full" >
              {loading ? "Adding..." : "Add Product"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProducts;
