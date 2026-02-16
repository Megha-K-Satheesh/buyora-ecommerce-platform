import { useNavigate } from "react-router-dom";

const ProductGrid = ({ products = [] }) => {

  const navigate = useNavigate()
 const handleClick = (product) => {
  // navigate(
  //   `/${product.category.slug}/${product.brand.slug}/${product.slug}/${product._id}`
    
  // )
    navigate(`/product/${product.slug}/${product._id}`);
  
  ;
};

  if (!products.length) return <p>No Products Found</p>;

  return (
    <div className="grid grid-cols-4 gap-1 mb-2 p-2 ">
      {products.map((product) => (
        <div
          key={product._id}
          className="rounded-lg  m-10 p-4 hover:shadow-lg transition-shadow duration-300 "
          onClick={()=>handleClick(product)}
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-4.5/5 h-82 object-cover mb-3 rounded"
          />
          <p className="text-gray-500 text-sm mb-1">{product.brand.name}</p>
         <h3 className="font-medium text-gray-900 mb-2 truncate overflow-hidden whitespace-nowrap">
  {product.name}
</h3>
          <div className="flex items-center gap-2">
            <span className="text-pink-600 font-semibold">₹{product.sellingPrice}</span>
            <span className="text-gray-400 line-through">₹{product.mrp}</span>
            {product.discountPercentage > 0 && (
              <span className="text-orange-400 font-medium text-sm">
                ({product.discountPercentage}% OFF)
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;


