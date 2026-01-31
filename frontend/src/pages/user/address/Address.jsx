import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import { showError, showSuccess } from "../../../components/ui/Toastify";
import { deleteAddress, getAddresses } from "../../../Redux/slices/userSlice";

import Swal from "sweetalert2";

const Address =()=>{
  const navigate = useNavigate()
    const dispatch = useDispatch();
  const { addresses, loading, error } = useSelector((state) => state.user);
  const handleDelete = async (addressId) => {
   
      const result = await Swal.fire({
    title: "Are you sure?",
    text: "Do you really want to delete this address?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  });


  
  if (result.isConfirmed) {
    try {
      await dispatch(deleteAddress(addressId)).unwrap();
      showSuccess("Address deleted successfully");
    } catch (err) {
      showError(err);
    }
  }
};


   const handleEdit= (addressId)=>{
      navigate(`/profile/address/edit-address/${addressId}`)
   }

  useEffect(() => {
    dispatch(getAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  if (loading) return <p>Loading addresses...</p>;

  return(
   
       <div className="w-full">
         <h1 className="text-3xl font-bold mb-8">My Address </h1>
         <div className="flex justify-end">

           <Button
       variant='primary'
       onClick={() => navigate("/profile/address/add")}
       className="mb-10 "
       >
        Add Address
      </Button>
         </div>
      {addresses.length === 0 ? (
        <p> No addresses found</p>
      ) : (
        
        (addresses|| []).map((addr) => (
          <div
            key={addr._id}
            className=" border rounded m-10    px-3 py-2
  sm:px-4 sm:py-3
  md:px-6 md:py-4
  lg:px-8 lg:py-6 flex flex-col text-sm
              md:text-lg "
          >
            <div className=" text-xl">
              <p><strong>{addr.fullName}</strong></p>
              <p>
                {addr.houseNumber}
              </p>
              <p>
                 {addr.addressLine}
              </p>
              <p>
                {addr.city} - {addr.pinCode}
              </p>
              <p>
                {addr.state}
              </p>
              <p>
                Mobile:{addr.phone}
              </p>
              
            </div>
        
            <div className="mt-5">
             <Button  variant='text'
                 onClick={()=>handleEdit(addr._id)}
             >
              Edit
             </Button>
             <Button variant='text'
              onClick={()=>handleDelete(addr._id)}
             >
              delete
             </Button>
            </div>
          </div>
        ))
      )}
     
    </div>
   
  )
}
export default Address
