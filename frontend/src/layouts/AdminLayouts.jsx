import { Outlet } from "react-router-dom"
import Footer from "../components/ui/Footer"
import Sidebar from "../components/ui/Sidebar"




const AdminLayouts = ()=>{
 
   return(
    <>
       
     <div className="flex min-h-screen  bg-amber-600 ">
        <div className="flex">
          <Sidebar />
          </div>
        <div className="flex-4 min-h-screen bg-bg-soft">
          
          
          <Outlet/>
          
          </div>
     </div>
     <footer className="bg-black w-full">

     <Footer/>
     </footer>
    </>
   )
}
export default AdminLayouts

