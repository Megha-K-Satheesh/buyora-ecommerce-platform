
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
const NavbarIcons = ()=>{
  return(
    <>
      <div className="flex flex-row h-full">
       
        
        <ProfileDropdown/>

        <div className=" flex flex-1 justify-center items-center flex-col ">
          <FiHeart className="text-2xl  "/>
          <span className="text-sm mt-1 font-medium">
              Wishlist
            </span>
        </div>
        <div className=" flex flex-1 flex-col
        justify-center items-center ">
          <Link to='/product/cart'>
          <FiShoppingBag className="text-2xl lg:text-3xl "/>
          <span className="text-sm font-medium">
              Bag
            </span>
          </Link>
        </div>
      </div>
    </>
  )
}
export default NavbarIcons
