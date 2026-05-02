


import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

import AdminOutletHead from "../../../components/Admin/AdminOutletHead";
import Button from "../../../components/ui/Button";
import FormInput from "../../../components/ui/FormInput";
import { showError, showSuccess } from "../../../components/ui/Toastify";

import { useEffect } from "react";
import {
  getBrandById,
  updateBrand
} from "../../../Redux/slices/admin/brandSlice";
import { getCategory } from "../../../Redux/slices/admin/categorySlice";

const UpdateBrand = () => {
  const dispatch = useDispatch();
  const { brandId } = useParams();
  const navigate= useNavigate()

  const { categories } = useSelector((state) => state.category);
  const { selectedBrand, loading } = useSelector((state) => state.brand);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(getCategory());
    dispatch(getBrandById(brandId));
  }, [dispatch, brandId]);


  
const groupedOptions = categories.map((cat) => ({
  label: cat.name,
  options: (cat.children || []).map((child) => ({
    value: child._id,
    label: child.name,
  })),
}));
useEffect(() => {
  if (!selectedBrand ) return;
  
 const selectedCategory =
    selectedBrand.categories?.map((c) => ({
      value: c._id,
      label: c.name,
    })) || [];
    reset({
      name: selectedBrand.name || "",
     
      isActive: selectedBrand.isActive,
     category:selectedCategory,
    });
  }, [selectedBrand, reset]);


  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        isActive: data.isActive,
        category: (data.category || []).map((c) => c.value),
      };

      await dispatch(updateBrand({ brandId, data: payload })).unwrap();
      
      showSuccess("Brand updated successfully");
        navigate("/admin-dashboard/brands")
    } catch (err) {
      showError(err);
    }
  };



  return (
    <>
      <AdminOutletHead heading="UPDATE BRAND" />

      <div className="flex justify-center items-start lg:bg-bg-soft mt-20 min-h-screen">
        <div className="bg-bg-main rounded-2xl lg:w-[40%] w-[90%] mt-10 px-5 py-6 border border-border-light">
          <h1 className="text-2xl lg:text-3xl text-center text-text-secondary font-medium">
            Update Brand
          </h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              label="Brand Name"
              {...register("name", {
                required: "Brand name is required",
                minLength: { value: 2, message: "Minimum 2 characters" },
              })}
              error={errors.name?.message}
            />

            <div>
              <label className="text-text-primary">Category</label>

              <Controller
                name="category"
                control={control}
                rules={{ required: "Please select category" }}
                render={({ field }) => (
                  <Select
                    isMulti
                    options={ groupedOptions }
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              {errors.category && (
                <p className="text-danger">{errors.category.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between pb-4 mt-5">
              <span className="text-lg font-medium text-text-primary">
                Active
              </span>

              <input type="checkbox" {...register("isActive")} />
            </div>

            <Button type="submit" fullWidth>
              {loading ? "Updating..." : "Update Brand"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateBrand;
