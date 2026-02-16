import { useEffect, useMemo } from "react";
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { level1, level2, level3 } = useParams();

  const { products, loading, filters, totalPages } = useSelector(
    (state) => state.generalProducts
  );

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const selectedCategories = useQueryArray("category");
  const selectedBrands = useQueryArray("brand");
  const selectedColors = useQueryArray("color");
  const selectedSizes = useQueryArray("size");
  const selectedDiscounts = useQueryArray("discount");
  const sort = queryParams.get("sort") || "";
  const page = parseInt(queryParams.get("page")) || 1;

const updateQuery = (key, value) => {
  const params = new URLSearchParams(location.search);

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
    if (level2) dispatch(getSidebarFilters({level1,level2}));
  }, [dispatch,level1, level2]);




console.log("LEVELS:", { level1, level2, level3 });


  useEffect(() => {
    dispatch(
      getProducts({
     
        level1:level1|| null,
        level2:level2|| null,
        level3:level3|| null,
        brand: selectedBrands,
        color: selectedColors,
        size: selectedSizes,
         discount: selectedDiscounts,
        sort,
        page,
        limit: 8,
      })
    );
  }, [dispatch,level1, level2, level3, selectedCategories,selectedBrands, selectedColors, selectedSizes,selectedDiscounts, sort, page]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen  mt-23 mx-10">
        <div className="bg-pink-200-200 p-4">
          <div>{`${level1}/${level2}/${level3 || ""}`}</div>
          <div>Total products: {products?.length}</div>
        </div>

        <div className="flex">
          <div className="flex-1 ">

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
          />
          </div>
          <div className=" flex-5   ">
            <div className=" flex justify-end mb-2 font-medium">
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

