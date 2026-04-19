import chat_User from "../models/chat_User.js";
import messages_model from "../models/messages_model.js";


const onlineUsers = new Map();

export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // user join
    socket.on("join", async (userId) => {
      onlineUsers.set(userId, socket.id);

      await chat_User.findByIdAndUpdate(userId, {
        isOnline: true,
      });

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    // send message
    socket.on("sendMessage", async (data) => {
      const { senderId, receiverId, text, image } = data;

      const message = await messages_model.create({
        senderId,
        receiverId,
        text,
        image,
        delivered: true,
      });

      const receiverSocketId = onlineUsers.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", message);
      }
    });

    // typing
    socket.on("typing", ({ senderId, receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", senderId);
      }
    });

    // seen
    socket.on("seenMessage", async (messageId) => {
      await Message.findByIdAndUpdate(messageId, {
        seen: true,
      });
    });

    // disconnect
    socket.on("disconnect", async () => {
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);

          await User.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeen: new Date(),
          });
        }
      }

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });
  });
};