import apiClient from "../utils/apiClient";


export const userProductsService = {
     getProducts({ level1,level2,level3, page = 1, limit = 12, brand, color, size, sort,discount,search ,minPrice,maxPrice} = {}) {
  return apiClient.get('/products/get-products', {
    params: {  level1,level2,level3,page, limit, brand, color, size, sort ,discount,search,minPrice,maxPrice}
  })
},
    getSidebarFilters(level1,level2) {
  return apiClient.get('/products/get-sidebar-filter', { params: { level1,level2 } });
},
  getProductById(id){
    return apiClient.get(`/products/get-product-by-id/${id}`)
  },
  mergeCart(items){
    return apiClient.post('/products/cart/merge-cart',items)
  },
  getCart() {
    return apiClient.get("/products/cart");
  },

  addToCart(item) {
    return apiClient.post("/products/cart/add", item);
  },

  removeFromCart(variationId) {
    return apiClient.delete(`/products/cart/remove/${variationId}`);
  },

  updateCartQuantity(variationId, quantity) {
    return apiClient.put(`/products/cart/update/${variationId}`, { quantity });
  },
}
