// import { FiSearch } from "react-icons/fi"


// const SearchBar=()=>{
//   return(
//     <>
//      <div className="relative">
//       <FiSearch className="absolute left text-xl
//       text-gray-600
//   mt-2 ml-1   md:mt-3 md:ml-1 lg:mt-3 lg:ml-1"/>
//       <input type="text" placeholder="Search..." 
//       className="   w-64 md:w-130 lg:w-130
//         h-9 md:h-11  lg:h-11
//           pl-10 pr-4
//           rounded-lg
//          text:sm md:text-xl lg:text-xl

//           border border-gray-300
//           focus:outline-none focus:ring-2 focus:ring-pink-500"/>
//      </div>
//     </>
//   )
// }
// export default SearchBar

import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProducts, setSearchTerm } from "../../Redux/slices/general/productSlice";

const SearchBar = () => {
  const [search, setSearch] = useState("");
     const dispatch= useDispatch()
   const navigate = useNavigate();
   
  // const location = useLocation();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      dispatch(setSearchTerm(search));
    dispatch(getProducts({ search: search })); // navigate with query params

     navigate(`/search?search=${search}`);
    }
  };

  return (
    <div className="relative w-64 md:w-130 lg:w-130">
      <FiSearch className="absolute left-2 top-2 text-gray-600 text-xl" />
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        className="w-full h-9 md:h-11 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
      />
    </div>
  );
};

export default SearchBar;

