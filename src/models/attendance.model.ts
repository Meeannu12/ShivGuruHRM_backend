import mongoose, { Schema, Document } from "mongoose";

export interface IAttendance extends Document {
  userId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  checkIn?: Date;
  checkOut?: Date;
  staffId?: string;
  totalHours?: number; // decimal hours
  status: "present" | "absent" | "half-day" | "leave";
  name?: string;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    staffId: { type: String },
    checkIn: { type: Date },
    status: { type: String, enum: ["present", "absent", "half-day", "leave"] },
    checkOut: { type: Date },
    totalHours: { type: Number },
    name: { type: String },
  },
  { timestamps: true }
);

AttendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model<IAttendance>("Attendance", AttendanceSchema);
