import { Document, model, Schema } from "mongoose";

export interface IMLeave extends Document {
  employee: Schema.Types.ObjectId;
  type: "sick" | "casual" | "paid" | "unpaid" | "emergency";
  reason?: string;
  startDate: Date;
  endDate: Date;
  status: "pending" | "approved" | "rejected";
  revertReason: string
  readBy: Schema.Types.ObjectId[]
}

const LeaveSchema = new Schema<IMLeave>(
  {
    employee: { type: Schema.Types.ObjectId, ref: "EmployeeAuth", required: true },
    type: { type: String, enum: ["sick", "casual", "paid", "unpaid", "emergency"], required: true },
    reason: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    readBy: [{ type: Schema.Types.ObjectId, ref: "EmployeeAuth" }],
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
