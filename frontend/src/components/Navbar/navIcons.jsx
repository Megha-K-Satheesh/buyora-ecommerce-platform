
// import { FiHeart, FiShoppingBag } from "react-icons/fi";
// import { Link } from "react-router-dom";
// import ProfileDropdown from "./ProfileDropdown";
// const NavbarIcons = ()=>{
//   return(
//     <>
//       <div className="flex flex-row h-full">
       
        
//         <ProfileDropdown/>

//         <div className=" flex flex-1 justify-center items-center flex-col ">
//           <FiHeart className="text-2xl  "/>
//           <span className="text-sm mt-1 font-medium">
//               Wishlist
//             </span>
//         </div>
//         <div className=" flex flex-1 flex-col
//         justify-center items-center ">
//           <Link to='/product/cart'>
//           <FiShoppingBag className="text-2xl lg:text-3xl "/>
//           <span className="text-sm font-medium">
//               Bag
//             </span>
//           </Link>
//         </div>
//       </div>
//     </>
//   )
// }
// export default NavbarIcons



import { FiHeart, FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";

const NavbarIcons = () => {

 
  const { cartItems } = useSelector((state) => state.cart);

  return (
    <div className="flex flex-row h-full">

      {/* Profile */}
      <ProfileDropdown />

  


      <Link to="/products/wishlist">
      <div className="flex flex-1 justify-center items-center mt-5 flex-col cursor-pointer ">
        <FiHeart className="text-2xl" />
        <span className="text-sm mt-1 font-medium">
          Wishlist
        </span>
      </div>
    </Link>

      {/* Bag */}
      <div className="flex flex-1 flex-col justify-center items-center">
        <Link
          to="/product/cart"
          className="relative flex flex-col items-center"
        >
          {/* Bag Icon */}
          <FiShoppingBag className="text-2xl lg:text-3xl" />

          {/* Cart Badge */}
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cartItems.length}
            </span>
          )}

          {/* Label */}
          <span className="text-sm font-medium">
            Bag
          </span>
        </Link>
      </div>

    </div>
  );
};

export default NavbarIcons;
