



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
      <div className="flex flex-1 justify-center items-center mt-5  flex-col cursor-pointer ">
        <FiHeart className="sm:text-2xl mt-1" />
        <span className="text-sm mt-1 font-medium hidden lg:block md:block">
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
          <FiShoppingBag className="sm:text-2xl lg:text-3xl" />

          {/* Cart Badge */}
          {cartItems.length > 0 && (
            <span className="absolute lg:-top-2 lg:-right-3 -top-1 -right-2  bg-danger text-white lg:text-[10px] text-[6px] font-bold lg:w-5 lg:h-5 h-3 w-3 flex items-center justify-center rounded-full">
              {cartItems.length}
            </span>
          )}

          {/* Label */}
          <span className="text-sm font-medium hidden lg:block md:block">
            Bag
          </span>
        </Link>
      </div>

    </div>
  );
};

export default NavbarIcons;



