import { useState } from "react"
import { FiMenu, FiX } from "react-icons/fi"
import { Link } from "react-router-dom"
import MobileNavbarMenu from "../Navbar/MobileNavMenu"
import NavbarMenu from "../Navbar/NavbarMenu"
import NavbarIcons from "../Navbar/navIcons"
import SearchBar from "../Navbar/SearchBar"

const Navbar=()=>{

   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   return(
    <>
     <div className="flex lg:h-[10vh] h-[9vh] mb-16 fixed top-0 left-0 w-full bg-white shadow z-50 gap-1">

          <div className="lg:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <FiX className="w-6 h-6  text-gray-800" />
            ) : (
              <FiMenu className="mt-5 md:mt-8 sm:mt7 ml-2 w-6 md:w-8 h-8  text-gray-500" />
            )}
          </button>
        </div>
          
       
        <div className="flex-1 flex items-center justify-center">
  <span
    className="
      font-serif font-extrabold
      text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl
      bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500
      bg-clip-text text-transparent
      tracking-wide
    "
  >
    <Link to="/">
    B
    </Link>
  </span>
</div>
        <div className="lg:flex-5  hidden lg:block md:hidden">

          <NavbarMenu/>
        </div>
        <div className="lg:flex-4 flex-3 flex items-center justify-center ">
          <SearchBar/>
        </div>
        <div className="flex-2  lg:ml-4  ">

          <NavbarIcons/>
        </div>
        
     </div>
     {mobileMenuOpen && <MobileNavbarMenu closeMenu={() => setMobileMenuOpen(false)} />}
    </>
   )
}
export default Navbar


