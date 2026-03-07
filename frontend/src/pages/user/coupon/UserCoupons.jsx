// // components/user/CouponsList.jsx
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllCoupons } from "../../../Redux/slices/couponSlice";
// import Pagination from "../../../components/ui/Pagination";



// const CouponsList = () => {
//   const dispatch = useDispatch();
//   const { coupons, totalCount, page: currentPage, limit, loading, error } = useSelector(
//     (state) => state.userCoupon
//   );

//   const [page, setPage] = useState(1);

//   useEffect(() => {
//     dispatch(getAllCoupons({ page, limit: 5 }));
//   }, [dispatch, page]);

//   const totalPages = Math.ceil(totalCount / limit);

//   if (loading) return <p className="text-center py-10">Loading coupons...</p>;
//   if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
//   if (!coupons.length) return <p className="text-center py-10">No coupons available!</p>;

//   return (
//     <div className="max-w-4xl  py-8 px-4">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Available Coupons</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {coupons.map((coupon) => (
//           <div
//             key={coupon.couponId}
//             className="relative border rounded-lg p-5 shadow hover:shadow-lg transition cursor-pointer bg-white"
//           >
//             {/* Discount Badge */}
//             <div className="absolute top-0 right-0 bg-pink-600 text-white px-3 py-1 rounded-bl-lg font-semibold">
//               {coupon.discountType === "PERCENTAGE"
//                 ? `${coupon.discountValue}% OFF`
//                 : `₹${coupon.discountValue} OFF`}
//             </div>

//             <h3 className="text-lg font-bold text-gray-800">{coupon.code}</h3>
//             {coupon.minOrderAmount > 0 && (
//               <p className="text-sm text-gray-500 mt-1">
//                 Minimum order ₹{coupon.minOrderAmount}
//               </p>
//             )}

//             <p className="text-gray-600 mt-2">
//               Valid till:{" "}
//               <span className="font-medium">
//                 {new Date(coupon.validTill).toLocaleDateString("en-IN")}
//               </span>
//             </p>

//             {coupon.scope === "CATEGORY" && coupon.applicableCategories.length > 0 && (
//               <p className="text-gray-600 mt-1 text-sm">
//                 Categories:{" "}
//                 {coupon.applicableCategories.map((cat) => cat.name).join(", ")}
//               </p>
//             )}

//             <button
//               className="mt-4 w-full bg-pink-600 text-white py-2 rounded-md font-semibold hover:bg-pink-700 transition"
//               onClick={() => alert(`Applied coupon: ${coupon.code}`)}
//             >
//               Apply Coupon
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Your existing pagination */}
//       <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
//     </div>
//   );
// };

// export default CouponsList;



// components/user/CouponsList.jsx
import { useEffect, useState } from "react";
import { IoMdCopy } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoupons } from "../../../Redux/slices/couponSlice";
import Pagination from "../../../components/ui/Pagination";

const CouponsList = () => {
  const dispatch = useDispatch();
  const { coupons, totalCount, page: currentPage, limit, loading, error } = useSelector(
    (state) => state.userCoupon
  );

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getAllCoupons({ page, limit: 5 }));
  }, [dispatch, page]);

  const totalPages = Math.ceil(totalCount / limit);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Coupon code copied: ${code}`);
  };

  if (loading) return <p className="text-center py-10">Loading coupons...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!coupons.length) return <p className="text-center py-10">No coupons available!</p>;

  return (
    <div className="max-w-4xl ml-20 py-8 px-4">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 "> Coupons</h2>

      <div className="flex flex-col gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon.couponId}
            className=" rounded-lg shadow hover:shadow-lg transition bg-white p-4"
          >
            {/* Header: Coupon Code + Copy Icon */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-bold text-pink-600">{coupon.code}</span>
              <button
                className="text-pink-600 text-2xl font-bold"
                onClick={() => handleCopy(coupon.code)}
                title="Copy Coupon Code"
              >
                <IoMdCopy />
              </button>
            </div>

            {/* Coupon Details */}
            <div className="text-sm text-gray-700 space-y-1">
              <p><span className="font-semibold">Description:</span> {coupon.description}</p>
              <p>
                <span className="font-semibold">Discount:</span>{" "}
                {coupon.discountType === "PERCENTAGE"
                  ? `${coupon.discountValue}%` +
                    (coupon.maxDiscount ? ` (Max ₹${coupon.maxDiscount})` : "")
                  : `₹${coupon.discountValue}`}
              </p>
              <p>
                <span className="font-semibold">Scope:</span>{" "}
                {coupon.scope === "CATEGORY"
                  ? `Category - ${coupon.applicableCategories.map((c) => c.name).join(", ")}`
                  : "Global"}
              </p>
              <p><span className="font-semibold">Minimum Order:</span> ₹{coupon.minOrderAmount}</p>
              <p>
                <span className="font-semibold">Validity:</span>{" "}
                {new Date(coupon.validFrom).toLocaleDateString("en-IN")} to{" "}
                {new Date(coupon.validTill).toLocaleDateString("en-IN")}
              </p>
              <p>
                <span className="font-semibold">First Order Only:</span>{" "}
                {coupon.isFirstOrderOnly ? "Yes" : "No"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-10">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default CouponsList;
