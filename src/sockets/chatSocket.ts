import jwt from "jsonwebtoken";
import MessageModel from "../models/message.model";
import { Server, Socket } from "socket.io";
import mongoose from "mongoose";
// import ConversationModel from "../models/conversation.model";

interface AuthSocket extends Socket {
  user?: any; // ya phir specific type like: { id: string, name: string }
}

// let onlineUsers = new Map<string, string>();
// Map to store userId -> socketId
const onlineUsers = new Map<string, string>();

const chatSocket = (io: Server) => {
  // 🔑 middleware: token check
  io.use((socket: AuthSocket, next: any) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token provided"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      // console.log("auth", decoded);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (socket: AuthSocket) => {
    // console.log("User Connected id", socket.user.userId);
    // console.log("Socket Id", socket.id);

    // Online user story in map
    onlineUsers.set(socket.user.userId, socket.id);

    // console.log("user Map", onlineUsers);

    // Step 1: jab user online aaye to unread messages bhejo
    const unreadMessages = await MessageModel.find({
      receiver: socket.user.userId,
      isRead: false,
    });

    if (unreadMessages.length > 0) {
      io.to(socket.id).emit("unreadCount", {
        count: unreadMessages.length,
        messages: unreadMessages,
      });
    }

    // Join conversation room
    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
      // console.log(`Joined conversation ${conversationId}`);
    });

    // Send message
    socket.on("sendMessage", async (data) => {
      console.log(data);
      try {
        const newMessage = await MessageModel.create({
          conversation: new mongoose.Types.ObjectId(data.conversationId),
          sender: new mongoose.Types.ObjectId(socket.user.userId),
          message: data.message,
        });

        // Message create hone ke baad populate karo
        const populatedMessage = await MessageModel.findById(
          newMessage._id
        ).populate("sender", "name"); // jo fields chahiye wo select kar
        // .populate("conversation", "name"); // agar group ka naam bhi chahiye

        io.to(data.conversationId).emit("receiveMessage", populatedMessage);
      } catch (err) {
        console.error("Error creating message:", err);
        socket.emit("error", {
          message: "There was an error while sending the message.",
        });
      }
    });

    // 🔹 Step 3: jab user chat open kare to mark as read
    socket.on("markAsRead", async (senderId: any) => {
      await MessageModel.updateMany(
        { sender: senderId, receiver: socket.user.userId, isRead: false },
        { $set: { isRead: true } }
      );
    });

    // 🔹 Step 4: disconnect hone par hatao
    socket.on("disconnect", () => {
      onlineUsers.delete(socket.id);
      console.log(onlineUsers);
      console.log("❌ User disconnected:", socket.id);
    });
  });
};

export { chatSocket };
