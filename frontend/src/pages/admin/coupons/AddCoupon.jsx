


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

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      scope: "GLOBAL",
      isActive: true,
      usageLimitPerUser: 1,
      totalUsageLimit: 100,
      discount: {
        type: "",
        value: "",
        maxDiscount: "",
      },
    },
  });

  const scope = useWatch({
    control,
    name: "scope",
  });

  const discountType = useWatch({
    control,
    name: "discount.type",
  });

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  const buildCategoryOptions = (
    cats,
    prefix = ""
  ) =>
    cats.flatMap((cat) => {
      if (!cat || !cat._id) return [];

      return [
        <option key={cat._id} value={cat._id}>
          {prefix + cat.name}
        </option>,
        ...(cat.children
          ? buildCategoryOptions(
              cat.children,
              prefix + " └─ "
            )
          : []),
      ];
    });

  const onSubmit = async (data) => {
    try {
      await dispatch(addCoupon(data)).unwrap();

      showSuccess("Coupon Added");

      navigate("/admin-dashboard/coupons");

      reset();
    } catch (err) {
      showError(err);
    }
  };

  const selectClassName = (error) =>
    `w-full h-[52px] rounded-2xl border bg-white px-4 text-sm text-text-secondary outline-none transition-all duration-200 focus:ring-4 ${
      error
        ? "border-danger focus:border-danger focus:ring-danger/10"
        : "border-border-light focus:border-primary focus:ring-primary/10 hover:border-border"
    }`;

  return (
    <>
      <AdminOutletHead heading={"COUPONS"} />

      <div className="min-h-screen bg-gradient-to-b from-bg-soft via-white to-bg-soft px-3 sm:px-5 lg:px-8 py-6 sm:py-8">

        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="mb-8">

            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Create Coupon
            </h1>

            <p className="text-text-muted mt-2 text-sm sm:text-base">
              Create promotional coupons for discounts,
              campaigns, and customer offers.
            </p>

          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 xl:grid-cols-12 gap-6"
          >

            {/* LEFT SECTION */}
            <div className="xl:col-span-8 space-y-6">

              {/* COUPON DETAILS */}
              <div className="bg-white rounded-3xl border border-border-light shadow-sm p-5 sm:p-7">

                <div className="mb-6">

                  <h2 className="text-xl font-semibold text-text-primary">
                    Coupon Details
                  </h2>

                  <p className="text-sm text-text-muted mt-1">
                    Configure the coupon code and
                    promotional description.
                  </p>

                </div>

                <div className="space-y-5">

                  <FormInput
                    label="Coupon Code"
                    placeholder="WELCOME10"
                    required
                    error={errors.code?.message}
                    {...register("code", {
                      required:
                        "Coupon code is required",
                      setValueAs: (value) =>
                        value.toUpperCase(),
                    })}
                  />

                  <FormInput
                    label="Description"
                    placeholder="10% off for first order"
                    error={
                      errors.description?.message
                    }
                    {...register("description")}
                  />

                </div>

              </div>

              {/* SCOPE & CATEGORY */}
              <div className="bg-white rounded-3xl border border-border-light shadow-sm p-5 sm:p-7">

                <div className="mb-6">

                  <h2 className="text-xl font-semibold text-text-primary">
                    Scope & Category
                  </h2>

                  <p className="text-sm text-text-muted mt-1">
                    Define where this coupon can be
                    applied.
                  </p>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                  {/* SCOPE */}
                  <div>

                    <label className="block mb-2 text-sm font-semibold text-text-primary">
                      Coupon Scope
                      <span className="text-danger ml-1">
                        *
                      </span>
                    </label>

                    <select
                      {...register("scope", {
                        required:
                          "Scope is required",
                      })}
                      className={selectClassName(
                        errors.scope
                      )}
                    >
                      <option value="GLOBAL">
                        Global
                      </option>

                      <option value="CATEGORY">
                        Category
                      </option>
                    </select>

                    {errors.scope && (
                      <p className="text-danger text-sm mt-2">
                        {errors.scope.message}
                      </p>
                    )}

                  </div>

                  {/* CATEGORY */}
                  {scope === "CATEGORY" && (
                    <div className="animate-in fade-in duration-200">

                      <label className="block mb-2 text-sm font-semibold text-text-primary">
                        Select Category
                      </label>

                      <select
                        {...register(
                          "applicableCategories",
                          {
                            required:
                              "Please select a category",
                            setValueAs: (val) =>
                              val ? [val] : [],
                          }
                        )}
                        className={selectClassName(
                          errors.applicableCategories
                        )}
                      >
                        <option value="">
                          -- Select Category --
                        </option>

                        {buildCategoryOptions(
                          categories
                        )}
                      </select>

                      {errors.applicableCategories && (
                        <p className="text-danger text-sm mt-2">
                          {
                            errors
                              .applicableCategories
                              .message
                          }
                        </p>
                      )}

                    </div>
                  )}

                </div>

              </div>

              {/* DISCOUNT CONFIGURATION */}
              <div className="bg-white rounded-3xl border border-border-light shadow-sm p-5 sm:p-7">

                <div className="mb-6">

                  <h2 className="text-xl font-semibold text-text-primary">
                    Discount Configuration
                  </h2>

                  <p className="text-sm text-text-muted mt-1">
                    Configure discount type and values.
                  </p>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                  {/* DISCOUNT TYPE */}
                  <div>

                    <label className="block mb-2 text-sm font-semibold text-text-primary">
                      Discount Type
                      <span className="text-danger ml-1">
                        *
                      </span>
                    </label>

                    <select
                      {...register(
                        "discount.type",
                        {
                          required:
                            "Discount type is required",
                        }
                      )}
                      className={selectClassName(
                        errors.discount?.type
                      )}
                    >
                      <option value="">
                        Select Discount Type
                      </option>

                      <option value="FLAT">
                        Flat
                      </option>

                      <option value="PERCENTAGE">
                        Percentage
                      </option>
                    </select>

                    {errors.discount?.type && (
                      <p className="text-danger text-sm mt-2">
                        {
                          errors.discount?.type
                            .message
                        }
                      </p>
                    )}

                  </div>

                  {/* VALUE */}
                  <FormInput
                    label="Discount Value"
                    type="number"
                    placeholder="Enter discount value"
                    required
                    error={
                      errors.discount?.value
                        ?.message
                    }
                    {...register("discount.value", {
                      required:
                        "Discount value is required",
                      valueAsNumber: true,
                      min: {
                        value: 1,
                        message:
                          "Must be greater than 0",
                      },
                    })}
                  />

                </div>

                {/* MAX DISCOUNT */}
                {discountType === "PERCENTAGE" && (
                  <div className="mt-5 animate-in fade-in duration-200">

                    <div className="max-w-md">

                      <FormInput
                        label="Maximum Discount"
                        type="number"
                        placeholder="Enter maximum discount"
                        required
                        error={
                          errors.discount
                            ?.maxDiscount
                            ?.message
                        }
                        {...register(
                          "discount.maxDiscount",
                          {
                            required:
                              "Max discount required for percentage",
                            valueAsNumber: true,
                            min: {
                              value: 1,
                              message:
                                "Must be greater than 0",
                            },
                          }
                        )}
                      />

                    </div>

                  </div>
                )}

                {/* MIN ORDER */}
                <div className="mt-5">

                  <div className="max-w-md">

                    <FormInput
                      label="Minimum Order Amount"
                      type="number"
                      placeholder="Enter minimum order amount"
                      error={
                        errors.minOrderAmount
                          ?.message
                      }
                      {...register(
                        "minOrderAmount",
                        {
                          valueAsNumber: true,
                          min: {
                            value: 0,
                            message:
                              "Cannot be negative",
                          },
                        }
                      )}
                    />

                  </div>

                </div>

              </div>

              {/* USAGE LIMITS */}
              <div className="bg-white rounded-3xl border border-border-light shadow-sm p-5 sm:p-7">

                <div className="mb-6">

                  <h2 className="text-xl font-semibold text-text-primary">
                    Usage Limits
                  </h2>

                  <p className="text-sm text-text-muted mt-1">
                    Control coupon usage restrictions.
                  </p>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <FormInput
                    label="Usage Limit Per User"
                    type="number"
                    placeholder="1"
                    error={
                      errors.usageLimitPerUser
                        ?.message
                    }
                    {...register(
                      "usageLimitPerUser",
                      {
                        valueAsNumber: true,
                        min: {
                          value: 1,
                          message:
                            "Must be at least 1",
                        },
                      }
                    )}
                  />

                  <FormInput
                    label="Total Usage Limit"
                    type="number"
                    placeholder="100"
                    error={
                      errors.totalUsageLimit
                        ?.message
                    }
                    {...register(
                      "totalUsageLimit",
                      {
                        valueAsNumber: true,
                        min: {
                          value: 1,
                          message:
                            "Must be at least 1",
                        },
                      }
                    )}
                  />

                </div>

              </div>

              {/* VALIDITY PERIOD */}
              <div className="bg-white rounded-3xl border border-border-light shadow-sm p-5 sm:p-7">

                <div className="mb-6">

                  <h2 className="text-xl font-semibold text-text-primary">
                    Validity Period
                  </h2>

                  <p className="text-sm text-text-muted mt-1">
                    Set coupon activation and expiry
                    dates.
                  </p>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>

                    <FormInput
                      label="Valid From"
                      type="date"
                      required
                      error={
                        errors.validFrom?.message
                      }
                      {...register("validFrom", {
                        required:
                          "Valid From date required",
                      })}
                    />

                  </div>

                  <div>

                    <FormInput
                      label="Valid Till"
                      type="date"
                      required
                      error={
                        errors.validTill?.message
                      }
                      {...register("validTill", {
                        required:
                          "Valid Till date required",
                        validate: (
                          value,
                          formValues
                        ) =>
                          new Date(value) >
                            new Date(
                              formValues.validFrom
                            ) ||
                          "Valid Till must be after Valid From",
                      })}
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* RIGHT SIDEBAR */}
            <div className="xl:col-span-4">

              <div className="bg-white rounded-3xl border border-border-light shadow-sm p-5 sm:p-7 xl:sticky xl:top-24">

                {/* SETTINGS */}
                <div>

                  <h2 className="text-xl font-semibold text-text-primary">
                    Coupon Settings
                  </h2>

                  <p className="text-sm text-text-muted mt-1">
                    Configure visibility and coupon
                    restrictions.
                  </p>

                </div>

                <div className="space-y-5 mt-8">

                  {/* FIRST ORDER */}
                  <label className="flex items-start gap-4 cursor-pointer group">

                    <input
                      type="checkbox"
                      {...register(
                        "isFirstOrderOnly"
                      )}
                      className="mt-1 h-5 w-5 rounded border-border text-primary focus:ring-primary"
                    />

                    <div>
                      <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                        First Order Only
                      </p>

                      <p className="text-xs text-text-muted mt-1">
                        Restrict this coupon to users
                        placing their first order.
                      </p>
                    </div>

                  </label>

                  {/* ACTIVE */}
                  <label className="flex items-start gap-4 cursor-pointer group">

                    <input
                      type="checkbox"
                      {...register("isActive")}
                      className="mt-1 h-5 w-5 rounded border-border text-primary focus:ring-primary"
                    />

                    <div>
                      <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                        Coupon Active
                      </p>

                      <p className="text-xs text-text-muted mt-1">
                        Enable this coupon immediately
                        after creation.
                      </p>
                    </div>

                  </label>

                </div>

                {/* ACTION */}
                <div className="mt-8 pt-6 border-t border-border-light">

                  <Button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-14 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                      loading
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:-translate-y-0.5"
                    }`}
                  >
                    {loading
                      ? "Creating Coupon..."
                      : "Create Coupon"}
                  </Button>

                </div>

              </div>

            </div>

          </form>

        </div>

      </div>
    </>
  );
};

export default AddCoupon;
