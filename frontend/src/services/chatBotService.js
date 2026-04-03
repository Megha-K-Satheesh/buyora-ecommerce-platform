import apiClient from "../utils/apiClient";

export const chatbotService = {


  sendMessage(message) {
    return apiClient.post("/user/chat-bot/send-message", { message });
  },

 
  getHistory() {
    return apiClient.get("/user/chat-bot/history");
  },

 
  clearChat() {
    return apiClient.delete("/user/chat-bot/clear");
  }
};
