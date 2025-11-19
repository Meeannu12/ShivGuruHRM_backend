import { Document, model, Schema } from "mongoose";

export interface IMNoticfication extends Document {
  title: string;
  message: string;
  createdBy: Schema.Types.ObjectId;
  image: string
  readBy: Schema.Types.ObjectId[];
}

const NotificationSchema = new Schema<IMNoticfication>(
  {
    title: String,
    message: String,
    image: { type: String, default: null },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "EmployeeAuth",
    },
    readBy: [{ type: Schema.Types.ObjectId, ref: "EmployeeAuth" }],
  },
  { timestamps: true }
);

export default model<IMNoticfication>("Notification", NotificationSchema);
