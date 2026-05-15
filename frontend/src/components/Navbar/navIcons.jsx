


import { FiHeart, FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";

const NavbarIcons = () => {
  const { cartItems } = useSelector((state) => state.cart);

  return (
    <div className="flex items-center gap-2 sm:gap-5 md:gap-6 lg:gap-4 h-full">

      {/* Profile */}
      <div className="flex items-center h-full">
        <ProfileDropdown />
      </div>

      {/* Wishlist */}
      <Link to="/products/wishlist" className="flex flex-col items-center justify-center h-full">
        <FiHeart className="text-lg sm:text-xl md:text-2xl  lg:mt-3" />
        <span className="hidden lg:block text-xs md:text-sm font-medium">
          Wishlist
        </span>
      </Link>

      {/* Cart */}
      <Link
        to="/product/cart"
        className="relative flex flex-col items-center justify-center h-full"
      >
        <FiShoppingBag className="text-lg lg:mt-2 sm:text-xl md:text-2xl lg:text-3xl" />

         {cartItems.length > 0 && (
         <span className="absolute -top-1 mt-6 lg:-right-2 lg:-top-4  -right-2 md:-top-2 md:-right-3 bg-red-500 text-white text-[7px] md:text-xs font-bold w-3 h-3 md:w-5 md:h-5 flex items-center justify-center rounded-full">
            {cartItems.length}
          </span>
         )} 

        <span className="hidden lg:block text-xs md:text-sm font-medium">
          Bag
        </span>
      </Link>

    </div>
  );
};

export default NavbarIcons;
