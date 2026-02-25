

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import AdminOutletHead from "../../../components/Admin/AdminOutletHead";
import Button from "../../../components/ui/Button";
import FormInput from "../../../components/ui/FormInput";
import { showError, showSuccess } from "../../../components/ui/Toastify";
import { getCategory } from "../../../Redux/slices/admin/categorySlice";
import { addCoupon } from "../../../Redux/slices/admin/couponSlice";

const AddCoupon = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.coupon);
  const { categories } = useSelector((state) => state.category);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      scope: "GLOBAL",
      isActive: true,
      usageLimitPerUser: 1,
      totalUsageLimit: 100,
      discount: { type: "", value: "", maxDiscount: "" },
    },
  });

  const scope = useWatch({ control, name: "scope" });
  const discountType = useWatch({ control, name: "discount.type" });

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  // Recursive hierarchical category options
  const buildCategoryOptions = (cats, prefix = "") =>
    cats.flatMap((cat) => {
      if (!cat || !cat._id) return [];
      return [
        <option key={cat._id} value={cat._id}>
          {prefix + cat.name}
        </option>,
        ...(cat.children ? buildCategoryOptions(cat.children, prefix + " └─ ") : []),
      ];
    });

  const onSubmit = async (data) => {
    try {
      await dispatch(addCoupon(data)).unwrap();
      showSuccess("Coupon Added");
      reset();
    } catch (err) {
      showError(err);
    }
  };

  return (
    <>
      <AdminOutletHead heading={"COUPONS"} />
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
        <h1 className="text-2xl lg:text-3xl text-center text-gray-700 font-medium">
          Add Coupon
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Coupon Code */}
          <FormInput
            label="Coupon Code"
            placeholder="WELCOME10"
            required
            error={errors.code?.message}
            {...register("code", {
              required: "Coupon code is required",
              setValueAs: (value) => value.toUpperCase(),
            })}
          />

          {/* Description */}
          <FormInput
            label="Description"
            placeholder="10% off for first order"
            error={errors.description?.message}
            {...register("description")}
          />

          {/* Scope */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Coupon Scope <span className="text-red-500">*</span>
            </label>
            <select
              {...register("scope", { required: "Scope is required" })}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                errors.scope
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-pink-500"
              }`}
            >
              <option value="GLOBAL">Global</option>
              <option value="CATEGORY">Category</option>
            </select>
            {errors.scope && (
              <p className="text-red-500 text-sm">{errors.scope.message}</p>
            )}
          </div>

          {/* Category Dropdown (if CATEGORY) */}
          {scope === "CATEGORY" && (
            <div className="flex flex-col gap-1 pb-3">
              <label className="text-sm md:text-lg lg:text-lg text-gray-900">
                Select Category
              </label>
              <select
                {...register("applicableCategories", {
                  required: "Please select a category",
                  setValueAs: (val) => (val ? [val] : []), // wrap single category in array
                })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 lg:h-11 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">-- Select Category --</option>
                {buildCategoryOptions(categories)}
              </select>
              {errors.applicableCategories && (
                <p className="text-red-500 text-sm">
                  {errors.applicableCategories.message}
                </p>
              )}
            </div>
          )}

          {/* Discount Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Discount Type <span className="text-red-500">*</span>
            </label>
            <select
              {...register("discount.type", { required: "Discount type is required" })}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                errors.discount?.type
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-pink-500"
              }`}
            >
              <option value="">Select</option>
              <option value="FLAT">Flat</option>
              <option value="PERCENTAGE">Percentage</option>
            </select>
            {errors.discount?.type && (
              <p className="text-red-500 text-sm">{errors.discount?.type.message}</p>
            )}
          </div>

          {/* Discount Value */}
          <FormInput
            label="Discount Value"
            type="number"
            required
            error={errors.discount?.value?.message}
            {...register("discount.value", {
              required: "Discount value is required",
              valueAsNumber: true,
              min: { value: 1, message: "Must be greater than 0" },
            })}
          />

          {/* Max Discount (Only for Percentage) */}
          {discountType === "PERCENTAGE" && (
            <FormInput
              label="Max Discount"
              type="number"
              required
              error={errors.discount?.maxDiscount?.message}
              {...register("discount.maxDiscount", {
                required: "Max discount required for percentage",
                valueAsNumber: true,
                min: { value: 1, message: "Must be greater than 0" },
              })}
            />
          )}

          {/* Minimum Order Amount */}
          <FormInput
            label="Minimum Order Amount"
            type="number"
            error={errors.minOrderAmount?.message}
            {...register("minOrderAmount", {
              valueAsNumber: true,
              min: { value: 0, message: "Cannot be negative" },
            })}
          />

          {/* Usage Limits */}
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Usage Limit Per User"
              type="number"
              error={errors.usageLimitPerUser?.message}
              {...register("usageLimitPerUser", {
                valueAsNumber: true,
                min: { value: 1, message: "Must be at least 1" },
              })}
            />
            <FormInput
              label="Total Usage Limit"
              type="number"
              error={errors.totalUsageLimit?.message}
              {...register("totalUsageLimit", {
                valueAsNumber: true,
                min: { value: 1, message: "Must be at least 1" },
              })}
            />
          </div>

          {/* Valid Dates */}
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Valid From"
              type="date"
              required
              error={errors.validFrom?.message}
              {...register("validFrom", {
                required: "Valid From date required",
              })}
            />
            <FormInput
              label="Valid Till"
              type="date"
              required
              error={errors.validTill?.message}
              {...register("validTill", {
                required: "Valid Till date required",
                validate: (value, formValues) =>
                  new Date(value) > new Date(formValues.validFrom) ||
                  "Valid Till must be after Valid From",
              })}
            />
          </div>

          {/* First Order Only */}
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("isFirstOrderOnly")} className="h-4 w-4" />
            <label>First Order Only</label>
          </div>

          {/* Active */}
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("isActive")} className="h-4 w-4" />
            <label>Active</label>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            {loading ? "Adding..." : "Create Coupon"}
          </Button>
        </form>
      </div>
    </>
  );
};

export default AddCoupon;
