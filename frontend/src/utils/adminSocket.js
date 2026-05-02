
import { io } from "socket.io-client";

const adminSocket = io(import.meta.env.VITE_SOCKET_URL, {
  auth: {
    token: localStorage.getItem("adminAuthToken"),
  },
  withCredentials: true,
  transports: ["websocket"],
});

adminSocket.on("connect", () => {
  console.log("Admin Socket connected:", adminSocket.id);
});

adminSocket.on("disconnect", () => {
  console.log("Admin Socket disconnected");
});

adminSocket.on("connect_error", (err) => {
  console.log("Admin Socket error:", err.message);
});

export const listenAdminMessages = (callback) => {
  const handler = (data) => {
    callback(data);
  };

  adminSocket.on("receive_message", handler);

  return () => {
    adminSocket.off("receive_message", handler);
  };
};



export const sendAdminReply = (payload) => {
  adminSocket.emit("admin_reply", payload);
};



export const disconnectAdminSocket = () => {
  adminSocket.disconnect();
};

export default adminSocket;
