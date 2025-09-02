import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import ConversationModel from "../models/conversation.model";
import messageModel from "../models/message.model";

// GET /conversations/:userId
export const GetChatConversations = async (req: AuthRequest, res: Response) => {
  //   const userId = req.params.userId;
  const userId = req.user.userId;

  try {
    const conversations = await ConversationModel.find({
      participants: userId,
    })
      .populate("participants", "name photo") // sirf naam & pic laa
      .sort({ lastMessageAt: -1 });

    // console.log("user chats", conversations);
    res.status(200).json({ success: false, conversations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /conversations create group conversation
export const createConversation = async (req: AuthRequest, res: Response) => {
  const { participants, isGroup, groupName } = req.body;

  try {
    let conversation;

    if (!isGroup && participants.length === 2) {
      // One-to-one: check existing
      conversation = await ConversationModel.findOne({
        participants: { $all: participants, $size: 2 },
        isGroup: false,
      });
    }

    if (!conversation) {
      conversation = await ConversationModel.create({
        participants,
        isGroup,
        groupName,
      });
    }

    res.status(201).json(conversation);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /messages/:conversationId
export const getChatsMessages = async (req: AuthRequest, res: Response) => {
  const { conversationId } = req.params;

  try {
    // const twoDaysAgo = new Date();
    // twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const messages = await messageModel
      .find({
        conversation: conversationId,
        // createdAt: { $gte: twoDaysAgo }, // ✅ last 2 days ke messages hi
      })
      .sort({
        createdAt: 1,
      })
      .populate("sender", "name")
      .populate({
        path: "conversation",
        populate: {
          path: "participants", // conversation ke andar ke participants populate
          select: "name email", // jo fields chahiye unhe select kar
        },
      });

    res.status(200).json({ success: true, messages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
