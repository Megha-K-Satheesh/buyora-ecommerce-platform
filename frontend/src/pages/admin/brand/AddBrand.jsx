import { Controller, useForm } from "react-hook-form";
import AdminOutletHead from "../../../components/Admin/AdminOutletHead";
import FormInput from "../../../components/ui/FormInput";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import Button from "../../../components/ui/Button";
import { showError, showSuccess } from "../../../components/ui/Toastify";
import { addBrand } from "../../../Redux/slices/admin/brandSlice";
import { getCategory } from "../../../Redux/slices/admin/categorySlice";
import { CategoryUtils } from "../../../utils/categoryUtiles";
const AddBrand = ()=>{
  const dispatch = useDispatch()
  const {categories} =useSelector((state)=>state.category)
  const [flattenedCategories, setFlattenedCategories] = useState([]);

  const {register,handleSubmit,control,formState:{errors}} = useForm()

   useEffect(()=>{
   dispatch(getCategory())
   },[dispatch])

    useEffect(() => {
    if (categories) {
      setFlattenedCategories(CategoryUtils.flattenCategories(categories));
    }
  }, [categories]);

  const onSubmit= async(data)=>{
    try {
      
    await  dispatch(addBrand(data)).unwrap()
      showSuccess("Brand added successfully")
    } catch (err) {
      showError(err)
    }
     
  }
  
  return(

    <>
    <AdminOutletHead heading={"BRANDS"}/>
<div className="flex justify-center items-start lg:bg-[#FFF1F6] mt-20 min-h-screen">
    <div className="bg-white rounded-2xl lg:w-[40%] w-[90%] mt-10 px-5 py-6">
         <h1 className="text-2xl lg:text-3xl text-center text-gray-700 font-medium">
            Add Brands
          </h1>
          <form  onSubmit={handleSubmit(onSubmit)}>

       <FormInput
                    label="Brand Name"
                    placeholder="Enter brand name"
                    required
                    {...register("name", {
                      required: "Brand name is required",
                      minLength: {
                        value: 2,
                        message: "Minimum 2 characters"
                      }
                    })}
                    error={errors.name?.message}
                  />
                  <div>
        <label>Category</label>
        <Controller
          name="category"
          control={control}
          rules={{ required: "Please select a category" }}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={flattenedCategories.map(group => ({
                label: group.heading,
                options: group.options.map(opt => ({ value: opt.id, label: opt.name }))
              }))}
            />
          )}
        />
        {errors.category && <p>{errors.category.message}</p>}
      </div>
      <div className="flex items-center justify-between pb-4 mt-5">
              <span className="text-lg font-medium text-gray-900">
                Active
              </span>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-pink-600 transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform
                  peer-checked:translate-x-5">
                </div>
              </label>
            </div>
              <Button type="submit" fullWidth>
                Add Brand
              </Button>

  </form>
    </div>
  

    </div>
      
    </>
  )
}
export default AddBrand
