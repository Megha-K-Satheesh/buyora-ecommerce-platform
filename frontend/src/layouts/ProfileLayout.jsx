import { Outlet, useMatch } from 'react-router-dom';
import Footer from '../components/ui/Footer';
import Navbar from '../components/ui/Navbar';
import SideMenu from '../components/ui/SideMenu';
import AccountHaad from '../components/user/AccountHead';
const ProfileLayout = () => {

  const isAccountRoot = useMatch('/account/*')
  const isAccountHome = useMatch('/account')
  
  return (
    <> 
    <div className='hidden md:block lg:block '>
     <Navbar/>
    </div>
      
    <div className=" min-h-screen   bg-amber-200 md:mt-22 lg:mt-22">

  <div className="hidden lg:block">

     {isAccountRoot && (<>

      
      <div className=' h-[10] lg:h-[15vh]  bg-amber-700 lg:mx-[10%] '>
        <AccountHaad/>
      </div> 
      <div className=' flex min-h-screen bg-amber-500'>
           {/* sideMenu */}
          <div className='flex-1  bg-red-100 flex justify-end'>
             <SideMenu/>
          </div>
          <div className='lg:flex  lg:flex-3  lg:flex-col hidden bg-red-200 '>

                <Outlet/>
               

          </div>
      </div> 

     </>
     )}
     </div>

      
       <div className="lg:hidden">
          {/* Account home */}
          {isAccountHome && (
            <>
              <AccountHaad />
              <SideMenu />
            </>
          )}

       
          {!isAccountHome && (
            <div className="p-4">
              <Outlet />
            </div>
          )}
        </div>

     {/* {!isAccountHome && (
      <div className='lg:hidden p-4 '>
        <Outlet/>
      </div>
     )} */}



    </div>
    <Footer/>
    </>
  );
};

export default ProfileLayout;
