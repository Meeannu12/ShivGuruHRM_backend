import { Schema, model, Document } from "mongoose";

export interface IHoliday extends Document {
  title: string;
  date: Date;
  isMandatoryLeave: boolean;
  createdBy: Schema.Types.ObjectId;
}

const HolidaySchema = new Schema<IHoliday>(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    isMandatoryLeave: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee" },
  },
  { timestamps: true }
);

export default model<IHoliday>("Holiday", HolidaySchema);
