

import { MdArrowBack } from "react-icons/md";

const MobileOutetHead = ({heading })=>{
  return(
    <>
     <div className="flex lg:hidden flex-row">
        <MdArrowBack />
        <h1>{heading}</h1>
     </div>
     
    </>
  )
}
export default MobileOutetHead

