import mongoose, { Document, model, Schema } from "mongoose";

export interface IClientHistory extends Document {
  client: mongoose.Types.ObjectId;
  remainingAmount: string;
  creditAmount: string;
  //   pendingAmount: string;
}

const ClientHistory = new Schema<IClientHistory>(
  {
    client: { type: Schema.Types.ObjectId, ref: "Clients" },
    remainingAmount: {
      type: String,
      required: true,
    },
    creditAmount: {
      type: String,
      required: true,
    },

    // pendingAmount: {
    //   type: String,
    //   required: true,
    // },
  },
  { timestamps: true }
);

export default model<IClientHistory>("ClientHistory", ClientHistory);
