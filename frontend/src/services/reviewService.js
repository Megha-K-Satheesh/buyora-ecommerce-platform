import apiClient from "../utils/apiClient";

export const reviewService = {

  
  getReviews(productId) {
    return apiClient.get(`/user/reviews/${productId}`);
  },

 
  addReview(productId, formData) {
    return apiClient.post(`/user/reviews/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },

  toggleLike(reviewId) {
    return apiClient.patch(`/user/reviews/${reviewId}/like`);
  },


  deleteReview(reviewId) {
    return apiClient.delete(`/user/reviews/${reviewId}`);
  }

};
