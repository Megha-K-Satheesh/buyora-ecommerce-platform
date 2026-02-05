import { Outlet } from "react-router-dom"
import Footer from "../components/ui/Footer"
import Sidebar from "../components/ui/Sidebar"




const AdminLayouts = ()=>{
 
   return(
    <>
       
     <div className="flex min-h-screen bg-amber-200">
        <div className="flex bg-amber-500">
          <Sidebar />
          </div>
        <div className="flex-4 min-h-screen bg-pink-50">
          
          
          <Outlet/>
          
          </div>
     </div>
     <Footer/>
    </>
   )
}
export default AdminLayouts
