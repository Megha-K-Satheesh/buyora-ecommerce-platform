import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../../components/ui/Navbar";
import { addToCart } from "../../Redux/slices/cartSlice";
import { getProductById } from "../../Redux/slices/general/productSlice";

const SingleProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, error, loading } = useSelector((state) => state.generalProducts);

const { token } = useSelector((state) => state.auth);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

useEffect(() => {
    if (product?.images?.length) setMainImage(product.images[0]);
  }, [product]);
  const handleAddToCart = () => {
  if (!selectedSize || !selectedColor) {
    alert("Please select size and color");
    return;
  }

  const selectedVariation = product.variations.find(
    (v) =>
      v.attributes.Size === selectedSize &&
      v.attributes.Color === selectedColor
  );

  if (!selectedVariation) return;

  const cartItem = {
    productId: product._id,
    variationId: selectedVariation._id,
    name: product.name,
     brandName :product.brand.name,
    image: mainImage,
    price: product.sellingPrice,
      mrp: product.mrp,             // backend MRP
  discountPercentage:  product.discountPercentage,
  
    size: selectedSize,
    color: selectedColor,
    quantity: 1,
  };

  if (token) {
    alert("Token exist")
    //dispatch(addToCartBackend(cartItem));
  } else {

    dispatch(addToCart(cartItem));
  }
};


  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  // useEffect(() => {
  //   if (product?.images?.length) setMainImage(product.images[0]);
  // }, [product]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!product) return <p className="text-center mt-10">Product not found</p>;

  // Unique sizes and colors from variations
  const sizes = [...new Set(product.variations.map(v => v.attributes.Size))];
  const colors = [...new Set(product.variations.map(v => v.attributes.Color))];

  return (
    <>
    <Navbar/>
      <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-8 mt-25">

     
     <div className="flex flex-col md:flex-row gap-4 flex-1">

  {/* Main Image */}
  <div className="order-1 md:order-2 flex-1 flex items-center justify-center rounded-lg p-2">
    <img
      src={mainImage}
      alt={product.name}
      className="w-full h-[400px] md:h-[500px] object-contain rounded-lg"
    />
  </div>

  {/* Thumbnails */}
  <div className="order-2 md:order-1 flex flex-row md:flex-col gap-10 lg:gap-2 mt-3 md:mt-0 ">
    {product.images.map((img, index) => (
      <img
        key={index}
        src={img}
        alt={`${product.name}-${index}`}
        className={`w-20 h-auto object-contain cursor-pointer rounded border-2 ${
          mainImage === img
            ? "border-pink-500"
            : "border-none"
        }`}
        onClick={() => setMainImage(img)}
      />
    ))}
  </div>

</div>


      {/* Right Column Product Info */}
      <div className="flex-1 flex flex-col mt-3">
        <h1 className="text-3xl font-bold">{product.brand.name}</h1>
        <p className="text-gray-400 mt-1 text-2xl "> {product.name}</p>
        {/* <p className="text-gray-600 mt-1">Category: {product.category.name}</p> */}
       

                    <div className="w-40 h-8 flex items-center justify-start gap-2  text-gray-400 rounded-xs border border-gray-200 px-3 py-4 mt-3">

            <h6 className="font-semibold text-xl flex items-center justify-center ">4.3</h6>
            <h6 className="text-xl flex items-center justify-center">1k Ratings</h6>
          </div>
            <p className="mt-5 text-gray-200"><hr/></p>

        

        <p className="mt-4 text-3xl font-semibold">
          ₹{product.sellingPrice}{" "}  <span className="text-gray-400 text-2xl font-normal ml-1">MRP</span> 
          <span className="line-through text-gray-400 text-2xl ml-1 ">
          
            ₹{Math.round(product.sellingPrice / (1 - product.discountPercentage / 100))}
          </span>{" "}
          <span className="text-orange-500 ml-2">({product.discountPercentage}% OFF)</span>
        </p>

        {/* Sizes */}
        <div className="mt-6">
          <h2 className="font-bold mb-2 text-lg">SELECT SIZE</h2>
          <div className="flex gap-2 flex-wrap mt-5 text-lg">
            {sizes.map(size => (
              <button
                key={size}
                className={`px-3 py-1 w-12 h-12 border rounded font-medium text-gray-800 ${selectedSize === size ? 'text-pink-500 border-pink-600' : 'border-gray-300 bg-white'}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="mt-4">
           <h2 className="font-bold mb-2 text-lg mt-2">SELECT COLOR</h2>
          <div className="flex gap-2 flex-wrap mt-4 text-lg">
            {colors.map(color => (
              <button
                key={color}
                className={`px-4 py-2 border rounded font-medium text-gray-800 ${selectedColor === color ? 'text-pink-500 border-pink-600' : 'border-gray-300 bg-white'}`}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-8 text-2xl">
          <button
            disabled={!selectedSize || !selectedColor}
            onClick={handleAddToCart}
            className={`flex-1 py-3 rounded text-white font-semibold bg-pink-600 ${selectedSize && selectedColor ? 'bg-pink-600 hover:bg-pink-700' : 'b cursor-not-allowed'}`}
          >
            Add to Cart
          </button>
          <button
            disabled={!selectedSize || !selectedColor}
            className="flex-1 py-3 rounded text-black border border-gray-400 font-semibold"
          >
            WishList
          </button>
        </div>

        {/* Description */}
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Product Description</h2>
          <p className="text-gray-700">{product.description}</p>
        </div>
      
      </div>
    
    </div>
  
    </>
  );
};

export default SingleProductPage;
