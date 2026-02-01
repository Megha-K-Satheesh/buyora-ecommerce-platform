

 import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AccountHaad = ()=>{
  const navigate = useNavigate()
  return(
    <>
      <div className="flex  pt-10 " >
        {/* <FaUserCircle size={40} /> */}
        <FaArrowLeft  className=" block lg:hidden text-2xl cursor-pointer   ml-5 mt-2"
         onClick={()=>navigate('/')}
        />
        <div className=" ml-5 lg:ml-20 pb-5" >

       <h1 className="font-semibold text-2xl">Account</h1> 
        <p className="text-xl font-light">Buyora User</p>
        </div>
        
      </div>
    </>
  )
}
export default AccountHaad
