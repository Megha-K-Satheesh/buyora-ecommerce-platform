



import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addReview } from "../../Redux/slices/reviewSlice";
import Button from "../../components/ui/Button";
import Navbar from "../../components/ui/Navbar";
import ReviewImageUpload from "../../components/ui/ReviweImageUpload";
import { showError, showSuccess } from "../../components/ui/Toastify";

const AddReviewPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.review);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const [rating, setRating] = useState(0);
  const [files, setFiles] = useState([]);

  const renderStars = () => {
    return (
      <div className="flex gap-2 text-2xl cursor-pointer">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            onClick={() => setRating(star)}
            className={star <= rating ? "text-yellow-500" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  const onSubmit = async (data) => {
    if (!rating) {
      showError("Please select rating");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("rating", rating);
      formData.append("comment", data.comment);

      files.forEach((file) => {
        formData.append("images", file);
      });

      await dispatch(addReview({ productId, formData })).unwrap();

      showSuccess("Review added successfully");
      navigate(-1); 
    } catch (err) {
      showError(err || "Failed to add review");
    }
  };

  return (
    <>
      <Navbar/>
      <div className="flex justify-center items-start bg-[#FFF1F6] min-h-screen pt-24 mt-22">
        <div className="bg-white rounded-2xl w-[90%] md:w-[500px] p-6 shadow-md">

          <h1 className="text-2xl font-bold text-center mb-6">
            Add Review
          </h1>

          <form onSubmit={handleSubmit(onSubmit)}>

            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Rating
              </label>
              {renderStars()}
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Comment
              </label>
              <textarea
                rows="4"
                placeholder="Write your review..."
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                {...register("comment", {
                  required: "Comment is required",
                  minLength: {
                    value: 5,
                    message: "Minimum 5 characters"
                  }
                })}
              />
              {errors.comment && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.comment.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Upload Images
              </label>

              <ReviewImageUpload
                files={files}
                setFiles={setFiles}
                max={5}
              />
            </div>

            <Button type="submit">
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddReviewPage;
