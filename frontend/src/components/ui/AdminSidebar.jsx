import { useState } from "react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { IoIosArrowDropright } from "react-icons/io";
const AdminSidebar = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* SIDEBAR */}
      <div
        className={`
          fixed top-0 left-0 min-h-screen
          w-[90%] lg:w-[20%]
          bg-gray-900 text-white
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative
          z-40
        `}
      >
        {/* TOGGLE ICON (mobile only, INSIDE sidebar) */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden absolute -right-2 top-4 p-2 rounded-full z-50"
        >
          {open ? (
            <FaArrowAltCircleLeft size={24} />
          ) : (
            <FaArrowAltCircleRight size={24} />
          )}
        </button>
      )}
        {/* MENU */}
        <ul className="p-4 space-y-4 mt-10">
          <li>DASHBOARD</li>
          <li>ORDERS</li>
          <li>PRODUCTS</li>
          <li>USERS</li>
          <li>SETTINGS</li>
        </ul>
      </div>

     

          {!open && (
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden fixed top-4 -left-4 z-50  p-2 rounded-full"
        >
          <IoIosArrowDropright size={24} />
        </button>
    </>
  )
}

export default AdminSidebar


