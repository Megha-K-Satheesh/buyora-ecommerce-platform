
import logo from "../../assets/BLogo.png";


const Logo = ({  className="" }) => {


  return (
    <div className=" h-full
     ">
      <img
        src={logo}
        alt="Buyors Logo"
        className={`   h-full w-full object-contain 
          
          
          ${className} `}
      />

      
    </div>
  )
}

export default Logo
