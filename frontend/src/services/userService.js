import apiClient from "../utils/apiClient"



export const userService = {

     getUserProfile (data){
        return apiClient.get('/user/me',data)
     },
     addAddress(data){
      return apiClient.post('/user/add-address',data)
     },
     getAddresses(){
      return apiClient.get('/user/get-address')
     },
     getAddressById(addressId){
      return apiClient.get(`/user/address/${addressId}`)
     },
     updateAddress(addressId,data){
      return apiClient.put(`/user/edit-address/${addressId}`,data)
     },
     deleteAddress(addressId) {
       return apiClient.delete(`/user/delete-address/${addressId}`);
}

}
