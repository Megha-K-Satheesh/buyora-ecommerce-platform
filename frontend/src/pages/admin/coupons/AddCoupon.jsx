




import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate()

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
      navigate("/admin-dashboard/coupons")
      reset();
    } catch (err) {
      showError(err);
    }
  };

  return (
    <>
      <AdminOutletHead heading={"COUPONS"} />

      <div className="max-w-2xl mx-auto p-6 bg-bg-main shadow-lg rounded-lg mt-10 border border-border-light">
        <h1 className="text-2xl lg:text-3xl text-center text-text-secondary font-medium">
          Add Coupon
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

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

          <FormInput
            label="Description"
            placeholder="10% off for first order"
            error={errors.description?.message}
            {...register("description")}
          />

          <div>
            <label className="block text-sm font-medium mb-1 text-text-primary">
              Coupon Scope <span className="text-danger">*</span>
            </label>
            <select
              {...register("scope", { required: "Scope is required" })}
              className={`w-full border rounded-md px-3 py-2 text-text-secondary bg-bg-main focus:outline-none focus:ring-2 ${
                errors.scope
                  ? "border-danger focus:ring-danger"
                  : "border-border focus:ring-primary"
              }`}
            >
              <option value="GLOBAL">Global</option>
              <option value="CATEGORY">Category</option>
            </select>
            {errors.scope && (
              <p className="text-danger text-sm">{errors.scope.message}</p>
            )}
          </div>

          {scope === "CATEGORY" && (
            <div className="flex flex-col gap-1 pb-3">
              <label className="text-sm md:text-lg lg:text-lg text-text-primary">
                Select Category
              </label>
              <select
                {...register("applicableCategories", {
                  required: "Please select a category",
                  setValueAs: (val) => (val ? [val] : []),
                })}
                className="w-full border border-border rounded-md px-3 py-2 lg:h-11 text-lg text-text-secondary bg-bg-main focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">-- Select Category --</option>
                {buildCategoryOptions(categories)}
              </select>
              {errors.applicableCategories && (
                <p className="text-danger text-sm">
                  {errors.applicableCategories.message}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1 text-text-primary">
              Discount Type <span className="text-danger">*</span>
            </label>
            <select
              {...register("discount.type", { required: "Discount type is required" })}
              className={`w-full border rounded-md px-3 py-2 text-text-secondary bg-bg-main focus:outline-none focus:ring-2 ${
                errors.discount?.type
                  ? "border-danger focus:ring-danger"
                  : "border-border focus:ring-primary"
              }`}
            >
              <option value="">Select</option>
              <option value="FLAT">Flat</option>
              <option value="PERCENTAGE">Percentage</option>
            </select>
            {errors.discount?.type && (
              <p className="text-danger text-sm">{errors.discount?.type.message}</p>
            )}
          </div>

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

          <FormInput
            label="Minimum Order Amount"
            type="number"
            error={errors.minOrderAmount?.message}
            {...register("minOrderAmount", {
              valueAsNumber: true,
              min: { value: 0, message: "Cannot be negative" },
            })}
          />

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

          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("isFirstOrderOnly")} className="h-4 w-4" />
            <label className="text-text-primary">First Order Only</label>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("isActive")} className="h-4 w-4" />
            <label className="text-text-primary">Active</label>
          </div>

          <Button type="submit" className="w-full">
            {loading ? "Adding..." : "Create Coupon"}
          </Button>
        </form>
      </div>
    </>
  );
};

export default AddCoupon;
