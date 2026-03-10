import apiClient from "../utils/apiClient";

export const userWishlistService = {


  getWishlist({ page = 1, limit = 10 }) {
    return apiClient.get(`/user/wishlist/get-wishlist?page=${page}&limit=${limit}`);
  },


  addToWishlist({ productId }) {
    return apiClient.post("/user/wishlist/add-wishlist", { productId });
  },


  removeFromWishlist(productId) {
    return apiClient.delete(`/user/wishlist/remove-wishlist/${productId}`);
  },

 
  moveToCart({ productId, variationId, size, color, quantity = 1 }) {
  return apiClient.post("/user/wishlist/move-to-cart", {
    productId,
    variationId,
    size,
    color,
    quantity
  })
}

};
