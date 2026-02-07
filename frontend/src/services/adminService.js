import adminApiClient from "../utils/adminApiClient"




export const adminService = {
   addCategory (data){
    return adminApiClient.post('/category/add-category',data)
   },
   getCategory(){
    return adminApiClient.get('/category/get-category')
   },
   categoriesTable(page=1,limit=10,
  level = "",
status="",
search=""){
      return adminApiClient.get(`/category/categories-table?page=${page}&limit=${limit}&level=${level}&status=${status}&search=${search}`)
   },
    updateCategory(categoryId,data) {
      return adminApiClient.put(`/category/update-category/${categoryId}`,data)
   },
   deleteCategory(categoryId){
      return adminApiClient.delete(`/category/delete-category/${categoryId}`)
   },
   getCategoryById(categoryId){
      return adminApiClient.get(`/category/get-category-by-id/${categoryId}`)
   },
   addProduct(formData) {
  return adminApiClient.post("/product/add-product",formData, {
    headers: { "Content-Type": "multipart/form-data" }
  })
},
}
