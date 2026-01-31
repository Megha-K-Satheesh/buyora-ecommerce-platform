import { Outlet } from "react-router-dom";
import Footer from "../components/ui/Footer";
import Navbar from "../components/ui/Navbar";
import Sidebar from "../components/ui/Sidebar";

const ProfileLayout = () => {
  return (
    <> 
    <div className=" flex min-h-screen  flex-col ">
      <Navbar/>
      <div className="flex flex-1 max-h-full  mt-20">
       
        <Sidebar   />

      
        <div className="flex-1 flex bg-white p-6 justify-center ">
          <Outlet />
        </div>

      </div>
      <Footer/>
    </div>
    </>
  );
};

export default ProfileLayout;
