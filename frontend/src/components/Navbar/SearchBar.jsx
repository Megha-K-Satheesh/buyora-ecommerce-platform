import { FiSearch } from "react-icons/fi"


const SearchBar=()=>{
  return(
    <>
     <div className="relative">
      <FiSearch className="absolute left text-xl
      text-gray-600
  mt-2 ml-1   md:mt-3 md:ml-1 lg:mt-3 lg:ml-1"/>
      <input type="text" placeholder="Search..." 
      className="   w-64 md:w-130 lg:w-130
        h-9 md:h-11  lg:h-11
          pl-10 pr-4
          rounded-lg
         text:sm md:text-xl lg:text-xl

          border border-gray-300
          focus:outline-none focus:ring-2 focus:ring-pink-500"/>
     </div>
    </>
  )
}
export default SearchBar
