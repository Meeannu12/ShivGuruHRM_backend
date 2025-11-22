import { Schema, model, Document } from "mongoose";

interface ITask extends Document {
  title: string;
  description?: string;
  assignedTo: Schema.Types.ObjectId; // User (Employee)
  createdBy: Schema.Types.ObjectId; // Manager/Admin
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed" | "reAssign" | "submit";
  deadline?: Date;
  reassign?: Date;
  completedAt?: Date;
  readBy: Schema.Types.ObjectId[]
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "EmployeeAuth",
      required: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "EmployeeAuth", required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "submit", "reAssign", "submit"],
      default: "pending",
    },
    deadline: { type: Date },
    reassign: { type: Date },
    completedAt: { type: Date },
    readBy: [{ type: Schema.Types.ObjectId, ref: "Employee" }]
  },
  { timestamps: true }
);

export default model<ITask>("Task", TaskSchema);
