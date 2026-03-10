import Navbar from "../components/ui/Navbar"
import WishlistPage from "../pages/user/wishlist/WishlistPage"



const WishlistLayout =()=>{
  return(
    <>
     <Navbar/>
    <div className="mt-25 px-10">
     <h1 className="text-3xl py-10">MY Wishlist</h1>
    <WishlistPage/>
    </div>
    </>
  )
}
export default WishlistLayout
