import adminApiClient from "../utils/adminApiClient";

export const adminChatService = {
  getAllChats() {
    return adminApiClient.get("/chat/all-chats");
  },

  getChat(userId) {
    return adminApiClient.get(`/chat/history/${userId}`);
  },

 
};
