import { Document, model, Schema } from "mongoose";

interface ITrustBill extends Document {
    title: string
    description: string
    image: string
    amount: string
}


const trustSchema = new Schema<ITrustBill>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    amount: {
        type: String,
        required: true
    }
}, { timestamps: true, versionKey: false })

export default model<ITrustBill>("trustbill", trustSchema)