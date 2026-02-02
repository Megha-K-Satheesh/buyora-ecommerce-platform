


const AdminOutletHead = ({heading})=>{
  return(
    <>
     <div>
       <div className="lg:h-[10vh] h-[5vh] bg-white flex justify-between px-10 items-center ">

         <h1 className="lg:text-4xl text-xl">{heading}</h1>
         <h1>ADMIN</h1>
       </div>
    </div>
    </>
  )
}
export default AdminOutletHead
