import { memo } from "react";
import { FiSearch } from "react-icons/fi";


const SearchInput =memo( ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) => {
  return (
    <>
      <div className="relative">
      
           <FiSearch className="absolute left text-xl
           text-gray-600
       -mt-5 ml-1   md:mt-3 md:ml-1 lg:mt-3 lg:ml-1"/>
       <div className="rounded-lg     bg-white">

    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={` px-7 py-3 rounded-lg focus:outline-none  w-full focus:ring-2 shadow-sm focus:ring-pink-500 ${className} `}
      />
       </div>
      
      </div>
          
     
      </>
  );
});

export default SearchInput;
