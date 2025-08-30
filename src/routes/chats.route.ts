import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  GetChatConversations,
  getChatsMessages,
} from "../controllers/chats.controller";

const chatRoute = Router();

// get all privious chat one to one and groups also
chatRoute.get("/GetChatConversations", authMiddleware, GetChatConversations);
chatRoute.get("/getChatsMessages/:conversationId", authMiddleware, getChatsMessages);

export default chatRoute;
