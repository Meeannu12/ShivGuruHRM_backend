import { Document, model, Schema } from "mongoose";

export interface IMNoticfication extends Document {
  title: string;
  message: string;
  createdBy: Schema.Types.ObjectId;
  readBy: Schema.Types.ObjectId[];
}

const NotificationSchema = new Schema<IMNoticfication>(
  {
    title: String,
    message: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
    readBy: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
  },
  { timestamps: true }
);

export default model<IMNoticfication>("Notification", NotificationSchema);
