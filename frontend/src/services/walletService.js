
import apiClient from "../utils/apiClient";

export const walletService = {

 
  getWallet(page = 1, limit = 5) {
    return apiClient.get("/user/wallet/wallet-balance", {
      params: { page, limit } 
    });
  }

};
