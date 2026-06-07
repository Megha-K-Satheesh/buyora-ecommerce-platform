
import { io } from "socket.io-client";

let socket = null;

export const connectSocket = () => {
  if (socket) return socket;

  const token = localStorage.getItem("authToken");
  if (!token) return null;

  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: { token },
    withCredentials: true,
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
    // socket = null;
  });

  socket.on("connect_error", (err) => {
    console.log("Socket connection error:", err.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    // socket = null;
  }
};

export const sendMessage = (payload) => {
  if (!socket) return;
  socket.emit("send_message", payload);
};

export const sendAdminReply = (payload) => {
  if (!socket) return;
  socket.emit("admin_reply", payload);
};

export const listenMessages = (callback) => {
  if (!socket) return;

  const handler = (data) => callback(data);

  socket.off("receive_message", handler);
  socket.on("receive_message", handler);

  return () => {
    socket.off("receive_message", handler);
  };
};

export const listenUserStatus = (onBanned, onForceLogout, onUnbanned) => {
  if (!socket) return;

  if (onBanned) {
    socket.off("user_banned", onBanned);
    socket.on("user_banned", onBanned);
  }

  if (onForceLogout) {
    socket.off("force_logout", onForceLogout);
    socket.on("force_logout", onForceLogout);
  }

  if (onUnbanned) {
    socket.off("user_unbanned", onUnbanned);
    socket.on("user_unbanned", onUnbanned);
  }

  return () => {
    if (onBanned) socket.off("user_banned", onBanned);
    if (onForceLogout) socket.off("force_logout", onForceLogout);
    if (onUnbanned) socket.off("user_unbanned", onUnbanned);
  };
};

export const getSocket = () => socket;
