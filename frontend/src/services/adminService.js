import adminApiClient from "../utils/adminApiClient"




export const adminService = {
   addCategory (data){
    return adminApiClient.post('/category/add-category',data)
   },
   getCategory(){
    return adminApiClient.get('/category/get-category')
   }
}
