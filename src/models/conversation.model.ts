// conversation.model.ts
import mongoose, { Document, Schema, model } from "mongoose";

export interface IConversationModel extends Document {
  participants: Schema.Types.ObjectId;
  lastMessage: string;
  lastMessageAt: Date;
  isGroup: boolean;
  groupName: string;
}

const conversationSchema = new Schema<IConversationModel>(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    ],
    isGroup: { type: Boolean, default: false },
    groupName: { type: String }, // agar group hai to naam rakhna
    lastMessage: { type: String },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IConversationModel>(
  "Conversation",
  conversationSchema
);
