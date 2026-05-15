// import { Link } from "react-router-dom";
// import logo from "../../assets/BLogo.png";

// const Logo = ({ className = "" }) => {
//   return (
//     <div className="sm:h-20 bg-amber-200   sm:-mt-1 lg:-mt-7 ">
//       <Link to="/">
//         <img
//           src={logo}
//           alt="Buyors Logo"
//           className={`w-auto mt-3 sm:mt-2 md:-mt-2 lg:mt-5
//              object-contain bg-amber-700  ${className}`}
//         />
//       </Link>
//     </div>
//   );
// };

// export default Logo;
import { Link } from "react-router-dom";
import logo from "../../assets/BLogo.png";

const Logo = ({ className = "" }) => {
  return (
    <div className="flex bg-amber-100 items-center justify-center h-16 sm:h-20">
      <Link to="/" className="flex items-center justify-center h-full">
        <img
          src={logo}
          alt="Buyors Logo"
          className={`h-full bg-amber-600   w-auto object-contain ${className}`}
        />
      </Link>
    </div>
  );
};

export default Logo;
