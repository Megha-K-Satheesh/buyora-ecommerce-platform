import { useNavigate } from "react-router-dom";
import PriceRange from "../ui/PriceRange";



const SidebarFilter = ({level1,level2,level3, filters,  selectedBrands, selectedColors, selectedSizes,  selectedDiscounts,  onFilterChange,  selectedPriceRange }) =>{ 
  
  
  const navigate = useNavigate()
  
  return(
  <div className="w-64  ml-7 mt-2  ">
    <h3 className="text-lg font-semibold mb-2">Filters</h3>
     <div className="border-r border-r-gray-200">

    {/* {filters.categories?.length > 0 && (
      <div className="  w-full border-t border-t-gray-200 py-3 ">
        <h4 className="font-medium mb-2 ml-4">CATEGORY</h4>
        {filters.categories.map((cat) => (
          <div key={cat._id} className="flex items-center mb-1 w-full ml-4">
            <input
              type="checkbox"
              checked={selectedCategory.includes(cat.slug)}
              onChange={() => onFilterChange("category", cat.slug)}
              className="mr-2"
            />
            <label>{cat.name}</label>
          </div>
        ))}
      </div>
    )} */}
        {filters.categories?.length > 0 && (
  <div className="w-full border-t border-t-gray-200 py-3">
    <h4 className="font-medium mb-2 ml-4">CATEGORY</h4>

    {filters.categories.map((cat) => (
      <div key={cat._id} className="flex items-center mb-1 w-full ml-4">
        <input
          type="checkbox"
          checked={level3 === cat.slug}  // ✅ use level3
          onChange={() =>
            navigate(`/${level1}/${level2}/${cat.slug}?page=1`)
          }
          className="mr-2"
        />
        <label>{cat.name}</label>
      </div>
    ))}
  </div>
)}

    {filters.brands?.length > 0 && (
      <div className=" border-t border-t-gray-200 py-3">
        <h4 className="font-medium mb-2 ml-4">BRAND</h4>
        {filters.brands.map((brand) => (
          <div key={brand._id} className="flex items-center mb-1 ml-4">
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand._id)}
              onChange={() => onFilterChange("brand", brand._id)}
              className="mr-2"
            />
            <label>{brand.name}</label>
          </div>
        ))}
      </div>
    )}



{filters?.priceRange &&
 filters.priceRange.min < filters.priceRange.max && (
  <div className="border-t border-t-gray-200 py-4">
    <h4 className="font-medium mb-4 ml-4">PRICE</h4>

    <div className="px-4 mt-10">
      <PriceRange
        minPrice={filters.priceRange.min}
        maxPrice={filters.priceRange.max}
        step={100}
        selectedPriceRange={selectedPriceRange}
        onChange={(vals) => onFilterChange("price", vals)}
      />
    </div>
  </div>
)}

    {filters.colors?.length > 0 && (
      <div className=" border-t border-t-gray-200 py-3">
        <h4 className="font-medium mb-2 ml-4">COLOR</h4>
        {filters.colors.map((color) => (
          <div key={color} className="flex items-center mb-1 ml-4">
            <input
              type="checkbox"
              checked={selectedColors.includes(color)}
              onChange={() => onFilterChange("color", color)}
              className="mr-2"
            />
            <label>{color}</label>
          </div>
        ))}
      </div>
    )}

    {filters.sizes?.length > 0 && (
      <div className=" border-t border-t-gray-200 py-4">
        <h4 className="font-medium mb-2 ml-4">SIZE</h4>
        {filters.sizes.map((size) => (
          <div key={size} className="flex items-center mb-1 ml-4">
            <input
              type="checkbox"
              checked={selectedSizes.includes(size)}
              onChange={() => onFilterChange("size", size)}
              className="mr-2"
            />
            <label>{size}</label>
          </div>
        ))}
      </div>
    )}
     {filters.discountRanges?.length > 0 && (
      <div className="mb-4 border-t border-t-gray-200 py-4">
        <h4 className="font-medium mb-2 ml-4">DISCOUNT</h4>
        {filters.discountRanges.map((range) => (
          <div key={range.value} className="flex items-center mb-1 ml-4">
            <input
              type="checkbox"
              checked={selectedDiscounts.includes(range.value)}
              onChange={() => onFilterChange("discount", range.value)}
              className="mr-2"
            />
            <label>{range.label}</label>
          </div>
        ))}
      </div>
    )}
     </div>
    
  </div>
)};

export default SidebarFilter;

