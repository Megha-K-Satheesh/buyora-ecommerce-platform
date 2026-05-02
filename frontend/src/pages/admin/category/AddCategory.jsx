


import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminOutletHead from "../../../components/Admin/AdminOutletHead";
import Button from "../../../components/ui/Button";
import FormInput from "../../../components/ui/FormInput";
import { showError, showSuccess } from "../../../components/ui/Toastify";
import { addCategory, getCategory } from "../../../Redux/slices/admin/categorySlice";

const AddCategoryForm = () => {
  const dispatch = useDispatch();
  const { categories, loading, loadingCategory } = useSelector((state) => state.category);
  const navigate = useNavigate()
  const [parentLevel,setParentLevel] = useState(0)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "",
      parentId: "",
      status:"active",
      isVisible: true,
      allowedAttributes: []
    }
  });

   const selectedParentId = useWatch({
    control,
    name:"parentId",
    defaultValue:""
   })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "allowedAttributes"
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
      const formattedData = {
        ...data,
        allowedAttributes:
          parentLevel === 1
            ? data.allowedAttributes.map(attr => ({
                name: attr.name.trim(),
                values: attr.values
                  .split(",")
                  .map(v => v.trim())
                  .filter(Boolean)
              }))
            : []
      };

      await dispatch(addCategory(formattedData)).unwrap();
      dispatch(getCategory());
      showSuccess("Category added successfully");

      reset();
      navigate("/admin-dashboard/categories")
    } catch (err) {
      showError(err);
    }
  };
  
  useEffect(() => {
    if (selectedParentId) {
      const parent = categories.find(cat => cat._id === selectedParentId);
      setParentLevel(parent ? parent.level : 0);
    } else {
      setParentLevel(0); 
    }
  }, [selectedParentId, categories]);

  return (
    <>
      <AdminOutletHead heading={"CATEGORIES"}/>

      <div className="flex justify-center items-start lg:bg-bg-soft mt-20 min-h-screen">
        <div className="bg-bg-main rounded-2xl lg:w-[40%] w-[90%] mt-10 px-5 py-6 border border-border-light">

          <h1 className="text-2xl lg:text-3xl text-center text-text-secondary font-medium">
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
              <label className="text-sm md:text-lg lg:text-lg text-text-primary">
                Parent Category
              </label>
              <select
                {...register("parentId")}
                className="w-full border border-border rounded-md px-3 py-2 lg:h-11 text-lg text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">None (Top Level)</option>
                {buildCategoryOptions(categories)}
              </select>
            </div>
            
            <div className="flex flex-col gap-1 pb-3">
              <label className="text-sm md:text-lg lg:text-lg text-text-primary">
                Status
              </label>

              <select
                {...register("status")}
                className="w-full border border-border rounded-md px-3 py-2 lg:h-11 text-lg text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-center justify-between pb-4 mt-5">
              <span className="text-lg font-medium text-text-primary">
                Visible to Users
              </span>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isVisible")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-border rounded-full peer-checked:bg-primary transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform
                  peer-checked:translate-x-5">
                </div>
              </label>
            </div>

            {parentLevel === 1 && (
              <div className="border border-border p-3 rounded space-y-3">
                <h3 className="font-semibold text-text-primary">Allowed Attributes</h3>

                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      placeholder="Attribute name (Size / Volume)"
                      {...register(`allowedAttributes.${index}.name`, { required: true })}
                      className="border border-border p-2 flex-1 text-text-secondary bg-bg-main"
                    />

                    <input
                      placeholder="Values (comma separated)"
                      {...register(`allowedAttributes.${index}.values`, { required: true })}
                      className="border border-border p-2 flex-1 text-text-secondary bg-bg-main"
                    />

                    <button type="button" onClick={() => remove(index)} className="text-danger">
                      remove
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => append({ name: "", values: "" })}
                  className="text-primary"
                >
                  + Add Attribute
                </button>
              </div>
            )}

            <Button type="submit" fullWidth disabled={loadingCategory}>
              {loadingCategory ? "Adding..." : "Add Category"}
            </Button>

          </form>
        </div>
      </div>

    </>
  );
};

export default AddCategoryForm;



