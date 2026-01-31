import { FiUser } from "react-icons/fi"
import { Link, useNavigate } from "react-router-dom"




const ProfileDropdown = ()=>{
  const navigate = useNavigate()
  return(
    <>
     <div className=" relative group flex flex-1 flex-col justify-center items-center">
            <FiUser className="text-2xl lg:text-3xl" />
            <span className="text-sm font-medium">
              Profile
            </span>
            {/* DropDownmenu */}
            <div className="absolute
              bg-white
             opacity-0 invisible
            group-hover:opacity-100
             group-hover:visible
            top-full -left-10 mt-2 shadow-lg w-80 
            transform-all duration-200
            ">
                     <div className="shadow-sm px-10 py-5  text-xl"
                     onClick={()=>navigate("/account")}
                     >
                      
                      Hello Buyora User
                      
                     </div>
                    <ul className="flex flex-col py-2 pl-6 text-lg text-gray-600
                    
                    ">
                    <li  className="px-4 py-2
                                 hover:text-xl
                                 hover:text-black
                                    transform-all duration-200
                                 ">
                      <Link to="/">Orders</Link>
                    </li>
                    <li  className="px-4 py-2
                                 hover:text-xl
                                 hover:text-black
                                    transform-all duration-200
                                 ">
                      <Link to="/">Wishlist</Link>
                    </li>
                    <li  className="px-4 py-2
                                 hover:text-xl
                                 hover:text-black
                                    transform-all duration-200
                                 ">
                      <Link to="/">Contact Us</Link>
                    </li>
                    <li  className="px-4 py-2
                                 hover:text-xl
                                 hover:text-black
                                    transform-all duration-200
                                 ">
                      <Link to="/">Copuon</Link>
                    </li>
                    <li  className="px-4 py-2
                                 hover:text-xl
                                 hover:text-black
                                    transform-all duration-200
                                 ">
                      <Link to="/">Walet</Link>
                    </li>
                   
                   
                                 <hr className="mx-3 text-gray-300"/>
                    <li className="px-4 py-2
                                 hover:text-xl
                                 hover:text-black
                                    transform-all duration-200
                                 ">Logout</li>
                    
                   
                  </ul>
            </div>
        </div>
    </>
  )
}
export default ProfileDropdown
