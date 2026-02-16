import NavbarMenu from "../Navbar/NavbarMenu"
import NavbarIcons from "../Navbar/navIcons"
import SearchBar from "../Navbar/SearchBar"
import Logo from "./Logo"



const Navbar=()=>{
   return(
    <>
     <div className="flex lg:h-[10vh] h-[6vh] mb-16 fixed top-0 left-0 w-full bg-white shadow ">
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
    
    </>
   )
}
export default Navbar
