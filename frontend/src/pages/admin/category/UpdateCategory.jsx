


import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AdminOutletHead from "../../../components/Admin/AdminOutletHead";
import Button from "../../../components/ui/Button";
import FormInput from "../../../components/ui/FormInput";
import { showError, showSuccess } from "../../../components/ui/Toastify";
import { getCategory, getCategoryById, updateCategory } from "../../../Redux/slices/admin/categorySlice";

const UpdateCategoryForm = () => {
  const dispatch = useDispatch();
  const { categories, loading,loadingCategory,selectedCategory } = useSelector((state) => state.category);
      const {categoryId} = useParams()
  
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    
  });
  useEffect(() => {
  if (categoryId) {
    dispatch(getCategoryById(categoryId));
  }
}, [categoryId, dispatch]);

  
  useEffect(()=>{
     if(selectedCategory){
       reset({
        name:selectedCategory.name,
        parentId:selectedCategory.parentId,
        status:selectedCategory.status,
        isVisible:selectedCategory.isVisible
       })
     }

  },[selectedCategory,reset])

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
      await dispatch(updateCategory({categoryId,data})).unwrap();
        dispatch(getCategory());
      showSuccess("Category added successfully");
      reset();
    } catch (err) {
      showError(err);
    }
  };

  return (
    <>
      <AdminOutletHead heading={"CATEGORIES"}/>

      <div className="flex justify-center items-start lg:bg-[#FFF1F6] mt-20 min-h-screen">
        <div className="bg-white rounded-2xl lg:w-[40%] w-[90%] mt-10 px-5 py-6">

          <h1 className="text-2xl lg:text-3xl text-center text-gray-700 font-medium">
            Update Category
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
              <label className="text-sm md:text-lg lg:text-lg text-gray-900">
                Parent Category
              </label>
              <select
                {...register("parentId")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 lg:h-11 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">None (Top Level)</option>
                {buildCategoryOptions(categories)}
              </select>
            </div>
            
            <div className="flex flex-col gap-1 pb-3">
              <label className="text-sm md:text-lg lg:text-lg text-gray-900">
                Status
              </label>

          <select
              {...register("status")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 lg:h-11 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              
              >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
          </select>
            </div>

            <div className="flex items-center justify-between pb-4 mt-5">
              <span className="text-lg font-medium text-gray-900">
                Visible to Users
              </span>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isVisible")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-pink-600 transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform
                  peer-checked:translate-x-5">
                </div>
              </label>
            </div>

            <Button type="submit" fullWidth disabled={loadingCategory}>
              {loadingCategory ? "Updating..." : "Update Category"}
            </Button>

          </form>
        </div>
      </div>

    </>
  );
};

export default UpdateCategoryForm;
