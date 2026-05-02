import apiClient from "../utils/apiClient";

export const userChatService = {
  

  getHistory() {
    return apiClient.get("/user/chat/history");
  },

 
};
