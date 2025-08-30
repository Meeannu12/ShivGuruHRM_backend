import mongoose, { Document, model, Schema } from "mongoose";

export interface IMessageModel extends Document {
  sender: Schema.Types.ObjectId;
  conversation: Schema.Types.ObjectId;
  message: string;
  isRead: boolean;
}

const MessageSchema = new Schema<IMessageModel>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "Employee" },
    conversation: { type: Schema.Types.ObjectId, ref: "Conversation" },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IMessageModel>("Messages", MessageSchema);
// module.exports = mongoose.model("Message", messageSchema);
