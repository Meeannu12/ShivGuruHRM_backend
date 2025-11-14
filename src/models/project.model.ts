import { Document, model, Schema } from "mongoose";

export interface IProject extends Document {
  name: string;
  code: string;
  assignDate: Date;
  deadline: Date;
  submitDate?: Date;
  client: Schema.Types.ObjectId;
  staff: Schema.Types.ObjectId;
  language: string;
  amount: string;
  status: "pending" | "running" | "complete";
  //   completedAt?: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    code: {
      type: String,
      unique: true,
      required: true,
    },
    assignDate: { type: Date, required: true },
    deadline: { type: Date, required: true },
    submitDate: Date,
    client: {
      type: Schema.Types.ObjectId,
      ref: "Clients",
      required: true,
    },
    staff: {
      type: Schema.Types.ObjectId,
      ref: "EmployeeAuth",
      required: true
    },
    language: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "running", "complete"],
      default: "pending",
    },
    amount: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IProject>("Project", ProjectSchema);
