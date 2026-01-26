import adminApiClient from "../utils/adminApiClient"



export const adminAuthService = {
    login(data){
      return   adminApiClient.post('/login',data)
    }    
}

export default adminAuthService
