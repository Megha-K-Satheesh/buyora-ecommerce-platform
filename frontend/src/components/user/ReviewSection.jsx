


import { memo, useEffect } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteReview, getReviews, toggleLike } from "../../Redux/slices/reviewSlice";
import { showError, showInfo, showSuccess } from "../ui/Toastify";


const ReviewItem = memo(({ review, user, handleLike, handleDelete }) => {
  const isOwner = user?._id === review.user?._id;
  const isLiked = review.likes?.some((id) => id.toString() === user?._id);

  return (
    <div className="border-b border-gray-200 py-4">
      <p className="text-gray-800 text-xl flex items-center gap-2">
        <span className="bg-green-600 text-white text-xs px-1 py-0.5 rounded">
          {review.rating}★
        </span>
        {review.comment}
      </p>

      {review.images?.length > 0 && (
        <div className="flex gap-2 mt-2">
          {review.images.map((img, i) => (
            <img key={i} src={img} alt="" className="w-20 h-20 object-cover rounded" />
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-2 text-gray-500 text-sm">
        <p>
          {review.user?.name || "Anonymous"} |{" "}
          {new Date(review.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>

        <button
          onClick={() => handleLike(review._id)}
          className={`flex items-center gap-1 ${isLiked ? "text-pink-600" : "text-gray-500"}`}
        >
          {isLiked ? <AiFillLike /> : <AiOutlineLike />}
          <span className="w-5 text-center">{review.likes?.length || 0}</span>
        </button>
      </div>

      {isOwner && (
        <button onClick={() => handleDelete(review._id)} className="text-red-500 text-xs mt-1">
          Delete
        </button>
      )}
    </div>
  );
});

const ReviewSection = ({ productId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { reviews, stats, error } = useSelector((state) => state.review);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (productId) dispatch(getReviews(productId));
  }, [dispatch, productId]);

  const handleDelete = async (reviewId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this review?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteReview(reviewId)).unwrap();
        showSuccess("Review deleted successfully");
        if (productId) dispatch(getReviews(productId));
      } catch (err) {
        showError(err);
      }
    }
  };

  const handleLike = (reviewId) => {
    if (!token) return showInfo("Please login to like reviews");
    dispatch(toggleLike(reviewId));
  };

  const handleAddReview = () => {
    if (!token) return showInfo("Please login to add review");
    navigate(`/add-review/${productId}`);
  };

  
  
  if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;

  const totalReviews = stats?.totalReviews || 0;
  const avgRating = stats?.avgRating || 0;
  const ratingCounts = stats?.ratingCounts || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const allImages = reviews?.flatMap((r) => r.images || []) || [];

  return (
    <div className="mt-12 max-w-3xl mx-auto px-4 min-h-[400px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Customer Reviews ({totalReviews})</h2>
        <button onClick={handleAddReview} className="bg-pink-600 text-white px-4 py-2 rounded">
          Add Review
        </button>
      </div>

      {/* Stats */}
      {totalReviews > 0 && (
        <div className="flex gap-10 border-b border-gray-300 pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold">{avgRating} ★</h1>
            <p className="text-gray-500 text-sm">{totalReviews} Reviews</p>
          </div>

          <div className="flex flex-col gap-2 w-full max-w-sm">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingCounts[star] || 0;
              const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span>{star}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded">
                    <div className="h-2 bg-green-500 rounded" style={{ width: `${percent}%` }} />
                  </div>
                  <span>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Customer Images */}
      {allImages.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Customer Photos ({allImages.length})</h3>
          <div className="flex gap-2">
            {allImages.slice(0, 6).map((img, i) => (
              <img key={i} src={img} alt="" className="w-16 h-16 object-cover rounded" />
            ))}
          </div>
        </div>
      )}

      {/* Review List */}
      {reviews?.length === 0 ? (
        <div className="text-center text-gray-500 mt-6">No reviews yet</div>
      ) : (
        reviews.map((review) => (
          <ReviewItem
            key={review._id}
            review={review}
            user={user}
            handleLike={handleLike}
            handleDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
};

export default ReviewSection;
