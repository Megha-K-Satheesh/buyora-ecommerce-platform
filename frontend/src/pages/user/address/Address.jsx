



import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import { showError, showSuccess } from "../../../components/ui/Toastify";
import { deleteAddress, getAddresses } from "../../../Redux/slices/userSlice";

import { MdArrowBack } from "react-icons/md";
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
      navigate(`/account/address/edit-address/${addressId}`)
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
       <>
          <div className="flex flex-col lg:flex-row  md:flex-row justify-start lg:justify-between w-[78%] mt-5">
            <div   className="flex ">

           <MdArrowBack className="lg:hidden text-2xl mt-1 ml-1" 
               onClick={()=>navigate('/account')}
               />
         <h1 className="text-2xl font-semibold ml-3 md:ml-10 lg:ml-10 mb-8 text-text-primary">My Address </h1>
         
               </div>

           <Button
       variant="text"
       onClick={() => navigate("/account/address/add-address")}
       className=" text-primary flex justify-start ml-5 "
       >
       + Add Address
      </Button>
         </div>
       


       <div className="w-[80%]  ">
      {addresses.length === 0 ? (
        <p> No addresses found</p>
      ) : (
        
        (addresses|| []).map((addr) => (
          <div
          key={addr._id}
          className=" border border-border-soft shadow-lg rounded m-10    px-3 py-2
          sm:px-4 sm:py-3
  md:px-6 md:py-4
  lg:px-8 lg:py-6 flex flex-col text-sm
  md:text-lg "
          >
            <div className="flex text-xl ">
              <div className="bg-bg-main text-text-muted flex-8 ">

                  <p className="text-text-muted py-3"><strong>{addr.fullName}</strong></p>
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
                  <p className="py-3">
                    Mobile:<span className="ml-2"> {addr.phone}
                      </span>
                  </p>
              </div >
               <div className=" flex-1">
               <p className="bg-bg-soft rounded-2xl text-center text-text-muted font-semibold"> 
                  {addr.label}
                </p>
               </div>
            </div>
        
            <div className="mt-5 border-t border-border-light flex ">
               
               <div className="flex-1 flex justify-center border-r border-border-light ">

             <Button  variant='text'
                 onClick={()=>handleEdit(addr._id)}
                 className="text-2xl"
                 >
              EDIT
             </Button>
               </div>
               <div className="flex-1 flex justify-center">

             <Button variant='text'
              onClick={()=>handleDelete(addr._id)}
            
              >
              REMOVE
             </Button>
               </div>
            </div>
          </div>
        ))
      )}
     
    </div>
   
    </>
  )
}
export default Address
