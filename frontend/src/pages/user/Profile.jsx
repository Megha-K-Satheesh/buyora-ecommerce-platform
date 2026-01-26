import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUserProfile } from "../../Redux/slices/userSlice"
import Button from "../../components/ui/Button"



const Profile = ()=>{
     const {loading,error,user} = useSelector((state)=>state.user)
     const dispatch = useDispatch()

  useEffect(()=>{
     dispatch(getUserProfile())
  },[dispatch])
   
  return(
    
    // <div className="flex min-h-screen   bg-amber-400">
      
      
      

    
      
        
      
 <div className=" lg:px-30  text-xl lg:m-20 ">

  <h1 className="text-2xl mb-10  lg:text-4xl font-bold ml-0">Profile Information</h1>
  
  <table className="  table-auto sm:m-0  text-sm sm:text-xs md:text-sm lg:text-xl ">
 
    <tbody>
      <tr>
        <td className="py-2 font-semibold">Full Name</td>
        <td className="py-2 lg:pl-20">{user?.name || "- not added -"}</td>
      </tr>
      <tr>
        <td className="py-2 font-semibold">Mobile Number</td>
        <td className="py-2 lg:pl-20">{user?.mobile || "-not added"}</td>
      </tr>
      <tr>
        <td className="py-2  font-semibold">Email ID</td>
        <td className="py-2 lg:pl-20">{user?.email || "- not added -"}</td>
      </tr>
      <tr>
        <td className="py-2  font-semibold">Gender</td>
        <td className="py-2 lg:pl-20">{user?.gender || "- not added -"}</td>
      </tr>
      <tr>
        <td className="py-2 font-semibold">Date of Birth</td>
        <td className="py-2 lg:pl-20">{user?.dob || "- not added -"}</td>
      </tr>
      <tr>
        <td className="py-2 font-semibold">Location</td>
        <td className="py-2 lg:pl-20">{user?.location || "- not added -"}</td>
      </tr>
      <tr>
        <td className="py-2 font-semibold">Alternate Mobile</td>
        <td className="py-2 lg:pl-20">{user?.altMobile || "- not added -"}</td>
      </tr>
      {/* <tr>
        <td className="py-2 font-semibold">Hint Name</td>
        <td className="py-2">{user?.hintName || "- not added -"}</td>
      </tr> */}
    </tbody>
  </table>
       <Button variant='outline' className="mt-10">
        Edit
       </Button>
      </div>
    // </div>
   
   
  )
}
export default Profile
