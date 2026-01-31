import { NavLink } from "react-router-dom"



const SideMenu = ()=>{
  // const linkStyle = ()=>(
  //    `my-20`
  // )
  const linkClass = ({isActive})=>(
    `  text-xl   hover:text-pink-600   transition
    ${isActive?"text-green-500":""} `
  )
  return(
    <>
      <div className="bg-amber-300 pl-20 lg:w-70 w-full  ">
        <ul className="">
            <li className=" lg:text-xl   text-gray-300  my-4">ACCOUNT</li>
              <li className="my-1 ">
                <NavLink to="profile" className={linkClass}>
                    Profile
                </NavLink>
              </li>
               <li className="my-1">
                <NavLink to="address" className={linkClass}>
                    Address
                </NavLink>
              </li>
              <li className="my-1">
                <NavLink to="change-password" className={linkClass}>
                    Change Password
                </NavLink>
              </li>
            <li className="text-sm lg:text-xl text-gray-300  my-4">SHOPPING</li>
              <li className="my-1">
                <NavLink to="orders" className={linkClass}>
                    Orders
                </NavLink>
              </li>
               <li className="my-1">
                <NavLink to="wishlist" className={linkClass}>
                    Wishlist
                </NavLink>
              </li>
               <li className="my-1">
                <NavLink to="walet" className={linkClass}>
                    Walet
                </NavLink>
              </li>
               <li className="my-1">
                <NavLink to="pcoupons" className={linkClass}>
                    Coupons
                </NavLink>
              </li>


            <hr className=" text-gray-300 -ml-[10]  mt-10"/>
              <li>
                <button
                  
                  className="block w-full text-left  py-3 rounded-lg hover:text-red-600 text-lg"
                >
                  Logout
                </button>
             </li>

             <li>
                <button
                  
                  className="block w-full text-left  py-1 rounded-lg  hover:text-red-600 text-lg"   >
                  Delete Account
                </button>
            </li>

        </ul>
      </div>
    </>
  )
}
export default SideMenu
