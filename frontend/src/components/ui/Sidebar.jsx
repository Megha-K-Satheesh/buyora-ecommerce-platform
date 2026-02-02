import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { Link } from 'react-router-dom';

import { BiImage } from "react-icons/bi";
import { FiBox, FiHome, FiLayers, FiLogOut, FiShoppingCart, FiUsers } from "react-icons/fi";
import { MdLocalOffer, MdOutlineBarChart } from "react-icons/md";



const menuItems = [
  {
    icon: <FiHome className="text-gray-600 text-xl lg:text-3xl" />,
    label: "Dashboard",
    path: "dashboard",
  },
  {
    icon: <FiBox className="text-gray-600  text-xl lg:text-3xl" />,
    label: "Products",
    path: "products",
  },
  {
    icon: <FiLayers className="text-gray-600  text-xl lg:text-3xl" />,
    label: "Categories",
    path: "categories",
  },
  {
    icon: <FiShoppingCart className="text-gray-600  text-xl lg:text-3xl" />,
    label: "Orders",
    path: "orders",
  },
  {
    icon: <MdLocalOffer className="text-gray-600  text-xl lg:text-3xl" />,
    label: "Coupons",
    path: "coupons",
  },
  {
    icon: <FiUsers className="text-gray-600  text-xl lg:text-3xl" />,
    label: "Users",
    path: "users",
  },
  {
    icon: <BiImage className="text-gray-600  text-xl lg:text-3xl" />,
    label: "Banners",
    path: "banners",
  },
  {
    icon: <MdOutlineBarChart className="text-black text-xl lg:text-3xl" />,
    label: "Sales Report",
    path: "sales-report",
  },
  {
    icon: <FiLogOut className="text-black text-xl lg:text-3xl" />,
    label: "Logout",
    path: "logout",
  },
];

const Sidebar=()=> {

  const [open,setOpen] = useState(true)
  return (
    
    <>
    <div className={`min-h-screen  flex flex-col duration-500 bg-white 
     ${open ? 'lg:w-80' : 'lg:0'}
      lg:w-20 w-13 mt-`}>
      <div className="px-3 py-2 h-20 mt-1  flex justify-between items-center 
      
      ">
       
          <h1 className={`${open?"block":"hidden"} lg:text-6xl text-2xl font-bold  text-pink-600 ml-5 `}>B</h1>
        <AiOutlineMenu size={34}  className={`duration-500 cursor-pointer text-gray-600  ${open && 'rotate-180'} hidden  md:hidden lg:block`} onClick={()=>setOpen(!open)}/>
{/* 
          <BiHome  className="text-white text-xl sm:text-lg md:text-xl lg:text-2xl block lg:hidden md:block"/> */}
      </div>
      <div className=" mt-10">

      <ul className="flex-1 ">
           {

            menuItems.map((item,index)=>{

              return (
                <Link to={item.path} key={index}>
                <li  className="lg:px-3 lg:py-2 my-4 mx-5  hover:bg-pink-300 rounded-md duration-300 cursor-pointer flex gap-2 items-center relative group">
                  <div className="  ">{item.icon}</div>
                  <p className={`${!open ? 'w-0 translate-x-24' : 'w-full'} duration-500 overflow-hidden text-black  text-2xl  ml-5  hover:bg-pink-300
                  sm:hidden md:hidden lg:block
                  `}>{item.label} </p>


                  <p className={`${open && 'hidden'} absolute left-32 shadow-md rounded-md w-0 p-0 text-black bg-white duration-100 overflow-hidden group-hover:w-fit group-hover:p-2`}>{item.label}</p>
                </li>
                 </Link>
              )
            })
           }
      </ul>
      </div>
     <div>

     </div>
    </div>
    </>
  )
}

export default Sidebar
