


import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../components/ui/Button";
import Footer from "../../../components/ui/Footer";
import FormInput from "../../../components/ui/FormInput";
import Navbar from "../../../components/ui/Navbar";
import { showError, showSuccess } from "../../../components/ui/Toastify";
import { addCategory, getCategory } from "../../../Redux/slices/adminSlice";

const AddCategoryForm = () => {
  const dispatch = useDispatch();
  const { categories, loading,loadingCategory } = useSelector((state) => state.admin);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "",
      parentId: "",
      isActive: true,
      isVisible: true
    }
  });

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  const buildCategoryOptions = (cats, prefix = "") =>
    cats.flatMap((cat) =>{
      
    if (!cat || !cat._id) return [];
      
      return[
      <option key={cat._id} value={cat._id}>
        {prefix + cat.name}
      </option>,
      ...(cat.children
        ? buildCategoryOptions(cat.children, prefix + " └─ ")
        : [])
    ]});

  const onSubmit = async (data) => {
    try {
      await dispatch(addCategory(data)).unwrap();
      showSuccess("Category added successfully");
      reset();
    } catch (err) {
      showError(err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex justify-center items-start lg:bg-[#FFF1F6] mt-20 min-h-screen">
        <div className="bg-white rounded-2xl lg:w-[40%] w-[90%] mt-10 px-5 py-6">

          <h1 className="text-2xl lg:text-3xl text-center text-gray-700 font-medium">
            Add Category
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8">

            <FormInput
              label="Category Name"
              placeholder="Enter category name"
              required
              {...register("name", {
                required: "Category name is required",
                minLength: {
                  value: 2,
                  message: "Minimum 2 characters"
                }
              })}
              error={errors.name?.message}
            />

            <div className="flex flex-col gap-1 pb-3">
              <label className="text-xs lg:text-sm font-medium text-gray-900">
                Parent Category
              </label>
              <select
                {...register("parentId")}
                className="w-full border rounded-md px-3 py-2 lg:h-11 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">None (Top Level)</option>
                {buildCategoryOptions(categories)}
              </select>
            </div>

            <div className="flex items-center justify-between pb-4">
              <span className="text-sm font-medium text-gray-900">
                Active Status
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-pink-500 transition"></div>
              </label>
            </div>

            <div className="flex items-center gap-2 pb-4">
              <input
                type="checkbox"
                {...register("isVisible")}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-800">
                Visible to Users
              </span>
            </div>

            <Button type="submit" fullWidth disabled={loadingCategory}>
              {loadingCategory ? "Adding..." : "Add Category"}
            </Button>

          </form>
        </div>
      </div>

      <Footer/>
    </>
  );
};

export default AddCategoryForm;



