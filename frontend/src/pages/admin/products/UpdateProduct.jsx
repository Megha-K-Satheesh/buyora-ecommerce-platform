import { useEffect, useMemo, useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import Select from "react-select"

import AdminOutletHead from "../../../components/Admin/AdminOutletHead"
import CategoryAttributeSelect from "../../../components/Admin/CategoryAttributeSelect"
import ProductImageUpload from "../../../components/Admin/ProductImageUpload"
import Button from "../../../components/ui/Button"
import FormInput from "../../../components/ui/FormInput"
import { showError, showSuccess } from "../../../components/ui/Toastify"

import { getBrandsByCategoryId } from "../../../Redux/slices/admin/brandSlice"
import { getCategory } from "../../../Redux/slices/admin/categorySlice"

import { getProductById } from "../../../Redux/slices/general/productSlice"
import { CategoryUtils } from "../../../utils/categoryUtiles"
import { updateProduct } from "../../../Redux/slices/admin/productSlice"

const EditProduct = () => {
  const dispatch = useDispatch()
  const { id } = useParams()

  const { categories } = useSelector((state) => state.category)
  const { brands } = useSelector((state) => state.brand)
 const { product } = useSelector((state) => state.generalProducts)


const [existingImages, setExistingImages] = useState([]);

  const [files, setFiles] = useState([])
useEffect(() => {
  if (product) {
    setExistingImages(product.images || []);
  }
}, [product]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm()

  // Watch category
  const selectedCategoryId = useWatch({
    control,
    name: "category",
  })

  // Get brands for selected category
  const brandsForSelectedCategory = useMemo(() => {
    return CategoryUtils.getBrandsForCategory(
      categories,
      brands,
      selectedCategoryId
    )
  }, [categories, brands, selectedCategoryId])

  // Load categories
  useEffect(() => {
    dispatch(getCategory())
  }, [dispatch])

  // Load product
  useEffect(() => {
    if (id) {
      dispatch(getProductById(id))
    }
  }, [id, dispatch])

  // Load brands when category changes
  useEffect(() => {
    if (selectedCategoryId) {
      dispatch(getBrandsByCategoryId(selectedCategoryId))
    }
  }, [selectedCategoryId, dispatch])

  // Prefill form (EXCEPT brand)
useEffect(() => {
  if (product && categories.length > 0) {
    reset({
      name: product.name ?? "",
      description: product.description ?? "",
      category: product.category?._id ?? "",
      mrp: product.mrp ?? "",
      sellingPrice: product.sellingPrice ?? "",
      stock:  product.variations?.[0]?.stock ?? "",
      status: product.status ?? "active",
      isVisible: product.isVisible ?? false,
      attributes: product.variations ?? [],
    })
  }
}, [product, categories, reset])


  const onSubmit = async (data) => {
    try {
      const formData = new FormData()

      const payload = {
        name: data.name,
        description: data.description,
        brand: data.brand, // brand selected manually
        category: data.category,
        mrp: data.mrp,
        sellingPrice: data.sellingPrice,
        stock: data.stock,
        status: data.status,
        isVisible: data.isVisible,
      }

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value)
        }
      })

      if (data.attributes) {
        formData.append("attributes", JSON.stringify(data.attributes))
      }


       formData.append("existingImages", JSON.stringify(existingImages));
       
      files.forEach((file) => {
        formData.append("images", file)
      })

       await dispatch(updateProduct({ id, formData })).unwrap()

      showSuccess("Product Updated Successfully")

    } catch (error) {
      showError(error)
    }
  }

  return (
    <>
      <AdminOutletHead heading={"EDIT PRODUCT"} />

      <div className="flex justify-center items-start lg:bg-[#FFF1F6] mt-20 min-h-screen">
        <div className="bg-white rounded-2xl lg:w-[40%] w-[90%] mt-10 px-5 py-6">
          <h1 className="text-2xl text-center text-gray-700 font-medium">
            Edit Product
          </h1>

          <form onSubmit={handleSubmit(onSubmit)}>

            <FormInput
              label="Product Name"
              {...register("name", { required: "Product name is required" })}
              error={errors.name?.message}
            />

            <FormInput
              label="Description"
              {...register("description", { required: "Description is required" })}
              error={errors.description?.message}
            />

            <CategoryAttributeSelect
              categories={categories}
              control={control}
              register={register}
              errors={errors}
            />

            {/* BRAND DROPDOWN */}
            <div className="flex flex-col gap-1 pb-3">
              <label className="text-sm md:text-lg text-gray-900">
                Brand
              </label>

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
                    isMulti={false}
                    onChange={(selectedOption) =>
                      field.onChange(selectedOption?.value)
                    }
                    value={
                      brandsForSelectedCategory
                        .filter((b) => b._id === field.value)
                        .map((b) => ({
                          value: b._id,
                          label: b.name,
                        }))
                    }
                    className="basic-single-select"
                    classNamePrefix="select"
                  />
                )}
              />

              {errors.brand && (
                <p className="text-red-600">{errors.brand.message}</p>
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
              existingImages={existingImages}
  setExistingImages={setExistingImages}
              max={5}
            />

            <Button type="submit">Update Product</Button>

          </form>
        </div>
      </div>
    </>
  )
}

export default EditProduct
