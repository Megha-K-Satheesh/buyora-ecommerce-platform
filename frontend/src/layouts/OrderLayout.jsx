import Navbar from "../components/ui/Navbar"
import AllOrdersPage from "../pages/user/order/AllOrderPage"


const NavbarOrderLayout = ()=>{
  return(
    <>
    <Navbar/>
    <div className="mt-25">

    <AllOrdersPage/>
    </div>
    </>
  )
}

export default NavbarOrderLayout
