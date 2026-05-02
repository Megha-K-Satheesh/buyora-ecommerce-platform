



import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { BiImage } from "react-icons/bi";
import { FiBox, FiHome, FiLayers, FiLogOut, FiShoppingCart, FiTag, FiUsers } from "react-icons/fi";
import { MdLocalOffer, MdOutlineBarChart } from "react-icons/md";

import { adminLogout } from "../../redux/slices/adminAuthSlice";
import { clearAdminToken } from "../../utils/authToken";

const menuItems = [
  { icon: <FiHome className="text-xl lg:text-3xl" />, label: "Dashboard", path: "dashboard" },
  { icon: <FiBox className="text-xl lg:text-3xl" />, label: "Products", path: "products" },
  { icon: <FiLayers className="text-xl lg:text-3xl" />, label: "Categories", path: "categories" },
  { icon: <FiShoppingCart className="text-xl lg:text-3xl" />, label: "Orders", path: "orders" },
  { icon: <MdLocalOffer className="text-xl lg:text-3xl" />, label: "Coupons", path: "coupons" },
  { icon: <FiTag className="text-xl lg:text-3xl" />, label: "Brands", path: "brands" },
  { icon: <FiUsers className="text-xl lg:text-3xl" />, label: "Users", path: "users" },
  { icon: <BiImage className="text-xl lg:text-3xl" />, label: "Banners", path: "banners" },
  { icon: <MdOutlineBarChart className="text-xl lg:text-3xl" />, label: "Sales Report", path: "sales-report" },
  { icon: <FiLogOut className="text-xl lg:text-3xl" />, label: "Logout", path: "logout" },
];

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const isActive = (path) => location.pathname.includes(path);
  const isActive = (path) => {
  if (path === "dashboard") {
    return location.pathname === "/admin/dashboard";
  }
  return location.pathname.includes(path);
};

  const handleLogout = () => {
    clearAdminToken();
    dispatch(adminLogout());
    navigate("/admin-login");
  };

  return (
    <div
      className={`min-h-screen flex flex-col duration-500 bg-bg-main border-r border-border
      ${open ? "lg:w-80" : "lg:w-20"} w-13`}
    >
      <div className="px-3 py-2 h-20 mt-1 flex justify-between items-center">
        <h1
          className={`${
            open ? "block" : "hidden"
          } lg:text-4xl text-2xl font-bold text-primary ml-5 `}
        >
          BUYORA
        </h1>

        <AiOutlineMenu
          size={34}
          className={`duration-500 cursor-pointer text-text-secondary ${
            open && "rotate-180"
          } hidden lg:block`}
          onClick={() => setOpen(!open)}
        />
      </div>

      <div className="mt-10">
        <ul className="flex-1">
          {menuItems.map((item, index) => {
            const active = isActive(item.path);

            const base =
              "lg:px-3 lg:py-2 my-4 mx-5 rounded-md duration-300 cursor-pointer flex gap-2 items-center relative group";

            const activeStyle = "bg-primary text-white";
            const normalStyle = "text-text-secondary hover:bg-bg-soft-hover";

            if (item.label === "Logout") {
              return (
                <li
                  key={index}
                  onClick={handleLogout}
                  className={`${base} text-danger hover:bg-danger/10`}
                >
                  <div className={`${active ? "text-white" : ""}`}>
                    {item.icon}
                  </div>

                  <p
                    className={`${
                      !open ? "w-0 translate-x-24" : "w-full"
                    } duration-500 overflow-hidden text-2xl ml-5 ${
                      active ? "text-white" : "text-black"
                    }`}
                  >
                    {item.label}
                  </p>

                  {!open && (
                    <p
                      className={`absolute left-32 shadow-md rounded-md w-0 p-0 bg-white duration-100 overflow-hidden group-hover:w-fit group-hover:p-2 ${
                        active ? "text-white bg-primary" : "text-black"
                      }`}
                    >
                      {item.label}
                    </p>
                  )}
                </li>
              );
            }

            return (
              <Link to={item.path} key={index}>
                <li className={`${base} ${active ? activeStyle : normalStyle}`}>
                  <div className={`${active ? "text-white" : ""}`}>
                    {item.icon}
                  </div>

                  <p
                    className={`${
                      !open ? "w-0 translate-x-24" : "w-full"
                    } duration-500 overflow-hidden text-2xl ml-5 ${
                      active ? "text-white" : "text-black"
                    }`}
                  >
                    {item.label}
                  </p>

                  {!open && (
                    <p
                      className={`absolute left-32 shadow-md rounded-md w-0 p-0 bg-white duration-100 overflow-hidden group-hover:w-fit group-hover:p-2 ${
                        active ? "text-white bg-primary" : "text-black"
                      }`}
                    >
                      {item.label}
                    </p>
                  )}
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
