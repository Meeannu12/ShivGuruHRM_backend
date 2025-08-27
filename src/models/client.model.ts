import { Document, model, Schema } from "mongoose";

export interface IClient extends Document {
  name: string;
  phone: string;
  address: string;
  email: string;
}

const ClientSchema = new Schema<IClient>(
  {
    name: String,
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    address: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IClient>("Clients", ClientSchema);
