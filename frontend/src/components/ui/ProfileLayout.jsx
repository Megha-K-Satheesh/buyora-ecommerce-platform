import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

const ProfileLayout = () => {
  return (
    <> 
    <div className=" flex min-h-screen bg-amber-950 flex-col ">
      
      <div className="flex flex-1 max-h-full bg-amber-500">
       
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
