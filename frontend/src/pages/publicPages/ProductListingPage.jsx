import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ProductGrid from "../../components/general/ProductGrid";
import SidebarFilter from "../../components/general/SidebarFilter";
import Footer from "../../components/ui/Footer";
import Navbar from "../../components/ui/Navbar";
import Pagination from "../../components/ui/Pagination";
import { useQueryArray } from "../../hook/ConvertToArray";
import { getProducts, getSidebarFilters } from "../../Redux/slices/general/productSlice";

const ProductListingPage = () => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { level1, level2, level3 } = useParams();

  const { products, loading, filters, totalPages ,searchTerm} = useSelector(
    (state) => state.generalProducts
  );
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  // const searchQuery = queryParams.get("search") || "";
const minPrice = queryParams.get("minPrice");
const maxPrice = queryParams.get("maxPrice");


  const selectedCategories = useQueryArray("category");
  const selectedBrands = useQueryArray("brand");
  const selectedColors = useQueryArray("color");
  const selectedSizes = useQueryArray("size");
  const selectedDiscounts = useQueryArray("discount");
  const sort = queryParams.get("sort") || "";
  const page = parseInt(queryParams.get("page")) || 1;



const selectedPriceRange = [
  minPrice
    ? Number(minPrice)
    : filters?.priceRange?.min || 0,
  maxPrice
    ? Number(maxPrice)
    : filters?.priceRange?.max || 10000,
];
// const updateQuery = (key, value) => {
//   const params = new URLSearchParams(location.search);

//   const current = params.get(key)?.split(",") || [];

//   let updated;

//   if (current.includes(value)) {
//     updated = current.filter((v) => v !== value);
//   } else {
//     updated = [...current, value];
//   }

//   if (updated.length > 0) {
//     params.set(key, updated.join(","));
//   } else {
//     params.delete(key);
//   }

//   params.set("page", 1);

//   navigate(`?${params.toString()}`);
// };
const updateQuery = (key, value) => {
  const params = new URLSearchParams(location.search);

  if (key === "price") {
    params.set("minPrice", value[0]);
    params.set("maxPrice", value[1]);
    params.set("page", 1);
    navigate(`?${params.toString()}`);
    return;
  }

  const current = params.get(key)?.split(",") || [];
  let updated;

  if (current.includes(value)) {
    updated = current.filter((v) => v !== value);
  } else {
    updated = [...current, value];
  }

  if (updated.length > 0) {
    params.set(key, updated.join(","));
  } else {
    params.delete(key);
  }

  params.set("page", 1);
  navigate(`?${params.toString()}`);
};


 useEffect(() => {
  dispatch(getSidebarFilters({ level1: level1 || null, level2: level2 || null }));
}, [dispatch, level1, level2]);




console.log("LEVELS:", { level1, level2, level3 });
console.log(searchTerm)

  useEffect(() => {
    dispatch(
      getProducts({
     
        level1:level1|| null,
        level2:level2|| null,
        level3:level3|| null,
        brand: selectedBrands,
        color: selectedColors,
        size: selectedSizes,
        search:searchTerm,
         discount: selectedDiscounts,
        sort,
        page,
       minPrice,
       maxPrice,
        
        limit: 8,
      })
    );
  }, [dispatch,level1, level2, level3, selectedCategories,selectedBrands, selectedColors, selectedSizes,selectedDiscounts,searchTerm, sort, page,minPrice,maxPrice]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen  mt-23 lg:mx-10">
        <div className="bg-pink-200-200 p-4">
          <div>{`${level1}/${level2}/${level3 || ""}`}</div>
          <div>Total products: {products?.length}</div>
        </div>

        <div className="flex">
          <div className="flex-1 hidden lg:block">

          <SidebarFilter
           level1={level1}
  level2={level2}
  level3={level3}
            filters={filters}
            selectedCategory={selectedCategories}
            selectedBrands={selectedBrands}
            selectedColors={selectedColors}
            selectedSizes={selectedSizes}
            selectedDiscounts={selectedDiscounts}
            onFilterChange={updateQuery}
            selectedPriceRange={selectedPriceRange}
          />
          </div>
          <div className=" flex-5   ">
            
            {/* <div className=" flex justify-end mb-2 font-medium">
              
             <select
              value={sort}
              onChange={(e) => {
                const params = new URLSearchParams(location.search);
                params.set("sort", e.target.value);
                params.set("page", 1);
                navigate(`?${params.toString()}`);
              }}
              className="border border-gray-200 p-2 rounded"
            >
              <option value="">Relevance</option>
              <option value="priceAsc">Price Low to High</option>
              <option value="priceDesc">Price High to Low</option>
              <option value="newest">Newest First</option>
            </select>
            </div> */}
              <div className="flex justify-between items-center mb-2 gap-2 lg:justify-end mx-2">
  {/* Sort dropdown */}
  <select
    value={sort}
    onChange={(e) => {
      const params = new URLSearchParams(location.search);
      params.set("sort", e.target.value);
      params.set("page", 1);
      navigate(`?${params.toString()}`);
    }}
    className="border border-gray-200 p-2 rounded"
  >
    <option value="">Relevance</option>
    <option value="priceAsc">Price Low to High</option>
    <option value="priceDesc">Price High to Low</option>
    <option value="newest">Newest First</option>
  </select>

  {/* Mobile Filter button */}
  <button
    onClick={() => setMobileFilterOpen(true)}
    className="lg:hidden  text-black border border-gray-300 px-4 py-2 rounded"
  >
    Filter
  </button>
  {mobileFilterOpen && (
  <>
    {/* Overlay */}
    <div
      className="fixed inset-0 bg-black bg-opacity-30 z-40"
      onClick={() => setMobileFilterOpen(false)}
    />

    {/* Sliding panel */}
    <div className="fixed top-0 left-0 w-85 h-full bg-white z-50 overflow-auto shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Filters</h3>
        <button
          onClick={() => setMobileFilterOpen(false)}
          className="text-xl font-bold"
        >
          X
        </button>
      </div>

     
      <SidebarFilter
        level1={level1}
        level2={level2}
        level3={level3}
        filters={filters}
        selectedCategory={selectedCategories}
        selectedBrands={selectedBrands}
        selectedColors={selectedColors}
        selectedSizes={selectedSizes}
        selectedDiscounts={selectedDiscounts}
        onFilterChange={updateQuery}
          selectedPriceRange={selectedPriceRange} 
      />
    </div>
  </>
)}

</div>

            <div className="border-t border-t-gray-200 ">

            {loading ? <p>Loading...</p> : <ProductGrid products={products} />}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => {
                const params = new URLSearchParams(location.search);
                params.set("page", newPage);
                navigate(`?${params.toString()}`);
              }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductListingPage;

