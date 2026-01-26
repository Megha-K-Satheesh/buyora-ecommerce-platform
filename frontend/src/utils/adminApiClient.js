import axios from "axios";
import { getAdminToken } from "./authToken";




   const adminApiClient= axios.create({
    
   baseURL:'http://localhost:5000/api/admin',
   headers:{
    'Content-Type' :'application/json'
   }
})

adminApiClient.interceptors.request.use((config)=>{
    const token = getAdminToken()
      if(token){
        config.headers.Authorization = `Bearer ${token}`
      }
    return config
})
export default adminApiClient
