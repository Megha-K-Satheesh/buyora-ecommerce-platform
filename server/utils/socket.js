

const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const logger = require("./logger");
const AdminChatService = require("../services/AdminUserChatService");

let io;

const connectedUsers = new Map();

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

  

      if (!token) {
        console.log("NO TOKEN");
        return next(new Error("No token provided"));
      }

      let decoded;

      try {
        decoded = jwt.verify(token, process.env.JWT_USER_SECRET);
     
      } catch (err) {
        decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
      
      }

      socket.userId = decoded.id;
      socket.userRole = decoded.role || "user";

      

      next();
    } catch (error) {
      console.log("AUTH FAILED:", error.message);
      logger.error(error);
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
  

    

    socket.join(`user_${socket.userId}`);

   

    if (socket.userRole === "admin") {
      socket.join("admin_room");
     
    }


    connectedUsers.set(socket.id, {
      userId: socket.userId,
      role: socket.userRole,
    });

    



    
    socket.on("send_message", async (data) => {
      try {
       

        if ( !data.text) {
          console.log("INVALID DATA");
          return;
        }

        const savedMessage = await AdminChatService.sendMessage({
          userId: socket.userId,
          senderId: socket.userId,
          senderRole: socket.userRole,
          text: data.text,
        });

       

        io.to("admin_room").emit("receive_message", {
  ...savedMessage,
  userId: socket.userId,
});
io.to(`user_${socket.userId}`).emit("receive_message",{
  ...savedMessage,
  userId: socket.userId,
} );


        
      } catch (err) {
        console.log("SEND MESSAGE ERROR:", err.message);
      }
    });


socket.on("admin_reply", async (data) => {
  try {
   

    if (!data.userId || !data.text) {
      console.log("INVALID DATA");
      return;
    }

    const savedMessage = await AdminChatService.sendMessage({
      userId: data.userId,
      senderId: socket.userId,
      senderRole: "admin",
      text: data.text,
    });

  

    io.to(`user_${data.userId}`).emit("receive_message", {
      ...savedMessage,
      userId: data.userId,
    });

    io.to("admin_room").emit("receive_message", {
      ...savedMessage,
      userId: data.userId,
    });

    
  } catch (err) {
    console.log("ADMIN REPLY ERROR:", err.message);
  }
});





    socket.on("disconnect", () => {
      connectedUsers.delete(socket.id);
 
    });
  });

  return io;
};

const notifyUserBanned = (userId, userName, bannedBy) => {
  if (!io) return;

  console.log("USER BANNED:", userId);

  io.to(`user_${userId.toString()}`).emit("user_banned", {
    userId,
    userName,
    bannedBy,
    message: "Your account has been banned",
  });

  io.to("admin_room").emit("user_status_changed", {
    userId,
    userName,
    status: "banned",
    updatedBy: bannedBy,
  });
};

const notifyUserUnbanned = (userId, userName, unbannedBy) => {
  if (!io) return;

  console.log("USER UNBANNED:", userId);

  io.to(`user_${userId}`).emit("user_unbanned", {
    userId,
    userName,
    unbannedBy,
    message: "Your account has been unbanned",
  });

  io.to("admin_room").emit("user_status_changed", {
    userId,
    userName,
    status: "active",
    updatedBy: unbannedBy,
  });
};

const notifyForceLogout = (userId, userName, loggedOutBy) => {
  if (!io) return;

  console.log("FORCE LOGOUT:", userId);

  io.to(`user_${userId}`).emit("force_logout", {
    userId,
    userName,
    loggedOutBy,
    message: "You have been logged out",
  });

  io.to("admin_room").emit("user_force_logout", {
    userId,
    userName,
    loggedOutBy,
  });
};

const notifyAdmins = (event, data) => {
  if (!io) return;

  console.log("NOTIFY ADMINS:", event);

  io.to("admin_room").emit(event, data);
};

const isUserOnline = (userId) => {
  for (let socket of connectedUsers.values()) {
    if (socket.userId === userId) return true;
  }
  return false;
};



const getOnlineUsersCount = () => connectedUsers.size;

module.exports = {
  initializeSocket,
  notifyUserBanned,
  notifyUserUnbanned,
  notifyForceLogout,
  notifyAdmins,
  isUserOnline,
  getOnlineUsersCount,
};
