

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
     dispatch(getProducts({ search: search.trim() }));

     navigate(`/search?search=${search}`);
    }
  };

  return (
    <div className="relative w-40 md:w-80 lg:w-100 ">
      <FiSearch className="absolute left-2 md:top-4 top-2 lg:top-4 text-gray-500 lg:text-xl" />
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search products..."
        className="w-full h-8 md:h-11 lg:h-12 pl-8 lg:pl-10 pr-4 rounded-lg  lg:text-[13px] focus:outline-none focus:ring-1 focus:ring-border-light focus:bg-white bg-gray-100 text-sm placeholder:text-xs md:placeholder:text-sm lg:placeholder:text-[13px]"
      />
    </div>
  );
};

export default SearchBar;

