import Navbar from "../components/ui/Navbar"
import WishlistPage from "../pages/user/wishlist/WishlistPage"



const WishlistLayout =()=>{
  return(
    <>
     <Navbar/>
    <div className="lg:mt-25 mt-10 lg:px-10 px-2">
     <h1 className="lg:text-3xl md:text-2xl text-xl py-10">MY Wishlist</h1>
    <WishlistPage/>
    </div>
    </>
  )
}
export default WishlistLayout
