import { model, Schema } from "mongoose";

interface IResign {
  userId: Schema.Types.ObjectId;
  employeeName: string;
  reason: string;
  //   sendTo: Schema.Types.ObjectId;
  status: "pending" | "accept" | "reject";
  readBy: Schema.Types.ObjectId[]
}

const resignSchema = new Schema<IResign>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    employeeName: String,
    reason: {
      type: String,
      required: true,
    },
    readBy: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
    // sendTo: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Employee",
    //   required: true,
    // },
    status: {
      type: String,
      enum: ["pending", "accept", "reject"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default model<IResign>("Resign", resignSchema);
