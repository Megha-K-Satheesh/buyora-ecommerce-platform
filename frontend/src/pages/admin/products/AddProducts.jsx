import { useEffect, useMemo, useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import Select from "react-select"
import AdminOutletHead from "../../../components/Admin/AdminOutletHead"
import CategoryAttributeSelect from "../../../components/Admin/CategoryAttributeSelect"
import ProductImageUpload from "../../../components/Admin/ProductImageUpload"
import Button from "../../../components/ui/Button"
import FormInput from "../../../components/ui/FormInput"
import { showError, showSuccess } from "../../../components/ui/Toastify"
import { getBrandsByCategoryId } from "../../../Redux/slices/admin/brandSlice"
import { getCategory } from "../../../Redux/slices/admin/categorySlice"
import { addProduct } from "../../../Redux/slices/admin/productSlice"
import { CategoryUtils } from "../../../utils/categoryUtiles"


const AddProducts = ()=>{

   const dispatch = useDispatch()
   const {categories} = useSelector((state)=>state.category)
   //  const [leafCategories,setLeafCategories]= useState([]);
   const [files, setFiles] = useState([]);
   const {brands} =useSelector((state)=>state.brand)
   
   const {register,handleSubmit,control,formState:{errors}} = useForm()

   const selectedCategoryId = useWatch({
    control,
    name:'category'
   })
   const brandsForSelectedCategory = useMemo(() => {
  return CategoryUtils.getBrandsForCategory(categories, brands, selectedCategoryId);
}, [categories, brands, selectedCategoryId]);


  useEffect(()=>{
    if(selectedCategoryId){
      dispatch(getBrandsByCategoryId(selectedCategoryId))
    }
  },[selectedCategoryId])

   const onSubmit =async(data)=>{

      if (files.length === 0) {
    showError(" Product image is required");
    return;
  }
   try{

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

             // console.log(Array.from(formData.entries()));
           
            await dispatch(addProduct(formData)).unwrap()
            showSuccess("Product Added")
   }catch(err){
          showError(err)
   }




   }
   useEffect(()=>{
      dispatch(getCategory())
   },[dispatch])
  
 
  return(
    <>
    <AdminOutletHead heading={"PRODUCTS"}/>
  <div className="flex justify-center items-start lg:bg-[#FFF1F6] mt-20 min-h-screen">
    <div className="bg-white rounded-2xl lg:w-[40%] w-[90%] mt-10 px-5 py-6">
       <h1 className="text-2xl lg:text-3xl text-center text-gray-700 font-medium"
       >Add Products </h1>
       <form  onSubmit={handleSubmit(onSubmit)} className=" ">

         <FormInput
         label="Product Name"
         placeholder = "Enter product name"
         required
         {
          ...register('name',{
            required: "Product name is required",
                minLength: {
                  value: 2,
                  message: "Minimum 2 characters"
                }
          })
         }
          error= {errors.name?.message}
         />
          
           <FormInput
           label="Description"
          required
          error={errors.description?.message}
          {...register("description", { required: "Description is required" })}
         />


  {/* select level 3 category dropdown  */}
  <div className="flex flex-col gap-1 pb-3">
   <CategoryAttributeSelect
     categories={categories}
     control={control}
     register={register}
     errors={errors}
   />
</div>
<div className="flex flex-col gap-1 pb-3">
  <label className="text-sm md:text-lg text-gray-900">Brands</label>

 <div className="flex flex-col gap-1 pb-3">
  <label className="text-sm md:text-lg text-gray-900">Brand</label>

  <Controller
    name="brand"
    control={control}
    rules={{ required: "Please select a brand" }}
    render={({ field }) => (
      <Select
        {...field}
        options={brandsForSelectedCategory.map((b) => ({
          value: b._id,
          label: b.name,
        }))}
        isMulti={false} // single selection
        onChange={(selectedOption) => field.onChange(selectedOption?.value)} // send only ID
        value={
          brandsForSelectedCategory
            .filter((b) => b._id === field.value)
            .map((b) => ({ value: b._id, label: b.name }))
        }
        closeMenuOnSelect={true}
        className="basic-single-select"
        classNamePrefix="select"
      />
    )}
  />

  {errors.brand && (
    <p className="text-red-600">{errors.brand.message}</p>
  )}


 </div>
            
              {/* Price fields */}
            <FormInput
              label="MRP"
              type="number"
              placeholder="Enter MRP"
              {...register("mrp", {
                required: "MRP is required",
                min: {
                value: 0,
                message: "MRP cannot be negative",
                },
              })}
              error={errors.mrp?.message}
              />

                <FormInput
                  label="Selling Price"
                  type="number"
                  placeholder="Enter Selling Price"
                  {...register("sellingPrice", {
                    required: "Selling price is required",
                    min: {
                      value: 0,
                      message: "Selling price cannot be negative",
                    },
                  })}
                  error={errors.sellingPrice?.message}
                />
            

            
            <FormInput
                label="Default Stock"
                type="number"
                placeholder="Enter stock for all variants"
                {...register("stock", {
                  required:"Default stock is required",
                  min: {
                    value: 0,
                    message: "Stock cannot be negative",
                  },
                })}
                error={errors.stock?.message}
              />

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

             <div className="mb-4">

              <ProductImageUpload
                  files={files}
                 
               setFiles={setFiles}
                max={5}
                 />

           
            </div>



           <Button type='submit'>
            Add product
           </Button>
           </div>
       </form>
     </div>
    </div>
    
  
   
    </>
  )

}
export default AddProducts
