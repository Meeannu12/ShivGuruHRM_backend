import { Document, model, Schema } from "mongoose";

export interface IMLeave extends Document {
  employee: Schema.Types.ObjectId;
  type: "sick" | "casual" | "compensatory";
  reason?: string;
  startDate: Date;
  endDate: Date;
  status: "pending" | "approved" | "rejected";
  revertReason: string
  readBy: Schema.Types.ObjectId[]
}

const LeaveSchema = new Schema<IMLeave>(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    type: { type: String, enum: ["sick", "casual", "compensatory"], required: true },
    reason: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    readBy: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    revertReason: String
  },
  { timestamps: true }
);

export default model<IMLeave>("Leave", LeaveSchema);
