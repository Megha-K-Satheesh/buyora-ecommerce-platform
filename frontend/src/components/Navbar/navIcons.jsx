
import { FiHeart, FiShoppingBag, FiUser } from "react-icons/fi";

const NavbarIcons = ()=>{
  return(
    <>
      <div className="flex flex-row h-full">
        <div className=" flex flex-1 flex-col justify-center items-center">
            <FiUser className="text-2xl lg:text-3xl" />
            <span className="text-sm font-medium">
              Profile
            </span>
        </div>
        <div className=" flex flex-1 justify-center items-center flex-col ">
          <FiHeart className="text-2xl  "/>
          <span className="text-sm mt-1 font-medium">
              Wishlist
            </span>
        </div>
        <div className=" flex flex-1 flex-col
        justify-center items-center ">
          <FiShoppingBag className="text-2xl lg:text-3xl "/>
          <span className="text-sm font-medium">
              Bag
            </span>
        </div>
      </div>
    </>
  )
}
export default NavbarIcons
