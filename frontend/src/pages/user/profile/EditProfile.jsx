


import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import FormInput from "../../../components/ui/FormInput";
import Navbar from "../../../components/ui/Navbar";
import { showError, showSuccess } from "../../../components/ui/Toastify";
import { getUserProfile, updateUserProfile } from "../../../Redux/slices/userSlice";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user,loading } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "",
      email:"",
      mobile: "",
      gender: "",
      dob: "",
      location: "",
      altMobile: ""
    }
  });

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email:user.email||"",
        mobile: user.mobile || "",
        gender: user.gender || "",
        dob: user.dob || "",
        location: user.location || "",
        altMobile: user.altMobile || ""
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      await dispatch(updateUserProfile(data)).unwrap();
      showSuccess("Profile updated successfully");
      navigate("/account/profile");
    } catch (err) {
      showError(err);
    }
  };

  const handleCancel = () => {
    navigate("/account/profile");
  };

  return (
    <>
    <div className="lg:hidden block ">
      <Navbar/>
    </div>
    <div className="lg:w-3/5 md:w-3/5  bg-bg-main lg:ml-40   mt-25  lg:mt-10 mb-20 lg:px-20 rounded-lg">
      <h1 className="text-2xl font-medium mt-8 ml-10 text-text-primary">
        Edit Profile
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">

        <FormInput
          label="Full Name"
          {...register("name", { required: "Name is required" })}
          error={errors.name?.message}
        />
        <FormInput
          label="Email"
            readOnly
          {...register("email", { required: "Email is required" })}
          error={errors.email?.message}
        />

        <FormInput
          label="Mobile Number"
           {...register("mobile", {
    required: "Mobile number is required",
    pattern: {
      value: /^[6-9]\d{9}$/,
      message: "Enter valid 10-digit mobile number"
    }
  })}
          error={errors.mobile?.message}
        />

      
<div className="space-y-2">
  <label className="block font-medium text-text-primary">
    Gender
  </label>

  <div className="flex gap-4">
    <label className="flex items-center">
      <input
        type="radio"
        value="MALE"
        {...register("gender", {
          required: "Gender is required"
        })}
        className="mr-1"
      />
      Male
    </label>

    <label className="flex items-center">
      <input
        type="radio"
        value="FEMALE"
        {...register("gender", {
          required: "Gender is required"
        })}
        className="mr-1"
      />
      Female
    </label>

    <label className="flex items-center">
      <input
        type="radio"
        value="OTHER"
        {...register("gender", {
          required: "Gender is required"
        })}
        className="mr-1"
      />
      Other
    </label>
  </div>

  {errors.gender && (
    <p className="text-red-500 text-sm">
      {errors.gender.message}
    </p>
  )}
</div>
        <FormInput
          label="Date of Birth"
          type="date"
          {...register("dob")}
        />

        <FormInput
          label="Location"
          {...register("location")}
          
        />

        <FormInput
            
          label="Alternate Mobile"
          {...register("altMobile")}
        />

        <div className="flex gap-3 mt-4">
          <Button
  type="submit"
  fullWidth
  disabled={loading}
>
  {loading ? "Saving..." : "Save Changes"}
</Button>

          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>

      </form>
    </div>
    </>
  );
};

export default EditProfile;
