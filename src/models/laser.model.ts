import { Document, model, Schema, Types } from "mongoose";

export interface IMLaser extends Document {
    title: string
    date: Date
    credit: number
    debit: number
    employee: Types.ObjectId
    employee_type: "c_employee" | "pt_employee"
}

const laserSchema = new Schema<IMLaser>({
    title: String,
    date: {
        type: Date,
        required: true
    },
    credit: {
        type: Number,
        default: 0
    },
    debit: {
        type: Number,
        default: 0
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: "EmployeeAuth",
        required: true
    },
    employee_type: {
        type: String,
        enum: ["c_employee", "pt_employee"],
        required: true
    }
}, { versionKey: false })

export default model<IMLaser>("LaserModel", laserSchema)