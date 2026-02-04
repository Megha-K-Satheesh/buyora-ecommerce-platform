import adminApiClient from "../utils/adminApiClient"




export const adminService = {
   addCategory (data){
    return adminApiClient.post('/category/add-category',data)
   },
   getCategory(){
    return adminApiClient.get('/category/get-category')
   },
   categoriesTable(page=1,limit=10){
      return adminApiClient.get(`/category/categories-table?page=${page}&limit=${limit}`)
   },
    updateCategory(categoryId,data) {
      return adminApiClient.put(`/category/update-category/${categoryId}`,data)
   },
   deleteCategory(categoryId){
      return adminApiClient.delete(`/category/delete-category/${categoryId}`)
   }
}
