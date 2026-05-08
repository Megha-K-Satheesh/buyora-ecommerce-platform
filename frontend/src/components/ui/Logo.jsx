import { Link } from "react-router-dom";
import logo from "../../assets/BLogo.png";

const Logo = ({ className = "" }) => {
  return (
    <div className="sm:h-20 w-auto sm:-mt-1 lg:-mt-7 ">
      <Link to="/">
        <img
          src={logo}
          alt="Buyors Logo"
          className={`w-auto object-contain  ${className}`}
        />
      </Link>
    </div>
  );
};

export default Logo;
