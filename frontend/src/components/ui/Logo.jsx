import { Link } from "react-router-dom";
import logo from "../../assets/BLogo.png";

const Logo = ({ className = "" }) => {
  return (
    <div className="h-full">
      <Link to="/">
        <img
          src={logo}
          alt="Buyors Logo"
          className={`h-full w-full object-contain ${className}`}
        />
      </Link>
    </div>
  );
};

export default Logo;
