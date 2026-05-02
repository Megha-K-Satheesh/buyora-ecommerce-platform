



import { Controller, useForm } from "react-hook-form";
import AdminOutletHead from "../../../components/Admin/AdminOutletHead";
import FormInput from "../../../components/ui/FormInput";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
const navigate= useNavigate()
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
      navigate("/admin-dashboard/brands")
    } catch (err) {
      showError(err)
    }
     
  }
   
  return(

    <>
    <AdminOutletHead heading={"BRANDS"}/>
<div className="flex justify-center items-start lg:bg-bg-soft mt-20 min-h-screen">
    <div className="bg-bg-main rounded-2xl lg:w-[40%] w-[90%] mt-10 px-5 py-6 border border-border-light">
         <h1 className="text-2xl lg:text-3xl text-center text-text-secondary font-medium">
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
        <label className="text-text-primary">Category</label>
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
        {errors.category && <p className="text-danger">{errors.category.message}</p>}
      </div>
      <div className="flex items-center justify-between pb-4 mt-5">
              <span className="text-lg font-medium text-text-primary">
                Active
              </span>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-border rounded-full peer-checked:bg-primary transition-colors"></div>
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
