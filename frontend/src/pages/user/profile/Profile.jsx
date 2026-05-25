





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
 <div className="">
  <div className=" lg:ml-30 flex overflow-hidden lg:mt-10 ">
    <MdArrowBack  className="lg:hidden text-2xl mt-1" 
     onClick={()=>navigate('/account')}
    />
  <h1 className="text-2xl md:text-2xl  lg:text-2xl font-semibold ml-3 text-text-primary">Profile </h1>
  </div>
 
  <table className=" lg:w-[80%] w-[80%] mx-auto mt-10   text-xs  md:text-xl lg:text-xl bg-bg-main  p-5 ">
    <tbody>
      <tr>
        <td className="text-text-secondary">Full Name</td>
        <td className=" py-3 pl-20 lg:pl-20 text-text-primary">{user?.name || "- not added -"}</td>
      </tr>
      <tr>
        <td className="py-2 text-text-secondary">Mobile Number</td>
        <td className="py-3 pl-20 lg:pl-20 text-text-primary">{user?.mobile || "-not added"}</td>
      </tr>
      <tr>
        <td className="py-2 text-text-secondary">Email ID</td>
        <td className="py-3  pl-20 lg:pl-20 text-text-primary">{user?.email || "- not added -"}</td>
      </tr>
      <tr>
        <td className="py-2 text-text-secondary">Gender</td>
        <td className="py-3  pl-20 lg:pl-20 text-text-primary">{user?.gender || "- not added -"}</td>
      </tr>
      <tr>
        <td className="py-2 text-text-secondary">Date of Birth</td>
        <td className="py-3  pl-20 lg:pl-20 text-text-primary">{user?.dob ? new Date(user.dob).toLocaleDateString("en-GB") : "- not added -"}</td>
      </tr>
      <tr>
        <td className="py-2 text-text-secondary">Location</td>
        <td className="py-3  pl-20 lg:pl-20 text-text-primary">{user?.location || "- not added -"}</td>
      </tr>
      <tr>
        <td className="py-2 text-text-secondary">Alternate Mobile</td>
        <td className="py-3  pl-20 lg:pl-20 text-text-primary">{user?.altMobile || "- not added -"}</td>
      </tr>
    </tbody>
  </table>
       <Button variant='primary'  className="mt-10 ml-20 " onClick={()=>navigate("/account/profile/edit-profile")}>
        Edit
       </Button>
      </div>
  )
}
export default Profile



