import { Document, model, Schema } from "mongoose";

export interface IMLeave extends Document {
  employee: Schema.Types.ObjectId;
  approver: Schema.Types.ObjectId;
  type: "sick" | "casual" | "earned";
  reason?: string;
  startDate: Date;
  endDate: Date;
  status: "pending" | "approved" | "rejected";
}

const LeaveSchema = new Schema<IMLeave>(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    approver: { type: Schema.Types.ObjectId, ref: "Employee" },
    type: { type: String, enum: ["sick", "casual", "earned"], required: true },
    reason: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default model<IMLeave>("Leave", LeaveSchema);
