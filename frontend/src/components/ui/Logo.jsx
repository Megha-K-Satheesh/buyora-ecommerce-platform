
import logo from "../../assets/BuyoraLogo.png";


const Logo = ({  className="" }) => {


  return (
    <div className="h-40 
     xl:-mb-5
      xl:-mt-10  lg:-mb-5 -mb-15
      lg:-mt-10 ">
      <img
        src={logo}
        alt="Buyors Logo"
        className={` h-40 sm:h-40 md:h-50 lg:h-60 xl:h-60 w-auto ${className} `}
      />

      
    </div>
  )
}

export default Logo
