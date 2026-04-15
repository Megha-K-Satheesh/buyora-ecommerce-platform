import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import FormInput from "../../../components/ui/FormInput";
import { showError, showSuccess } from "../../../components/ui/Toastify";
import { getUserProfile, updateUserProfile } from "../../../Redux/slices/userSlice";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

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
    <div className="lg:w-3/5 md:w-3/5 bg-white lg:ml-40 lg:mt-10 mb-20 px-20 rounded-lg">
      <h1 className="text-2xl font-medium mt-8 ml-10">
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
          {...register("email", { required: "Email is required" })}
          error={errors.email?.message}
        />

        <FormInput
          label="Mobile Number"
          {...register("mobile")}
          error={errors.mobile?.message}
        />

       <div className="space-y-2">
  <label className="block font-medium">Gender</label>

  <div className="flex gap-4">
    <label className="flex items-center">
      <input
        type="radio"
        value="MALE"
        {...register("gender")}
        className="mr-1"
      />
      Male
    </label>

    <label className="flex items-center">
      <input
        type="radio"
        value="FEMALE"
        {...register("gender")}
        className="mr-1"
      />
      Female
    </label>

    <label className="flex items-center">
      <input
        type="radio"
        value="OTHER"
        {...register("gender")}
        className="mr-1"
      />
      Other
    </label>
  </div>
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
          <Button type="submit" fullWidth>
            Save Changes
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
  );
};

export default EditProfile;
