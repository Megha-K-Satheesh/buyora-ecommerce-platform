

import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProducts, setSearchTerm } from "../../Redux/slices/general/productSlice";

const SearchBar = () => {
  const [search, setSearch] = useState("");
     const dispatch= useDispatch()
   const navigate = useNavigate();
   


  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      dispatch(setSearchTerm(search));
     dispatch(getProducts({ search: search }));

     navigate(`/search?search=${search}`);
    }
  };

  return (
    <div className="relative w-64 md:w-130 lg:w-180">
      <FiSearch className="absolute left-2 top-2 lg:top-4 text-gray-500 text-xl" />
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search products here..."
        className="w-full h-9 md:h-11 lg:h-12 pl-10 pr-4 rounded-lg  lg:text-[13px] focus:outline-none focus:ring-1 focus:ring-border-light focus:bg-white bg-gray-100"
      />
    </div>
  );
};

export default SearchBar;

