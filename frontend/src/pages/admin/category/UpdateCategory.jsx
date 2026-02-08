


import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AdminOutletHead from "../../../components/Admin/AdminOutletHead";
import Button from "../../../components/ui/Button";
import FormInput from "../../../components/ui/FormInput";
import { showError, showSuccess } from "../../../components/ui/Toastify";
import { getCategory, getCategoryById, updateCategory } from "../../../Redux/slices/admin/categorySlice";

const UpdateCategoryForm = () => {
  const dispatch = useDispatch();
  const [parentLevel, setParentLevel] = useState(0);
  const { categories, loading,loadingCategory,selectedCategory } = useSelector((state) => state.category);
      const {categoryId} = useParams()
  
  
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm({
       defaultValues: {
      name: "",
      parentId: "",
      status: "active",
      isVisible: true,
      allowedAttributes: []
    }
  });

    const selectedParentId = useWatch({
    control,
    name: "parentId",
    defaultValue: ""
  });
   const { fields, append, remove,replace } = useFieldArray({
    control,
    name: "allowedAttributes"
  });
  useEffect(() => {
  if (categoryId) {
    dispatch(getCategoryById(categoryId));
  }
}, [categoryId, dispatch]);

  
 useEffect(() => {
  if (selectedCategory) {
    let level = selectedCategory.level;
    if (selectedCategory.parentId) {
      const parent = categories.find((c) => c._id === selectedCategory.parentId);
      if (parent) level = parent.level;
    }
    setParentLevel(level);

    reset(
      {
        name: selectedCategory.name,
        parentId: selectedCategory.parentId || "",
        status: selectedCategory.status,
        isVisible: selectedCategory.isVisible,
        allowedAttributes:
          selectedCategory.allowedAttributes?.map((attr) => ({
            name: attr.name,
            values: attr.values.join(", ")
          })) || []
      },
      { replace: true }
    );
  }
}, [selectedCategory, categories, reset]);

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);


    useEffect(() => {
    if (selectedParentId) {
      const parent = categories.find((c) => c._id === selectedParentId);
      setParentLevel(parent ? parent.level : 0);
    } else {
      setParentLevel(0);
    }
  }, [selectedParentId, categories]);


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
         
        const formattedData = {
        ...data,
        allowedAttributes:
          parentLevel === 1
            ? data.allowedAttributes.map((attr) => ({
                name: attr.name.trim(),
                values: attr.values
                  .split(",")
                  .map((v) => v.trim())
                  .filter(Boolean)
              }))
            : []
      };


      await dispatch(updateCategory({categoryId,data:formattedData})).unwrap();
        dispatch(getCategory());
      showSuccess("Category updated successfully");
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

             {parentLevel === 1 && (
              <div className="border p-3 rounded space-y-3">
                <h3 className="font-semibold">Allowed Attributes</h3>

                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      placeholder="Attribute name"
                      {...register(`allowedAttributes.${index}.name`, {
                        required: true
                      })}
                      className="border p-2 flex-1"
                    />

                    <input
                      placeholder="Values (comma separated)"
                      {...register(`allowedAttributes.${index}.values`, {
                        required: true
                      })}
                      className="border p-2 flex-1"
                    />

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500"
                    >
                      remove
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => append({ name: "", values: "" })}
                  className="text-blue-600"
                >
                  + Add Attribute
                </button>
              </div>
            )}


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
