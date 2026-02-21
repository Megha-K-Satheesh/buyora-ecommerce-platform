import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useMatch } from 'react-router-dom';
import Footer from '../components/ui/Footer';
import Navbar from '../components/ui/Navbar';
import SideMenu from '../components/ui/SideMenu';
import AccountHaad from '../components/user/AccountHead';
import { getUserProfile } from '../Redux/slices/userSlice';
const ProfileLayout = () => {

  const isAccountRoot = useMatch('/account/*')
  const isAccountHome = useMatch('/account')
    const {loading} = useSelector(state=>state.auth)

     const dispatch = useDispatch()
     useEffect(()=>{
        console.log("ProfileLayout mounted");
      dispatch(getUserProfile())
     },[dispatch])

     if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  return (
    <> 
    <div className='hidden md:block lg:block '>
     <Navbar/>
    </div>
      
    <div className=" min-h-screen   md:mt-22 lg:mt-22">

  <div className="hidden lg:block">

     {isAccountRoot && (<>

      
      <div className=' h-[10vh] lg:h-[15vh]   lg:mx-[10%]  border-b border-gray-200 '>
        <AccountHaad/>
      </div> 
      <div className=' flex min-h-screen '>
           {/* sideMenu */}
          <div className='flex-1   flex justify-end'>
             <SideMenu/>
          </div>
          <div className='lg:flex  lg:flex-3  lg:flex-col hidden  '>

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
