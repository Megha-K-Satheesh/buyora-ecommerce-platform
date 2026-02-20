import { useState } from "react"
import { FiMenu, FiX } from "react-icons/fi"
import NavbarMenu from "../Navbar/NavbarMenu"
import NavbarIcons from "../Navbar/navIcons"
import SearchBar from "../Navbar/SearchBar"
import Logo from "./Logo"
import MobileNavbarMenu from "../Navbar/MobileNavMenu"


const Navbar=()=>{

   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   return(
    <>
     <div className="flex lg:h-[10vh] h-[6vh] mb-16 fixed top-0 left-0 w-full bg-white shadow ">

           <div className="lg:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <FiX className="w-6 h-6 text-gray-800" />
            ) : (
              <FiMenu className="w-6 h-6 text-gray-800" />
            )}
          </button>
        </div>
          
        <div className="flex-1 ">
          <Logo/>
        </div>
        <div className="lg:flex-5  hidden lg:block md:block">

          <NavbarMenu/>
        </div>
        <div className="lg:flex-4 flex-3 flex items-center justify-center ">
          <SearchBar/>
        </div>
        <div className="flex-2 ">

          <NavbarIcons/>
        </div>
        
     </div>
     {mobileMenuOpen && <MobileNavbarMenu closeMenu={() => setMobileMenuOpen(false)} />}
    </>
   )
}
export default Navbar
