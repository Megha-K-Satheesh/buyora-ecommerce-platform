import apiClient from "../utils/apiClient";


export const userProductsService = {
     getProducts({ level1,level2,level3, page = 1, limit = 12, brand, color, size, sort,discount } = {}) {
  return apiClient.get('/products/get-products', {
    params: {  level1,level2,level3,page, limit, brand, color, size, sort ,discount}
  })
},
    getSidebarFilters(level1,level2) {
  return apiClient.get('/products/get-sidebar-filter', { params: { level1,level2 } });
},
  getProductById(id){
    return apiClient.get(`/products/get-product-by-id/${id}`)
  }
}
