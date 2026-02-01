import { useEffect } from "react"
import { MdArrowBack } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getUserProfile } from "../../../Redux/slices/userSlice"
import Button from "../../../components/ui/Button"



const Profile = ()=>{
     const {loading,error,user} = useSelector((state)=>state.user)
     const dispatch = useDispatch()
     const navigate = useNavigate()
  useEffect(()=>{
     dispatch(getUserProfile())
  },[dispatch])
   
  return(
    
    // <div className="flex min-h-screen   bg-amber-400">
      
      
      

    
      
        
      
 <div className="">
  <div className=" lg:ml-30 flex overflow-hidden lg:mt-10 ">
    <MdArrowBack  className="lg:hidden text-2xl mt-1" 
     onClick={()=>navigate('/account')}
    />
  <h1 className="text-2xl md:text-2xl  lg:text-2xl font-semibold ml-3">Profile </h1>
  </div>
 
  
  <table className=" lg:w-[80%] w-[80%] mx-auto mt-10   text-xl  md:text-xl lg:text-xl bg-white  p-5 ">
 
    <tbody>
      <tr>
        <td className="  ">Full Name</td>
        <td className=" py-3 pl-20 lg:pl-20">{user?.name || "- not added -"}</td>
      </tr>
      <tr>
        <td className="py-2 ">Mobile Number</td>
        <td className="py-3 pl-20 lg:pl-20">{user?.mobile || "-not added"}</td>
      </tr>
      <tr>
        <td className="py-2  ">Email ID</td>
        <td className="py-3  pl-20 lg:pl-20">{user?.email || "- not added -"}</td>
      </tr>
      <tr>
        <td className="py-2  ">Gender</td>
        <td className="py-3  pl-20 lg:pl-20">{user?.gender || "- not added -"}</td>
      </tr>
      <tr>
        <td className="py-2 ">Date of Birth</td>
        <td className="py-3  pl-20 lg:pl-20">{user?.dob || "- not added -"}</td>
      </tr>
      <tr>
        <td className="py-2 ">Location</td>
        <td className="py-3  pl-20 lg:pl-20">{user?.location || "- not added -"}</td>
      </tr>
      <tr>
        <td className="py-2 ">Alternate Mobile</td>
        <td className="py-3  pl-20 lg:pl-20">{user?.altMobile || "- not added -"}</td>
      </tr>
      {/* <tr>
        <td className="py-2 font-semibold">Hint Name</td>
        <td className="py-2">{user?.hintName || "- not added -"}</td>
      </tr> */}
    </tbody>
  </table>
       <Button variant='primary'  className="mt-10 ml-20  ">
        Edit
       </Button>
      </div>
    // </div>
   
   
  )
}
export default Profile
