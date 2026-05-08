




import { useEffect, useState } from "react";
import { IoMdCopy } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoupons } from "../../../Redux/slices/couponSlice";
import Navbar from "../../../components/ui/Navbar";
import Pagination from "../../../components/ui/Pagination";
import { showSuccess } from "../../../components/ui/Toastify";

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
    showSuccess(`Coupon code copied: ${code}`);
  };

  if (loading) return <p className="text-center py-10">Loading coupons...</p>;
  if (error) return <p className="text-center py-10 text-danger">{error}</p>;
  if (!coupons.length) return <p className="text-center py-10">No coupons available!</p>;

  return (
    <>
    <div className="lg:hidden block "><Navbar/></div>
    <div className="max-w-4xl lg:ml-20 py-8 px-4 mt-15">
      <h2 className="text-3xl font-bold mb-8 text-text-secondary "> Coupons</h2>

      <div className="flex flex-col gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon.couponId}
            className=" rounded-lg shadow hover:shadow-lg transition bg-bg-main p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-bold text-primary">{coupon.code}</span>
              <button
                className="text-primary text-2xl font-bold"
                onClick={() => handleCopy(coupon.code)}
                title="Copy Coupon Code"
              >
                <IoMdCopy />
              </button>
            </div>

            <div className="text-sm text-text-secondary space-y-1">
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

      <div className="mt-10">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
    </>
  );
};

export default CouponsList;
