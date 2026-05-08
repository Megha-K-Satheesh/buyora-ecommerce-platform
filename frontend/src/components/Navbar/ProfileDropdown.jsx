

import { useEffect, useRef, useState } from "react";
import { FiUser } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../Redux/slices/authSlice";
import { getUserProfile } from "../../Redux/slices/userSlice";
import { disconnectSocket } from "../../utils/socket";

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);

  const [open, setOpen] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
      disconnectSocket();
    dispatch(logout());
    navigate("/login");
  };

 
  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

 
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative flex flex-1 flex-col justify-center items-center cursor-pointer"

      onMouseEnter={() => canHover && setOpen(true)}
      onMouseLeave={() => canHover && setOpen(false)}
    >
      {/* Profile Icon */}
      <div
        onClick={() => {
          if (!canHover) setOpen((prev) => !prev);
        }}
        className="flex flex-col lg:mt-2 items-center"
      >
        <FiUser className="sm:text-2xl  lg:text-3xl" />
        <span className="text-sm font-medium hidden lg:block md:block">
          Profile
        </span>
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute top-20 mt-2 bg-bg-main shadow-lg z-50
                     right-2 sm:right-0 w-72 sm:w-80
                     rounded-md overflow-hidden
                     transition-all duration-200"
        >
          {isAuthenticated ? (
            <>
              <div
                className="px-6 py-4 text-lg font-medium cursor-pointer border-b border-border-light"
                onClick={() => {
                  navigate("/account");
                  setOpen(false);
                }}
              >
                Hello {user?.name || "Buyora User"}
              </div>

              <ul className="flex flex-col text-gray-700">
                <li className="px-4 py-2 transition-all duration-200 hover:bg-bg-muted hover:pl-6">
                  <Link to="/all-orders">Orders</Link>
                </li>
                <li className="px-4 py-2 transition-all duration-200 hover:bg-bg-muted hover:pl-6">
                  <Link to="/products/wishlist">Wishlist</Link>
                </li>
                <li className="px-4 py-2 transition-all duration-200 hover:bg-gray-100 hover:pl-6">
                  <Link to="/user-chat">Contact Us</Link>
                </li>
                <li className="px-4 py-2 transition-all duration-200 hover:bg-gray-100 hover:pl-6">
                  <Link to="/account/user-coupons">Coupon</Link>
                </li>
                <li className="px-4 py-2 transition-all duration-200 hover:bg-gray-100 hover:pl-6">
                  <Link to="/account/wallet">Wallet</Link>
                </li>

                <hr className="mx-3 text-gray-300" />

                <li
                  className="px-4 py-2 transition-all duration-200 hover:bg-gray-100 hover:pl-6 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </>
          ) : (
            <div className="px-6 py-4 text-center">
              <Link
                to="/login"
                className="text-pink-500 font-medium hover:underline text-lg"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
