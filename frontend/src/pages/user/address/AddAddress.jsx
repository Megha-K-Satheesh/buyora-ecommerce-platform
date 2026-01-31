

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import FormCheckbox from "../../../components/ui/FormCheckbox";
import FormInput from "../../../components/ui/FormInput";
import { showError, showSuccess } from "../../../components/ui/Toastify";
import { addAddress } from "../../../Redux/slices/userSlice";

const AddAddress = ({ defaultValues }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const {loading} = useSelector((state)=>state.user)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: defaultValues || {}
  });

  
  const handleCancel = () => {
    navigate("/profile/address");
  };
  const onSubmit = async (data)=>{
    try {
      console.log(data)
      await dispatch(addAddress(data)).unwrap()
         showSuccess("Address added")
     } catch (err) {
        showError(err)
     }
  }
  return (
     <div className="  lg:w-3/5 md:w-3/5       rounded-lg shadow-md bg-white mt-10">

    
        <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center text-gray-700 font-medium  mt-5'>Add Your Address</h1>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4  rounded ">
      
      <FormInput
      required
        label="Full Name"
        placeholder="Enter full name"
        {...register("fullName", { required: "Full name is required" })}
        error={errors.fullName?.message}
      />

     

      <FormInput
      required
        label="House Number"
        placeholder="Enter house number"
        {...register("houseNumber", { required: "House number is required" })}
        error={errors.houseNumber?.message}
      />

      <FormInput
       required
        label="Address Line"
        placeholder="Enter address line"
        {...register("addressLine", { required: "Address Line is required" })}
        error={errors.addressLine?.message}
      />


   <div className="flex ">
     <div className="flex-1 mr-10">

      <FormInput
      
      required
      label="Locality"
      placeholder="Enter locality"
      {...register("locality", { required: "Locality is required" })}
      error={errors.locality?.message}
      />
      </div>
      <div className="flex-1">

      <FormInput
      required
      label="City"
      placeholder="Enter city"
      {...register("city", { required: "City is required" })}
      error={errors.city?.message}
      />
      </div>
      </div>
      
      <div className="flex">
        <div className="flex-1 mr-10">

      <FormInput
      required
      label="Pin Code"
      placeholder="Enter pin code"
      {...register("pinCode", {
        required: "Pin Code is required",
        pattern: { value: /^\d{6}$/, message: "Invalid pin code" }
      })}
      error={errors.pinCode?.message}
      />
      </div>
       <div className="flex-1">

      <FormInput
      required
      label="State"
      placeholder="Enter state"
      {...register("state", { required: "State is required" })}
      error={errors.state?.message}
      />
      </div>

      </div>
      <FormInput
required
        label="Mobile Number"
        placeholder="Enter mobile number"
        {...register("phone", {
          required: "Phone number is required",
          pattern: { value: /^[6-9]\d{9}$/, message: "Invalid mobile number" }
        })}
        error={errors.phone?.message}
        />
      

       <div className="space-y-2">
  <label className="block font-medium">Type of Address</label>

  <div className="flex gap-4">
    <label className="flex items-center">
      <input
        type="radio"
        value="Home"
        {...register("label", { required: "Please select a label" })}
        className="mr-1"
      />
      Home
    </label>

    <label className="flex items-center">
      <input
        type="radio"
        value="Work"
        {...register("label", { required: "Please select a label" })}
        className="mr-1"
      />
      Work
    </label>

    <label className="flex items-center">
      <input
        type="radio"
        value="Other"
        {...register("label", { required: "Please select a label" })}
        className="mr-1"
      />
      Other
    </label>
  </div>

  {errors.label && (
    <p className="text-red-500 text-sm mt-1">{errors.label.message}</p>
  )}
</div>




      <FormCheckbox
        {...register("isDefault")}
        label="Set as default address"
        error={errors.isDefault?.message}
        />

     
      {/* Buttons */}
      <div className="flex space-x-3 mt-4">
        <Button type="submit" fullWidth >
          Save Address
        </Button>
        <Button type="button" fullWidth variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </form>
   </div>
  );
};

export default AddAddress;


