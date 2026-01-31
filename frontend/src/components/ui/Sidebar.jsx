import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { BiHome } from "react-icons/bi";
import { FiLock, FiMapPin, FiUser } from "react-icons/fi";
import { Link } from 'react-router-dom';
const menuItems =[
  {
    icons:<FiUser className="text-white text-xl sm:text-lg md:text-xl lg:text-2xl"/>
    ,lable:"Profile"
    ,path: "/profile",
  },
  {
    icons:<FiMapPin className="text-white text-xl sm:text-lg md:text-xl lg:text-2xl"/>
    ,lable:"Address"
    ,path: "/profile/address",
  },
  {
    icons:<FiLock className="text-white text-xl sm:text-lg md:text-xl lg:text-2xl"/>
    ,lable:"Password"
    ,path: "/profile/change-password",
  }


]
const Sidebar=()=> {

  const [open,setOpen] = useState(true)
  return (
    
    <>
    <div className={`min-h-screen  flex flex-col duration-500  bg-black 
     ${open ? 'lg:w-70' : 'lg:w-20'}
      w-16 mt-`}>
      <div className="px-3 py-2 h-20 mt-1  
      
      ">
       
        <AiOutlineMenu size={34} color="white" className={`duration-500 cursor-pointer ${open && 'rotate-180'} hidden  md:hidden lg:block`} onClick={()=>setOpen(!open)}/>

          <BiHome  className="text-white text-xl sm:text-lg md:text-xl lg:text-2xl block lg:hidden md:block"/>
      </div>
      <ul className="flex-1">
           {

            menuItems.map((item,index)=>{

              return (
                <Link to={item.path} key={index}>
                <li  className="px-3 py-2 my-4  hover:bg-amber-950 rounded-md duration-300 cursor-pointer flex gap-2 items-center relative group">
                  <div className=" ">{item.icons}</div>
                  <p className={`${!open ? 'w-0 translate-x-24' : 'w-full'} duration-500 overflow-hidden text-white text-xl  ml-5
                  sm:hidden md:hidden lg:block
                  `}>{item.lable} </p>


                  <p className={`${open && 'hidden'} absolute left-32 shadow-md rounded-md w-0 p-0 text-black bg-white duration-100 overflow-hidden group-hover:w-fit group-hover:p-2`}>{item.lable}</p>
                </li>
                 </Link>
              )
            })
           }
      </ul>
     <div>

     </div>
    </div>
    </>
  )
}

export default Sidebar
